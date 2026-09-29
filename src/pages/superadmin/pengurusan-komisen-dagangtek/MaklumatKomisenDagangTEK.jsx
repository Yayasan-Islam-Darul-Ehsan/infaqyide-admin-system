import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'
import { debounce } from 'lodash'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Icons from '@/components/ui/Icon'
import GradientStatCard from '@/components/ui/GradientStatCard'
import Pagination from '@/components/ui/Pagination'
import { SYSADMIN_API, SYSADMIN_API_FILE } from '@/utils/api'
import { PALET, LABEL_JENIS, LABEL_CHANNEL, RM, RMRingkas, Nombor, Panel, BarKomposisi } from '@/pages/superadmin/dashboard/komponen'

const BULAN_MULA = moment('2025-11-01') // komisen DagangTEK bermula November 2025

const TYPE_BADGE = {
    'Infaq': 'bg-teal-50 text-teal-700 ring-teal-600/20',
    'Auto-Infaq': 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'Kempen': 'bg-orange-50 text-orange-700 ring-orange-600/20'
}

function Pill({ className = '', children }) {
    return <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>{children}</span>
}

function MaklumatKomisenDagangTEK() {

    const location                          = useLocation()
    const navigate                          = useNavigate()
    const isDark                            = useSelector(state => state.layout.darkMode)
    const W                                 = isDark ? PALET.dark : PALET.light

    const query                             = new URLSearchParams(location.search)
    const tahun                             = parseInt(query.get('year') || location.state?.year) || moment().year()
    const bulan                             = parseInt(query.get('month') || location.state?.month) || moment().month() + 1
    const tempoh                            = moment({ year: tahun, month: bulan - 1, day: 1 })

    const [loading, set_loading]            = useState(true)
    const [transaksi, set_transaksi]        = useState([])
    const [ringkasan, set_ringkasan]        = useState({})
    const [metadata, set_metadata]          = useState({ total: 0, totalPages: 0 })
    const [harian, set_harian]              = useState({ daily: [], jenis: [], channel: [] })
    const [page, set_page]                  = useState(1)
    const [limit, set_limit]                = useState(10)
    const [jenis, set_jenis]                = useState('')
    const [carian, set_carian]              = useState('')
    const [input_carian, set_input_carian]  = useState('')
    const [muat_turun, set_muat_turun]      = useState('')

    const debouncedCarian = useMemo(() => debounce(v => { set_page(1); set_carian(v) }, 500), [])
    useEffect(() => () => debouncedCarian.cancel(), [debouncedCarian])

    const pergiBulan = arah => {
        let t = tempoh.clone().add(arah, 'month')
        set_page(1)
        navigate(`/komisen-dagangtek/detail?year=${t.year()}&month=${t.month() + 1}`, { replace: true })
    }

    // Ringkasan bulan (tanpa penapis) & pecahan harian
    useEffect(() => {
        (async () => {
            try {
                let [api_harian, api_ringkasan] = await Promise.all([
                    SYSADMIN_API(`dagangtek/daily?year=${tahun}&month=${bulan}`, {}, "GET", true),
                    SYSADMIN_API(`dagangtek/transactions?year=${tahun}&month=${bulan}&page=1&limit=1`, {}, "GET", true)
                ])
                if(api_harian.status_code === 200) set_harian(api_harian.data)
                if(api_ringkasan.status_code === 200) set_ringkasan({ ...(api_ringkasan.summary || api_ringkasan.data?.summary), total: api_ringkasan.totalData ?? api_ringkasan.data?.totalData })
            } catch (e) {
                toast.error("Ringkasan komisen tidak dapat dimuatkan.")
            }
        })()
    }, [tahun, bulan])

    // Senarai transaksi (dengan penapis)
    useEffect(() => {
        (async () => {
            set_loading(true)
            try {
                let params = new URLSearchParams({ year: tahun, month: bulan, page, limit })
                if(jenis) params.append('type', jenis)
                if(carian) params.append('search', carian)
                let api = await SYSADMIN_API(`dagangtek/transactions?${params.toString()}`, {}, "GET", true)
                if(api.status_code === 200) {
                    // Route memulangkan baris dalam data, dan maklumat halaman di aras atas respons
                    set_transaksi(Array.isArray(api.data) ? api.data : (api.data?.row || []))
                    set_metadata({ total: api.totalData ?? api.data?.totalData ?? 0, totalPages: api.totalPage ?? api.data?.totalPage ?? 0 })
                } else {
                    toast.error(api.message || "Senarai transaksi tidak dapat dimuatkan.")
                }
            } catch (e) {
                toast.error("Sistem Ralat! Senarai transaksi tidak dapat dimuatkan.")
            } finally {
                set_loading(false)
            }
        })()
    }, [tahun, bulan, page, limit, jenis, carian])

    const eksportPDF = async () => {
        set_muat_turun('pdf')
        try {
            let { blob, fileName } = await SYSADMIN_API_FILE(`dagangtek/export-pdf?year=${tahun}&month=${bulan}`, `Laporan_Komisen_DagangTEK_${tempoh.format('MMMM_YYYY')}.pdf`)
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch (e) {
            toast.error(e.message || "Laporan PDF tidak dapat dimuat turun.")
        } finally {
            set_muat_turun('')
        }
    }

    const eksportExcel = async () => {
        set_muat_turun('excel')
        try {
            let api = await SYSADMIN_API(`dagangtek/export-excel?year=${tahun}&month=${bulan}`, {}, "GET", true)
            let url = typeof api.data === 'string' ? api.data : api.data?.url
            if(api.status_code === 200 && url) {
                const link = document.createElement('a')
                link.href = url
                link.target = '_blank'
                link.rel = 'noopener'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                toast.error(api.message || "Laporan Excel tidak dapat dijana.")
            }
        } catch (e) {
            toast.error("Laporan Excel tidak dapat dijana.")
        } finally {
            set_muat_turun('')
        }
    }

    const carta = useMemo(() => Array.from({ length: tempoh.daysInMonth() }, (_, i) => {
        let t = tempoh.clone().date(i + 1).format('YYYY-MM-DD')
        let r = harian.daily.find(d => d.tarikh === t)
        return { hari: i + 1, tarikh: t, komisen: r?.komisen || 0, amaun: r?.amaun || 0, transaksi: r?.transaksi || 0 }
    }), [harian, tahun, bulan])

    const jumlah_amaun  = parseFloat(ringkasan.totalAmount || 0)
    const komisen_dt    = parseFloat(ringkasan.totalCommissionDT || 0)
    const hari_aktif    = harian.daily.filter(d => d.transaksi > 0).length
    const boleh_sebelum = tempoh.clone().subtract(1, 'month').isSameOrAfter(BULAN_MULA, 'month')
    const boleh_selepas = tempoh.clone().add(1, 'month').isSameOrBefore(moment(), 'month')
    const firstRow      = metadata.total > 0 ? (page - 1) * limit + 1 : 0

    return (
        <div className='space-y-6 pb-10'>

            {/* Tajuk */}
            <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                    <Link to='/komisen-dagangtek' className='mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white'>
                        <Icons icon='heroicons:arrow-left' /> Kembali ke komisen bulanan
                    </Link>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#2f7d5b] dark:text-[#7fd1a8]'>Butiran Komisen DagangTEK</p>
                    <div className='mt-1 flex items-center gap-2'>
                        <button type='button' disabled={!boleh_sebelum} onClick={() => pergiBulan(-1)} title='Bulan sebelum'
                        className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                            <Icons icon='heroicons:chevron-left' />
                        </button>
                        <h1 className='min-w-[190px] text-center text-2xl font-bold text-slate-900 dark:text-white'>{tempoh.format('MMMM YYYY')}</h1>
                        <button type='button' disabled={!boleh_selepas} onClick={() => pergiBulan(1)} title='Bulan seterusnya'
                        className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                            <Icons icon='heroicons:chevron-right' />
                        </button>
                    </div>
                    <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{Nombor(ringkasan.total)} transaksi berjaya · {hari_aktif} hari aktif</p>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <button type='button' onClick={eksportExcel} disabled={!!muat_turun || !ringkasan.total}
                    className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60'>
                        <Icons icon={muat_turun === 'excel' ? 'svg-spinners:180-ring' : 'heroicons:table-cells'} />
                        {muat_turun === 'excel' ? 'Menjana Excel...' : 'Laporan Excel'}
                    </button>
                    <button type='button' onClick={eksportPDF} disabled={!!muat_turun || !ringkasan.total}
                    className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700'>
                        <Icons icon={muat_turun === 'pdf' ? 'svg-spinners:180-ring' : 'heroicons:document-arrow-down'} />
                        {muat_turun === 'pdf' ? 'Menjana PDF...' : 'Laporan PDF'}
                    </button>
                </div>
            </div>

            {/* Statistik */}
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
                <GradientStatCard theme='blue' label='Nilai Transaksi' icon='heroicons:currency-dollar' value={RM(jumlah_amaun)} caption={`${Nombor(ringkasan.total)} transaksi berjaya`} />
                <GradientStatCard theme='purple' label='Komisen DagangTEK' icon='heroicons:banknotes' value={RM(komisen_dt)} caption={`Kadar efektif ${jumlah_amaun ? ((komisen_dt / jumlah_amaun) * 100).toFixed(2) : '0.00'}%`} />
                <GradientStatCard theme='orange' label='Komisen YIDE' icon='heroicons:building-library' value={RM(ringkasan.totalCommissionYIDE)} caption='Komisen platform' />
                <GradientStatCard theme='green' label='Agihan Institusi' icon='heroicons:hand-raised' value={RM(ringkasan.totalAmountNett)} caption='Jumlah bersih kepada institusi' />
            </div>

            {/* Carta */}
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
                <Panel className='xl:col-span-2' tajuk='Komisen Harian' subtajuk={`Komisen DagangTEK setiap hari, ${tempoh.format('MMMM YYYY')}`}>
                    <div className='h-64'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={carta} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barCategoryGap='18%'>
                                <CartesianGrid vertical={false} stroke={W.grid} />
                                <XAxis dataKey='hari' tick={{ fill: W.axis, fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
                                <YAxis tickFormatter={RMRingkas} tick={{ fill: W.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                                <Tooltip cursor={{ fill: W.grid, opacity: 0.5 }} content={({ active, payload }) => active && payload?.length ? (
                                    <div className='min-w-[190px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg dark:border-slate-600 dark:bg-slate-900'>
                                        <p className='mb-1.5 font-semibold text-slate-900 dark:text-white'>{moment(payload[0].payload.tarikh).format('dddd, DD MMM YYYY')}</p>
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
                <Panel tajuk='Sumber Komisen' subtajuk='Komisen DagangTEK mengikut jenis dan channel'>
                    <div className='space-y-7 pt-1'>
                        <BarKomposisi tajuk='Jenis sumbangan' warna={W.jenis} label={LABEL_JENIS}
                        data={['Infaq', 'Auto-Infaq', 'Kempen'].map(j => ({ label: j, amaun: harian.jenis.find(x => x.jenis === j)?.komisen || 0 }))} />
                        <BarKomposisi tajuk='Channel pembayaran' warna={W.channel} label={LABEL_CHANNEL}
                        data={['Online Banking', 'Kredit'].map(c => ({ label: c, amaun: harian.channel.find(x => x.channel === c)?.komisen || 0 }))} />
                    </div>
                </Panel>
            </div>

            {/* Transaksi */}
            <section className='overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800'>
                <div className='flex flex-col gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                        <h3 className='text-[15px] font-semibold text-slate-900 dark:text-white'>Transaksi Komisen</h3>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                            Menunjukkan {Nombor(firstRow)}–{Nombor(Math.min(page * limit, metadata.total))} daripada {Nombor(metadata.total)} transaksi
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <div className='relative'>
                            <Icons icon='heroicons:magnifying-glass' className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                            <input type='text' value={input_carian} placeholder='No. invois, nama atau emel...' className='form-control w-64 py-1.5 pl-9'
                            onChange={e => { set_input_carian(e.target.value); debouncedCarian(e.target.value) }} />
                        </div>
                        <div className='inline-flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-600 dark:bg-slate-800'>
                            {[['', 'Semua'], ['Infaq', 'Infaq Am'], ['Auto-Infaq', 'Auto Infaq'], ['Kempen', 'Kempen']].map(([v, l]) => (
                                <button key={l} type='button' onClick={() => { set_page(1); set_jenis(v) }}
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${jenis === v ? 'bg-slate-900 text-white dark:bg-slate-600' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                        <select value={limit} onChange={e => { set_page(1); set_limit(parseInt(e.target.value)) }} className='form-control w-20 py-1.5'>
                            {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[1000px] text-sm'>
                        <thead className='bg-slate-50 dark:bg-slate-800/60'>
                            <tr className='text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                                <th className='w-12 px-5 py-3'>Bil.</th>
                                <th className='px-4 py-3'>Transaksi</th>
                                <th className='px-4 py-3'>Jenis / Channel</th>
                                <th className='px-4 py-3'>Penyumbang</th>
                                <th className='px-4 py-3 text-right'>Jumlah</th>
                                <th className='px-4 py-3 text-right'>Komisen DT</th>
                                <th className='px-4 py-3 text-right'>Komisen YIDE</th>
                                <th className='px-4 py-3 text-right'>Agihan Institusi</th>
                                <th className='w-14 px-4 py-3'><span className='sr-only'>Tindakan</span></th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-slate-100 dark:divide-slate-700 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                            {loading && transaksi.length === 0 && Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={9} className='px-5 py-4'><div className='h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-700' /></td></tr>
                            ))}
                            {!loading && transaksi.length === 0 && (
                                <tr>
                                    <td colSpan={9} className='px-5 py-12 text-center'>
                                        <Icons icon='heroicons:document-magnifying-glass' className='mx-auto mb-2 text-4xl text-slate-300' />
                                        <p className='text-sm text-slate-500'>Tiada transaksi dijumpai.</p>
                                    </td>
                                </tr>
                            )}
                            {transaksi.map((item, i) => (
                                <tr key={item.billpayment_id} className='hover:bg-slate-50/70 dark:hover:bg-slate-700/30'>
                                    <td className='px-5 py-3 text-slate-500'>{firstRow + i}.</td>
                                    <td className='px-4 py-3'>
                                        <p className='font-mono text-[13px] text-slate-800 dark:text-slate-100'>{item.billpayment_invoiceNo}</p>
                                        <p className='mt-0.5 text-xs text-slate-500'>{moment(item.billpayment_createdDate).format('DD MMM YYYY, hh:mm A')}</p>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <div className='flex flex-col items-start gap-1'>
                                            <Pill className={TYPE_BADGE[item.billpayment_type] || 'bg-slate-100 text-slate-700 ring-slate-500/20'}>{LABEL_JENIS[item.billpayment_type] || item.billpayment_type}</Pill>
                                            <span className='inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-500'>
                                                <Icons icon={item.billpayment_paymentChannel === 'Online Banking' ? 'heroicons:building-library' : 'heroicons:wallet'} />
                                                {LABEL_CHANNEL[item.billpayment_paymentChannel] || item.billpayment_paymentChannel}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <p className='max-w-[220px] truncate font-medium text-slate-900 dark:text-white' title={item.billpayment_payorName}>{item.billpayment_payorName || '–'}</p>
                                        <p className='max-w-[220px] truncate text-xs text-slate-500' title={item.billpayment_payorEmail}>{item.billpayment_payorEmail}</p>
                                    </td>
                                    <td className='whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900 dark:text-white'>{RM(item.billpayment_amount)}</td>
                                    <td className='whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-slate-900 dark:text-white'>{RM(item.commission_dagangtek)}</td>
                                    <td className='whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{RM(item.commission_yide)}</td>
                                    <td className='whitespace-nowrap px-4 py-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400'>{RM(item.amount_split_institusi)}</td>
                                    <td className='px-4 py-3 text-center'>
                                        <Link to='/pengurusan/maklumat-transaksi' state={{ data: item }} title='Lihat resit transaksi'
                                        className='inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white'>
                                            <Icons icon='heroicons:eye' className='text-lg' />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {metadata.totalPages > 1 && (
                    <div className='flex justify-center border-t border-slate-100 px-5 py-4 dark:border-slate-700'>
                        <Pagination currentPage={page} totalPages={metadata.totalPages} handlePageChange={p => { if(p >= 1 && p <= metadata.totalPages) set_page(p) }} />
                    </div>
                )}
            </section>
        </div>
    )
}

export default MaklumatKomisenDagangTEK
