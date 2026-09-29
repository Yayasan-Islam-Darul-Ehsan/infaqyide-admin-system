import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Icons from '@/components/ui/Icon'
import { SYSADMIN_API } from '@/utils/api'
import {
    PALET, LABEL_JENIS, LABEL_CHANNEL, RM, RMRingkas, Nombor, Peratus, Delta, Panel, KpiTile, Legend,
    ChartTooltip, BarKomposisi, HeatmapMasa, formatBulan, formatTarikh
} from './komponen'

const JENIS = ['Infaq', 'Auto-Infaq', 'Kempen']

// Isu & peluang yang perlu perhatian pengurusan, dijana daripada data
function janaPerhatian(d) {
    const k = d.kpi
    let senarai = []

    let ytd = Peratus(k.kutipan_ytd, k.kutipan_ytd_lepas)
    if(ytd !== null) {
        senarai.push(ytd < -10
            ? { tahap: 'critical', ikon: 'heroicons:arrow-trending-down', tajuk: `Kutipan tahun ini turun ${Math.abs(ytd).toFixed(0)}%`, butiran: `${RM(k.kutipan_ytd, 0)} berbanding ${RM(k.kutipan_ytd_lepas, 0)} bagi tempoh yang sama tahun lepas.` }
            : { tahap: 'good', ikon: 'heroicons:arrow-trending-up', tajuk: `Kutipan tahun ini ${ytd >= 0 ? 'meningkat' : 'menurun'} ${Math.abs(ytd).toFixed(0)}%`, butiran: `${RM(k.kutipan_ytd, 0)} berbanding ${RM(k.kutipan_ytd_lepas, 0)} bagi tempoh yang sama tahun lepas.` })
    }

    let jumlah_auto = k.autoinfaq_berjaya_30 + k.autoinfaq_gagal_30
    let kadar_gagal = jumlah_auto ? (k.autoinfaq_gagal_30 / jumlah_auto) * 100 : 0
    if(kadar_gagal > 20) {
        senarai.push({ tahap: 'critical', ikon: 'heroicons:bolt-slash', tajuk: `${kadar_gagal.toFixed(0)}% cubaan Auto-Infaq gagal (30 hari)`,
            butiran: `${Nombor(d.autoinfaq.pengguna_berisiko)} pengguna (${Nombor(d.autoinfaq.jadual_berisiko)} jadual aktif) gagal berturut-turut kerana baki kredit tidak mencukupi. Hantar peringatan tambah nilai.` })
    }

    if(k.pengguna_baru_30 < 20) {
        senarai.push({ tahap: 'warning', ikon: 'heroicons:user-plus', tajuk: `Hanya ${Nombor(k.pengguna_baru_30)} pengguna baharu dalam 30 hari`,
            butiran: `Berbanding ${Nombor(k.pengguna_baru_30_sebelum)} dalam 30 hari sebelumnya. Pemerolehan penderma baharu perlu dipergiatkan.` })
    }

    if(k.agihan_tertunggak > 0) {
        senarai.push({ tahap: 'warning', ikon: 'heroicons:banknotes', tajuk: `${RM(k.agihan_tertunggak)} belum diagihkan`,
            butiran: `${Nombor(k.batch_tertunggak)} batch (${Nombor(k.eft_tertunggak)} EFT) menunggu settlement kepada institusi.`, pautan: '/pengeluaran/rekod-pengeluaran' })
    }

    let hari_ini = moment()
    d.kempen.forEach(c => {
        let capai = c.sasaran ? (c.kutipan / c.sasaran) * 100 : 0
        if(moment(c.tamat).isBefore(hari_ini) && capai < 100) {
            senarai.push({ tahap: 'warning', ikon: 'heroicons:megaphone', tajuk: `Kempen tamat tempoh pada ${capai.toFixed(1)}% sasaran`, butiran: `${c.tajuk} — ${RM(c.kutipan, 0)} daripada ${RM(c.sasaran, 0)}.` })
        }
    })

    let mtd = Peratus(k.kutipan_mtd, k.kutipan_lmtd)
    if(mtd !== null && mtd > 0) {
        senarai.push({ tahap: 'good', ikon: 'heroicons:sparkles', tajuk: `Kutipan bulan ini naik ${mtd.toFixed(1)}%`, butiran: `Berbanding tempoh yang sama bulan lepas (${RM(k.kutipan_lmtd, 0)}).` })
    }

    const susunan = { critical: 0, warning: 1, good: 2 }
    return senarai.sort((a, b) => susunan[a.tahap] - susunan[b.tahap])
}

const TAHAP = {
    critical: { label: 'Kritikal', warna: 'text-red-700 bg-red-50 dark:bg-red-500/10 dark:text-red-400', garis: 'bg-red-500' },
    warning: { label: 'Perhatian', warna: 'text-amber-700 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400', garis: 'bg-amber-400' },
    good: { label: 'Positif', warna: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400', garis: 'bg-emerald-500' }
}

function DashboardEksekutif() {

    const isDark                    = useSelector(state => state.layout.darkMode)
    const W                         = isDark ? PALET.dark : PALET.light
    const [loading, set_loading]    = useState(true)
    const [data, set_data]          = useState(null)

    const getData = async (refresh = false) => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`dashboard/analitik${refresh ? '?refresh=1' : ''}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_data(api.data)
            } else {
                toast.error(api.message || "Data dashboard tidak dapat dimuatkan.")
            }
        } catch (e) {
            toast.error("Sistem Ralat! Data dashboard tidak dapat dimuatkan.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => { getData() }, [])

    // 24 bulan lengkap (termasuk bulan tanpa kutipan)
    const trend = useMemo(() => {
        if(!data) return []
        let bulan = Array.from({ length: 24 }, (_, i) => moment().startOf('month').subtract(23 - i, 'months').format('YYYY-MM'))
        return bulan.map(b => {
            let row = { bulan: b }
            JENIS.forEach(j => { row[j] = data.trend.find(t => t.bulan === b && t.jenis === j)?.amaun || 0 })
            return row
        })
    }, [data])

    const harian = useMemo(() => {
        if(!data) return []
        return Array.from({ length: 30 }, (_, i) => {
            let t = moment().subtract(29 - i, 'days').format('YYYY-MM-DD')
            let r = data.harian.find(h => h.tarikh === t)
            return { tarikh: t, amaun: r?.amaun || 0, transaksi: r?.transaksi || 0 }
        })
    }, [data])

    const autoinfaq = useMemo(() => {
        if(!data) return []
        return Array.from({ length: 30 }, (_, i) => {
            let t = moment().subtract(29 - i, 'days').format('YYYY-MM-DD')
            let r = data.autoinfaq.harian.find(h => h.tarikh === t)
            return { tarikh: t, berjaya: r?.berjaya || 0, gagal: r?.gagal || 0 }
        })
    }, [data])

    const perhatian = useMemo(() => data ? janaPerhatian(data) : [], [data])

    if(loading && !data) {
        return (
            <div className='space-y-6'>
                <div className='h-56 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-700' />
                <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                    {[1, 2, 3].map(i => <div key={i} className='h-32 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-700' />)}
                </div>
                <div className='h-80 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-700' />
            </div>
        )
    }

    if(!data) {
        return (
            <div className='rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800'>
                <p className='text-slate-500'>Data dashboard tidak dapat dimuatkan.</p>
                <button type='button' onClick={() => getData(true)} className='btn btn-sm mt-4 rounded-lg bg-slate-900 text-white'>Cuba Lagi</button>
            </div>
        )
    }

    const k             = data.kpi
    const mtd           = Peratus(k.kutipan_mtd, k.kutipan_lmtd)
    const ytd           = Peratus(k.kutipan_ytd, k.kutipan_ytd_lepas)
    const jumlah_auto   = k.autoinfaq_berjaya_30 + k.autoinfaq_gagal_30
    const kadar_berjaya = jumlah_auto ? (k.autoinfaq_berjaya_30 / jumlah_auto) * 100 : 0
    const tahun         = moment().year()
    const institusi_max = Math.max(...data.institusi.map(i => i.amaun), 1)
    const jumlah_inst   = data.institusi.reduce((t, i) => t + i.amaun, 0)
    const axisProps     = { tick: { fill: W.axis, fontSize: 11 }, axisLine: false, tickLine: false }

    return (
        <div className='space-y-6 pb-10'>

            {/* Tajuk */}
            <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#2f7d5b] dark:text-[#7fd1a8]'>Dashboard Eksekutif</p>
                    <h1 className='mt-1 text-2xl font-bold text-slate-900 dark:text-white'>Prestasi InfaqYIDE</h1>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                        {moment().format('dddd, DD MMMM YYYY')} · Data dikemas kini {moment(data.dijana_pada).format('hh:mm A')}
                    </p>
                </div>
                <button
                type='button'
                onClick={() => getData(true)}
                disabled={loading}
                className='btn btn-sm inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 md:self-auto'
                >
                    <Icons icon={loading ? 'svg-spinners:180-ring' : 'heroicons:arrow-path'} />
                    Muat Semula Data
                </button>
            </div>

            {/* Hero kutipan */}
            <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a9366] via-[#3d8d77] to-[#3a7f84] p-6 text-white shadow-xl shadow-[#3d8d77]/25 md:p-8'>
                <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5' />
                <div className='pointer-events-none absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-white/10' />
                <div className='relative grid grid-cols-1 gap-8 lg:grid-cols-5'>
                    <div className='lg:col-span-2'>
                        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#e3f5ea]'>Kutipan {moment().format('MMMM YYYY')}</p>
                        <p className='mt-3 text-4xl font-bold tabular-nums tracking-tight md:text-5xl'>{RM(k.kutipan_mtd)}</p>
                        <div className='mt-3 flex flex-wrap items-center gap-2 text-sm text-[#f2fbf6]'>
                            {mtd !== null && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${mtd >= 0 ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/25 text-red-100'}`}>
                                    <Icons icon={mtd >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'} />
                                    {mtd >= 0 ? '+' : ''}{mtd.toFixed(1)}%
                                </span>
                            )}
                            <span>vs {RM(k.kutipan_lmtd, 0)} tempoh sama bulan lepas</span>
                        </div>
                        <div className='mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5'>
                            <div>
                                <p className='text-[11px] font-semibold uppercase tracking-wider text-[#e3f5ea]'>Tahun {tahun}</p>
                                <p className='mt-1 whitespace-nowrap text-lg font-bold tabular-nums md:text-xl'>{RM(k.kutipan_ytd, 0)}</p>
                                {ytd !== null && <p className={`text-xs ${ytd >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>{ytd >= 0 ? '+' : ''}{ytd.toFixed(1)}% vs {tahun - 1}</p>}
                            </div>
                            <div>
                                <p className='text-[11px] font-semibold uppercase tracking-wider text-[#e3f5ea]'>Sejak {moment(k.tarikh_mula).format('YYYY')}</p>
                                <p className='mt-1 whitespace-nowrap text-lg font-bold tabular-nums md:text-xl'>{RMRingkas(k.kutipan_keseluruhan)}</p>
                                <p className='text-xs text-[#e3f5ea]'>{Nombor(k.transaksi_keseluruhan)} transaksi</p>
                            </div>
                        </div>
                    </div>
                    <div className='lg:col-span-3'>
                        <div className='mb-2 flex items-center justify-between text-xs text-[#e3f5ea]'>
                            <span className='font-semibold uppercase tracking-wider'>Kutipan harian · 30 hari</span>
                            <span>{Nombor(k.transaksi_mtd)} transaksi bulan ini</span>
                        </div>
                        <div className='h-48 md:h-56'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <AreaChart data={harian} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id='heroFill' x1='0' y1='0' x2='0' y2='1'>
                                            <stop offset='0%' stopColor='#ffffff' stopOpacity={0.35} />
                                            <stop offset='100%' stopColor='#ffffff' stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey='tarikh' tickFormatter={formatTarikh} tick={{ fill: '#e3f5ea', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                                    <YAxis hide domain={[0, 'dataMax']} />
                                    <Tooltip cursor={{ stroke: '#ffffff', strokeOpacity: 0.4 }} content={<ChartTooltip formatLabel={d => moment(d).format('dddd, DD MMM YYYY')} />} />
                                    <Area type='monotone' dataKey='amaun' name='Kutipan' stroke='#ffffff' strokeWidth={2} fill='url(#heroFill)' activeDot={{ r: 4, fill: '#ffffff', stroke: '#2f7d5b', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perhatian pengurusan */}
            {perhatian.length > 0 && (
                <Panel tajuk='Perhatian Pengurusan' subtajuk='Isu dan peluang yang dikesan secara automatik daripada data terkini' bodyClass='p-5 pt-4'>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
                        {perhatian.map((p, i) => (
                            <div key={i} className='relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 p-4 pl-5 dark:border-slate-700 dark:bg-slate-900/40'>
                                <span className={`absolute inset-y-0 left-0 w-1 ${TAHAP[p.tahap].garis}`} />
                                <div className='flex items-start gap-3'>
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TAHAP[p.tahap].warna}`}>
                                        <Icons icon={p.ikon} className='text-base' />
                                    </span>
                                    <div className='min-w-0'>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TAHAP[p.tahap].warna}`}>{TAHAP[p.tahap].label}</span>
                                        </div>
                                        <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-white'>{p.tajuk}</p>
                                        <p className='mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400'>{p.butiran}</p>
                                        {p.pautan && <Link to={p.pautan} className='mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#2f7d5b] hover:underline dark:text-[#7fd1a8]'>Lihat butiran <Icons icon='heroicons:arrow-right' /></Link>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            {/* KPI */}
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                <KpiTile
                ikon='heroicons:heart'
                label='Penderma Aktif · 30 hari'
                nilai={Nombor(k.penderma_30)}
                delta={Peratus(k.penderma_30, k.penderma_30_sebelum)}
                nota={`${Nombor(k.penderma_30_sebelum)} dalam 30 hari sebelumnya · ${Nombor(k.penderma_keseluruhan)} penderma sepanjang masa`}
                />
                <KpiTile
                ikon='heroicons:user-plus'
                label='Pengguna Baharu · 30 hari'
                nilai={Nombor(k.pengguna_baru_30)}
                delta={Peratus(k.pengguna_baru_30, k.pengguna_baru_30_sebelum)}
                nota={`${Nombor(k.pengguna_baru_30_sebelum)} dalam 30 hari sebelumnya · ${Nombor(k.pengguna)} pengguna berdaftar, ${k.pengguna ? ((k.penderma_keseluruhan / k.pengguna) * 100).toFixed(0) : 0}% pernah menyumbang`}
                />
                <KpiTile
                ikon='heroicons:arrow-path-rounded-square'
                label='Auto-Infaq Aktif'
                nilai={`${Nombor(k.autoinfaq_aktif)} jadual`}
                nota={`${Nombor(k.autoinfaq_pengguna)} pengguna · kadar berjaya ${kadar_berjaya.toFixed(0)}% (30 hari)`}
                />
                <KpiTile
                ikon='heroicons:building-library'
                label='Komisen YIDE · bulan ini'
                nilai={RM(k.komisen_yide_mtd)}
                nota={`Komisen DagangTEK ${RM(k.komisen_dt_mtd)}`}
                />
                <KpiTile
                ikon='heroicons:wallet'
                label='Baki Kredit Pengguna'
                nilai={RM(k.baki_kredit)}
                nota={`${Nombor(k.pemegang_kredit)} pemegang baki · tambah nilai 30 hari ${RM(k.topup_30, 0)}`}
                />
                <KpiTile
                ikon='heroicons:banknotes'
                label='Agihan Tertunggak'
                nilai={RM(k.agihan_tertunggak)}
                nota={`${Nombor(k.batch_tertunggak)} batch · ${Nombor(k.eft_tertunggak)} EFT institusi`}
                pautan={<Link to='/pengeluaran/rekod-pengeluaran' className='inline-flex items-center gap-1 text-xs font-semibold text-[#2f7d5b] hover:underline dark:text-[#7fd1a8]'>Rekod pengeluaran <Icons icon='heroicons:arrow-right' /></Link>}
                />
            </div>

            {/* Trend + komposisi */}
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
                <Panel
                className='xl:col-span-2'
                tajuk='Trend Kutipan Bulanan'
                subtajuk='24 bulan terakhir mengikut jenis sumbangan (transaksi berjaya)'
                kanan={<Legend items={JENIS.map(j => ({ label: LABEL_JENIS[j], warna: W.jenis[j] }))} />}
                >
                    <div className='h-80'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={trend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barCategoryGap='22%'>
                                <CartesianGrid vertical={false} stroke={W.grid} />
                                <XAxis dataKey='bulan' tickFormatter={formatBulan} {...axisProps} interval={2} />
                                <YAxis tickFormatter={RMRingkas} {...axisProps} width={56} />
                                <Tooltip cursor={{ fill: W.grid, opacity: 0.5 }} content={<ChartTooltip formatLabel={b => moment(b + '-01').format('MMMM YYYY')} jumlah />} />
                                {JENIS.map((j, i) => (
                                    <Bar key={j} dataKey={j} name={LABEL_JENIS[j]} stackId='a' fill={W.jenis[j]} stroke={W.surface} strokeWidth={1.5}
                                    radius={i === JENIS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>

                <Panel tajuk={`Komposisi Kutipan ${tahun}`} subtajuk='Bahagian daripada jumlah kutipan tahun ini'>
                    <div className='space-y-8 pt-2'>
                        <BarKomposisi tajuk='Jenis sumbangan' data={JENIS.map(j => data.komposisi.jenis.find(x => x.label === j) || { label: j, amaun: 0 })} warna={W.jenis} label={LABEL_JENIS} />
                        <BarKomposisi tajuk='Channel pembayaran' data={['Online Banking', 'Kredit'].map(c => data.komposisi.channel.find(x => x.label === c) || { label: c, amaun: 0 })} warna={W.channel} label={LABEL_CHANNEL} />
                    </div>
                </Panel>
            </div>

            {/* Penderma + waktu */}
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <Panel
                tajuk='Penderma Baharu vs Berulang'
                subtajuk='Penderma unik setiap bulan, 12 bulan terakhir'
                kanan={<Legend items={[{ label: 'Berulang', warna: W.berulang }, { label: 'Baharu', warna: W.baharu }]} />}
                >
                    <div className='h-72'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={data.kohort} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barCategoryGap='25%'>
                                <CartesianGrid vertical={false} stroke={W.grid} />
                                <XAxis dataKey='bulan' tickFormatter={formatBulan} {...axisProps} />
                                <YAxis {...axisProps} width={36} allowDecimals={false} />
                                <Tooltip cursor={{ fill: W.grid, opacity: 0.5 }} content={<ChartTooltip formatLabel={b => moment(b + '-01').format('MMMM YYYY')} formatNilai={v => `${Nombor(v)} penderma`} jumlah />} />
                                <Bar dataKey='berulang' name='Berulang' stackId='p' fill={W.berulang} stroke={W.surface} strokeWidth={1.5} />
                                <Bar dataKey='baharu' name='Baharu' stackId='p' fill={W.baharu} stroke={W.surface} strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>

                <Panel tajuk='Bila Penderma Menyumbang' subtajuk='Infaq Am & Kempen mengikut hari dan jam, 90 hari terakhir (tidak termasuk Auto-Infaq berjadual)'>
                    <HeatmapMasa data={data.heatmap} seq={W.seq} />
                </Panel>
            </div>

            {/* Institusi + saiz sumbangan */}
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
                <Panel className='xl:col-span-2' tajuk={`Prestasi Institusi ${tahun}`} subtajuk='Kutipan tahun ini mengikut institusi penerima' bodyClass='p-0 pt-3'>
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[640px] text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700'>
                                    <th className='px-5 py-2.5'>Institusi</th>
                                    <th className='px-3 py-2.5 text-right'>Kutipan</th>
                                    <th className='px-3 py-2.5 text-right'>Bahagian</th>
                                    <th className='px-3 py-2.5 text-right'>Penderma</th>
                                    <th className='px-5 py-2.5 text-right'>30 hari</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100 dark:divide-slate-700'>
                                {data.institusi.map(i => (
                                    <tr key={i.org} className='hover:bg-slate-50/70 dark:hover:bg-slate-700/30'>
                                        <td className='px-5 py-3'>
                                            <p className='max-w-[300px] truncate font-medium text-slate-900 dark:text-white' title={i.nama}>{i.nama || `Institusi #${i.org}`}</p>
                                            <div className='mt-1.5 h-1.5 w-full max-w-[300px] rounded-full bg-slate-100 dark:bg-slate-700'>
                                                <div className='h-full rounded-full' style={{ width: `${(i.amaun / institusi_max) * 100}%`, background: W.single }} />
                                            </div>
                                        </td>
                                        <td className='whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-slate-900 dark:text-white'>{RM(i.amaun, 0)}</td>
                                        <td className='px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{jumlah_inst ? ((i.amaun / jumlah_inst) * 100).toFixed(1) : 0}%</td>
                                        <td className='px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{Nombor(i.penderma)}</td>
                                        <td className='whitespace-nowrap px-5 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{RM(i.amaun_30, 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>

                <Panel tajuk='Saiz Sumbangan' subtajuk={`Bilangan transaksi mengikut julat amaun, ${tahun}`}>
                    <div className='h-72'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={data.saiz} layout='vertical' margin={{ top: 0, right: 12, left: 0, bottom: 0 }} barCategoryGap='22%'>
                                <CartesianGrid horizontal={false} stroke={W.grid} />
                                <XAxis type='number' {...axisProps} allowDecimals={false} tickFormatter={Nombor} />
                                <YAxis type='category' dataKey='label' {...axisProps} width={72} />
                                <Tooltip cursor={{ fill: W.grid, opacity: 0.5 }} content={({ active, payload, label }) => active && payload?.length ? (
                                    <div className='rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg dark:border-slate-600 dark:bg-slate-900'>
                                        <p className='font-semibold text-slate-900 dark:text-white'>{label}</p>
                                        <p className='text-slate-600 dark:text-slate-300'>{Nombor(payload[0].payload.transaksi)} transaksi · {RM(payload[0].payload.amaun, 0)}</p>
                                    </div>
                                ) : null} />
                                <Bar dataKey='transaksi' name='Transaksi' fill={W.single} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>
                        Sumbangan RM10 ke atas menyumbang {(() => { let t = data.saiz.reduce((a, s) => a + s.amaun, 0); let b = data.saiz.slice(3).reduce((a, s) => a + s.amaun, 0); return t ? ((b / t) * 100).toFixed(0) : 0 })()}% daripada nilai kutipan.
                    </p>
                </Panel>
            </div>

            {/* Auto-Infaq + kempen */}
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <Panel
                tajuk='Kesihatan Auto-Infaq'
                subtajuk='Cubaan potongan harian, 30 hari terakhir'
                kanan={<Legend items={[{ label: 'Berjaya', warna: W.good }, { label: 'Gagal', warna: W.critical }]} />}
                >
                    <div className='mb-3 grid grid-cols-3 gap-3'>
                        <div className='rounded-xl bg-slate-50 p-3 dark:bg-slate-900/40'>
                            <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>Kadar berjaya</p>
                            <p className='mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white'>{kadar_berjaya.toFixed(0)}%</p>
                        </div>
                        <div className='rounded-xl bg-slate-50 p-3 dark:bg-slate-900/40'>
                            <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>Pengguna berisiko</p>
                            <p className='mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white'>{Nombor(data.autoinfaq.pengguna_berisiko)}</p>
                        </div>
                        <div className='rounded-xl bg-slate-50 p-3 dark:bg-slate-900/40'>
                            <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>Jadual terjejas</p>
                            <p className='mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white'>{Nombor(data.autoinfaq.jadual_berisiko)}</p>
                        </div>
                    </div>
                    <div className='h-56'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={autoinfaq} margin={{ top: 6, right: 0, left: 0, bottom: 0 }} barCategoryGap='18%'>
                                <CartesianGrid vertical={false} stroke={W.grid} />
                                <XAxis dataKey='tarikh' tickFormatter={formatTarikh} {...axisProps} interval={6} />
                                <YAxis {...axisProps} width={36} allowDecimals={false} />
                                <Tooltip cursor={{ fill: W.grid, opacity: 0.5 }} content={<ChartTooltip formatLabel={d => moment(d).format('dddd, DD MMM YYYY')} formatNilai={v => `${Nombor(v)} cubaan`} jumlah />} />
                                <Bar dataKey='berjaya' name='Berjaya' stackId='x' fill={W.good} stroke={W.surface} strokeWidth={1.5} />
                                <Bar dataKey='gagal' name='Gagal' stackId='x' fill={W.critical} stroke={W.surface} strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className='mt-2 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
                        <Icons icon='heroicons:information-circle' className='mt-0.5 shrink-0' />
                        Pengguna berisiko = gagal sekurang-kurangnya 3 kali tanpa sebarang kejayaan dalam 7 hari (biasanya baki kredit tidak mencukupi).
                    </p>
                </Panel>

                <Panel tajuk='Prestasi Kempen' subtajuk='Kutipan berbanding sasaran setiap kempen'>
                    <div className='space-y-4'>
                        {data.kempen.map(c => {
                            let capai  = c.sasaran ? (c.kutipan / c.sasaran) * 100 : 0
                            let tamat  = moment(c.tamat).isBefore(moment())
                            let baki   = moment(c.tamat).diff(moment(), 'days')
                            return (
                                <div key={c.id} className='rounded-xl border border-slate-100 p-4 dark:border-slate-700'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='min-w-0'>
                                            <p className='truncate text-sm font-semibold text-slate-900 dark:text-white' title={c.tajuk}>{c.tajuk}</p>
                                            <p className='text-xs text-slate-500'>{Nombor(c.penderma)} penderma · {RM(c.kutipan_30, 0)} dalam 30 hari</p>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${tamat ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                                            <Icons icon={tamat ? 'heroicons:lock-closed' : 'heroicons:clock'} />
                                            {tamat ? 'Tamat' : `${baki} hari lagi`}
                                        </span>
                                    </div>
                                    <div className='mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700'>
                                        <div className='h-full rounded-full' style={{ width: `${Math.min(Math.max(capai, 0.5), 100)}%`, background: W.jenis['Kempen'] }} />
                                    </div>
                                    <div className='mt-1.5 flex justify-between text-xs'>
                                        <span className='font-semibold tabular-nums text-slate-900 dark:text-white'>{RM(c.kutipan, 0)} <span className='font-normal text-slate-500'>({capai < 1 ? capai.toFixed(2) : capai.toFixed(1)}%)</span></span>
                                        <span className='tabular-nums text-slate-500'>Sasaran {RM(c.sasaran, 0)}</span>
                                    </div>
                                </div>
                            )
                        })}
                        {data.kempen.length === 0 && <p className='text-sm text-slate-500'>Tiada kempen.</p>}
                    </div>
                </Panel>
            </div>
        </div>
    )
}

export default DashboardEksekutif
