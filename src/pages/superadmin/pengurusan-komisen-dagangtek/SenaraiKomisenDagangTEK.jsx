import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Icons from '@/components/ui/Icon'
import GradientStatCard from '@/components/ui/GradientStatCard'
import { SYSADMIN_API } from '@/utils/api'
import { PALET, LABEL_CHANNEL, RM, RMRingkas, Nombor, Panel, BarKomposisi } from '@/pages/superadmin/dashboard/komponen'

const TAHUN_MULA = 2025 // komisen DagangTEK bermula 10 November 2025

function SenaraiKomisenDagangTEK() {

    const navigate                      = useNavigate()
    const isDark                        = useSelector(state => state.layout.darkMode)
    const W                             = isDark ? PALET.dark : PALET.light
    const senarai_tahun                 = Array.from({ length: moment().year() - TAHUN_MULA + 1 }, (_, i) => moment().year() - i)

    const [tahun, set_tahun]            = useState(moment().year())
    const [loading, set_loading]        = useState(true)
    const [stats, set_stats]            = useState(null)
    const [bulanan, set_bulanan]        = useState([])

    const getData = async () => {
        set_loading(true)
        try {
            let [api_stats, api_list] = await Promise.all([
                SYSADMIN_API(`dagangtek/stats?year=${tahun}`, {}, "GET", true),
                SYSADMIN_API(`dagangtek/commission?year=${tahun}&page=1&limit=12`, {}, "GET", true)
            ])
            if(api_stats.status_code === 200) set_stats(api_stats.data)
            if(api_list.status_code === 200) set_bulanan(Array.isArray(api_list.data) ? api_list.data : (api_list.data?.row || []))
            if(api_stats.status_code !== 200 || api_list.status_code !== 200) toast.error("Sebahagian data komisen tidak dapat dimuatkan.")
        } catch (e) {
            toast.error("Sistem Ralat! Data komisen tidak dapat dimuatkan.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => { getData() }, [tahun])

    // 12 bulan penuh untuk carta (bulan tanpa data = 0)
    const carta = useMemo(() => Array.from({ length: 12 }, (_, i) => {
        let row = bulanan.find(b => Number(b.month) === i + 1)
        return {
            bulan: moment({ year: tahun, month: i, day: 1 }).format('MMM'),
            komisen: row ? parseFloat(row.total_commission) : 0,
            amaun: row ? parseFloat(row.total_amount) : 0,
            transaksi: row ? Number(row.total_transactions) : 0
        }
    }), [bulanan, tahun])

    const o                 = stats?.overview || {}
    const jumlah_komisen    = parseFloat(o.total_commission || 0)
    const jumlah_amaun      = parseFloat(o.total_amount || 0)
    const kadar_efektif     = jumlah_amaun ? (jumlah_komisen / jumlah_amaun) * 100 : 0
    const bulan_terbaik     = bulanan.reduce((best, b) => (!best || parseFloat(b.total_commission) > parseFloat(best.total_commission)) ? b : best, null)
    const channel           = ['Online Banking', 'Kredit'].map(c => {
        let r = (stats?.channel_breakdown || []).find(x => x.channel === c)
        return { label: c, amaun: r ? parseFloat(r.commission) : 0 }
    })

    const bukaButiran = row => navigate(`/komisen-dagangtek/detail?year=${row.year}&month=${row.month}`, {
        state: { year: row.year, month: row.month, monthName: moment({ month: row.month - 1 }).format('MMMM') }
    })

    return (
        <div className='space-y-6 pb-10'>

            {/* Tajuk */}
            <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#2f7d5b] dark:text-[#7fd1a8]'>Komisen Rakan Teknologi</p>
                    <h1 className='mt-1 text-2xl font-bold text-slate-900 dark:text-white'>Komisen DagangTEK</h1>
                    <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>7% bagi sumbangan ≤ RM10,000 dan 5% bagi sumbangan melebihi RM10,000 · dikira sejak 10 November 2025</p>
                </div>
                <div className='inline-flex self-start rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800 md:self-auto'>
                    {senarai_tahun.map(t => (
                        <button
                        key={t}
                        type='button'
                        onClick={() => set_tahun(t)}
                        className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${tahun === t ? 'bg-gradient-to-r from-[#3a9366] to-[#3a7f84] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Statistik */}
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
                <GradientStatCard theme='purple' label={`Komisen DagangTEK ${tahun}`} icon='heroicons:banknotes' loading={loading} value={RM(jumlah_komisen)} caption={`Kadar efektif ${kadar_efektif.toFixed(2)}% daripada kutipan`} />
                <GradientStatCard theme='blue' label='Nilai Transaksi' icon='heroicons:currency-dollar' loading={loading} value={RM(jumlah_amaun)} caption='Sumbangan berjaya (tidak termasuk tambah nilai)' />
                <GradientStatCard theme='orange' label='Jumlah Transaksi' icon='heroicons:arrows-right-left' loading={loading} value={Nombor(o.total_transactions)} caption={`Purata ${RM(o.avg_commission)} komisen setiap transaksi`} />
                <GradientStatCard theme='green' label='Bulan Terbaik' icon='heroicons:trophy' loading={loading}
                value={bulan_terbaik ? RM(bulan_terbaik.total_commission) : '–'}
                caption={bulan_terbaik ? `${moment({ month: bulan_terbaik.month - 1 }).format('MMMM')} ${bulan_terbaik.year} · ${Nombor(bulan_terbaik.total_transactions)} transaksi` : 'Tiada data'} />
            </div>

            {/* Carta */}
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
                <Panel className='xl:col-span-2' tajuk={`Komisen Bulanan ${tahun}`} subtajuk='Komisen DagangTEK setiap bulan'>
                    <div className='h-72'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={carta} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barCategoryGap='28%'>
                                <CartesianGrid vertical={false} stroke={W.grid} />
                                <XAxis dataKey='bulan' tick={{ fill: W.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={RMRingkas} tick={{ fill: W.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
                                <Tooltip cursor={{ fill: W.grid, opacity: 0.5 }} content={({ active, payload, label }) => active && payload?.length ? (
                                    <div className='min-w-[190px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg dark:border-slate-600 dark:bg-slate-900'>
                                        <p className='mb-1.5 font-semibold text-slate-900 dark:text-white'>{label} {tahun}</p>
                                        <div className='flex justify-between gap-4'><span className='text-slate-500'>Komisen DT</span><span className='font-semibold tabular-nums text-slate-900 dark:text-white'>{RM(payload[0].payload.komisen)}</span></div>
                                        <div className='flex justify-between gap-4'><span className='text-slate-500'>Nilai transaksi</span><span className='tabular-nums text-slate-700 dark:text-slate-200'>{RM(payload[0].payload.amaun)}</span></div>
                                        <div className='flex justify-between gap-4'><span className='text-slate-500'>Transaksi</span><span className='tabular-nums text-slate-700 dark:text-slate-200'>{Nombor(payload[0].payload.transaksi)}</span></div>
                                    </div>
                                ) : null} />
                                <Bar dataKey='komisen' name='Komisen DT' fill={W.single} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Panel>
                <Panel tajuk='Komisen Mengikut Channel' subtajuk={`Sumber komisen DagangTEK ${tahun}`}>
                    <div className='pt-2'>
                        <BarKomposisi tajuk='Channel pembayaran' data={channel} warna={W.channel} label={LABEL_CHANNEL} />
                    </div>
                    <div className='mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 dark:bg-slate-900/40 dark:text-slate-400'>
                        <p className='mb-1 font-semibold text-slate-700 dark:text-slate-200'>Julat komisen setiap transaksi</p>
                        Terendah {RM(o.min_commission)} · tertinggi {RM(o.max_commission)} · purata {RM(o.avg_commission)}
                    </div>
                </Panel>
            </div>

            {/* Jadual bulanan */}
            <Panel tajuk='Rekod Komisen Bulanan' subtajuk='Klik pada bulan untuk melihat butiran transaksi, dan muat turun laporan Excel atau PDF' bodyClass='p-0 pt-3'>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[860px] text-sm'>
                        <thead className='bg-slate-50 dark:bg-slate-800/60'>
                            <tr className='text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                                <th className='px-5 py-3'>Bulan</th>
                                <th className='px-4 py-3 text-right'>Transaksi</th>
                                <th className='px-4 py-3 text-right'>Nilai Transaksi</th>
                                <th className='px-4 py-3 text-right'>Komisen DT</th>
                                <th className='px-4 py-3 text-right'>Komisen YIDE</th>
                                <th className='px-4 py-3 text-right'>Agihan Institusi</th>
                                <th className='w-28 px-5 py-3'><span className='sr-only'>Tindakan</span></th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-slate-100 dark:divide-slate-700 ${loading ? 'opacity-50' : ''}`}>
                            {loading && bulanan.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i}><td colSpan={7} className='px-5 py-4'><div className='h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-700' /></td></tr>
                            ))}
                            {!loading && bulanan.length === 0 && (
                                <tr>
                                    <td colSpan={7} className='px-5 py-12 text-center'>
                                        <Icons icon='heroicons:document-magnifying-glass' className='mx-auto mb-2 text-4xl text-slate-300' />
                                        <p className='text-sm text-slate-500'>Tiada rekod komisen bagi tahun {tahun}.</p>
                                    </td>
                                </tr>
                            )}
                            {bulanan.map(row => {
                                let peratus = jumlah_komisen ? (parseFloat(row.total_commission) / jumlah_komisen) * 100 : 0
                                return (
                                    <tr key={row.period} onClick={() => bukaButiran(row)} className='cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-700/30'>
                                        <td className='px-5 py-3.5'>
                                            <div className='flex items-center gap-3'>
                                                <div className='flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#3a9366]/10 text-[#2f7d5b] dark:bg-[#7fd1a8]/10 dark:text-[#7fd1a8]'>
                                                    <span className='text-[10px] font-bold uppercase leading-none'>{moment({ month: row.month - 1 }).format('MMM')}</span>
                                                    <span className='text-[10px] leading-none opacity-70'>{String(row.year).slice(2)}</span>
                                                </div>
                                                <div className='min-w-[140px]'>
                                                    <p className='font-semibold text-slate-900 dark:text-white'>{moment({ month: row.month - 1 }).format('MMMM')} {row.year}</p>
                                                    <div className='mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700'>
                                                        <div className='h-full rounded-full' style={{ width: `${peratus}%`, background: W.single }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-slate-600 dark:text-slate-300'>
                                            {Nombor(row.total_transactions)}
                                            <p className='text-[11px] text-slate-400'>{Nombor(row.total_fpx)} FPX</p>
                                        </td>
                                        <td className='whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-slate-600 dark:text-slate-300'>{RM(row.total_amount)}</td>
                                        <td className='whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums text-slate-900 dark:text-white'>{RM(row.total_commission)}</td>
                                        <td className='whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-slate-600 dark:text-slate-300'>{RM(row.total_commission_yide)}</td>
                                        <td className='whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-emerald-700 dark:text-emerald-400'>{RM(row.total_nett)}</td>
                                        <td className='px-5 py-3.5 text-right'>
                                            <span className='inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-700'>
                                                Butiran <Icons icon='heroicons:arrow-right' />
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        {bulanan.length > 0 && (
                            <tfoot className='border-t border-slate-200 bg-slate-50 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white'>
                                <tr>
                                    <td className='px-5 py-3 text-xs uppercase tracking-wider'>Jumlah {tahun}</td>
                                    <td className='px-4 py-3 text-right tabular-nums'>{Nombor(bulanan.reduce((t, b) => t + Number(b.total_transactions), 0))}</td>
                                    <td className='px-4 py-3 text-right tabular-nums'>{RM(bulanan.reduce((t, b) => t + parseFloat(b.total_amount), 0))}</td>
                                    <td className='px-4 py-3 text-right tabular-nums'>{RM(bulanan.reduce((t, b) => t + parseFloat(b.total_commission), 0))}</td>
                                    <td className='px-4 py-3 text-right tabular-nums'>{RM(bulanan.reduce((t, b) => t + parseFloat(b.total_commission_yide || 0), 0))}</td>
                                    <td className='px-4 py-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400'>{RM(bulanan.reduce((t, b) => t + parseFloat(b.total_nett || 0), 0))}</td>
                                    <td />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </Panel>
        </div>
    )
}

export default SenaraiKomisenDagangTEK
