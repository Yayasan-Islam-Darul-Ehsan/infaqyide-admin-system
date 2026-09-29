import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { SYSADMIN_API } from '@/utils/api';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Pagination from '@/components/ui/Pagination';
import Icons from '@/components/ui/Icon';
import GradientStatCard from '@/components/ui/GradientStatCard';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Flatpickr from "react-flatpickr";

function toMYR(amount = 0) {
    return Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
}

const DEFAULT_FILTERS = {
    search: '',
    status: '1',
    type: '',
    channel: '',
    dateFrom: '',
    dateTo: ''
}

const STATUS_OPTIONS = [
    { label: 'Semua Status', value: '' },
    { label: 'Transaksi Berjaya', value: '1' },
    { label: 'Dalam Proses', value: '2' },
    { label: 'Pembayaran Gagal', value: '3' },
    { label: 'Lain-Lain Status', value: '4' }
]

const TYPE_OPTIONS = [
    { label: 'Semua Jenis', value: '' },
    { label: 'Infaq Am', value: 'Infaq' },
    { label: 'Auto Infaq', value: 'Auto-Infaq' },
    { label: 'Kempen', value: 'Kempen' }
]

const CHANNEL_OPTIONS = [
    { label: 'Semua Channel', value: '' },
    { label: 'Online Banking (FPX)', value: 'Online Banking' },
    { label: 'Kredit', value: 'Kredit' }
]

const LIMIT_OPTIONS = [10, 20, 50, 100]

const TYPE_BADGE = {
    'Infaq': { label: 'Infaq Am', className: 'bg-teal-50 text-teal-700 ring-teal-600/20' },
    'Auto-Infaq': { label: 'Auto Infaq', className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
    'Auto-infaq': { label: 'Auto Infaq', className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
    'Kempen': { label: 'Kempen', className: 'bg-orange-50 text-orange-700 ring-orange-600/20' }
}

const CHANNEL_BADGE = {
    'Online Banking': { label: 'Online Banking (FPX)', icon: 'heroicons:building-library', className: 'text-indigo-700' },
    'Kredit': { label: 'Kredit', icon: 'heroicons:wallet', className: 'text-amber-700' }
}

const STATUS_BADGE = {
    1: { label: 'Berjaya', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
    2: { label: 'Dalam Proses', className: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' },
    3: { label: 'Gagal', className: 'bg-red-50 text-red-700 ring-red-600/20' },
    4: { label: 'Lain-Lain', className: 'bg-slate-100 text-slate-700 ring-slate-500/20' }
}

function Pill({ className = '', children }) {
    return (
        <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
            {children}
        </span>
    )
}

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div>
            <label className='block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1'>{label}</label>
            <div className='relative'>
                <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className='form-control py-2 pr-8 appearance-none'
                >
                    {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <Icons icon='heroicons:chevron-down' className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' />
            </div>
        </div>
    )
}

// Pecahan setiap ringgit kutipan: institusi + DagangTEK + YIDE + caj gateway = jumlah kutipan
function PecahanKutipan({ rumusan, loading }) {
    const kutipan = parseFloat(rumusan.JUMLAH_KESELURUHAN_INFAQ || 0)
    const segments = [
        { label: 'Agihan Institusi', value: parseFloat(rumusan.JUMLAH_AGIHAN_KEPADA_INSTITUSI || 0), bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
        { label: 'Komisen DagangTEK', value: parseFloat(rumusan.JUMLAH_KOMISEN_DAGANGTEK || 0), bar: 'bg-orange-400', dot: 'bg-orange-400' },
        { label: 'Komisen YIDE', value: parseFloat(rumusan.JUMLAH_KOMISEN_INFAQYIDE || 0), bar: 'bg-violet-500', dot: 'bg-violet-500' },
        { label: 'Caj Payment Gateway', value: parseFloat(rumusan.JUMLAH_CAJ_GATEWAY || 0), bar: 'bg-slate-400', dot: 'bg-slate-400' }
    ]
    const percent = value => kutipan > 0 ? (value / kutipan) * 100 : 0

    return (
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                <div>
                    <h4 className='text-base font-semibold text-slate-900 dark:text-white'>Ke Mana Setiap Ringgit</h4>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                        {toMYR(kutipan)} dikutip daripada {Number(rumusan.JUMLAH_TRANSAKSI_BERJAYA || 0).toLocaleString('ms-MY')} transaksi berjaya
                    </p>
                </div>
                <span className='self-start whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white dark:bg-slate-700'>
                    {percent(segments[0].value).toFixed(1)}% kepada institusi
                </span>
            </div>

            <div className='mt-6 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700'>
                {!loading && segments.map(segment => (
                    <div key={segment.label} className={`${segment.bar} h-full transition-all duration-500`} style={{ width: `${percent(segment.value)}%` }} />
                ))}
            </div>

            <div className='mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4'>
                {segments.map(segment => (
                    <div key={segment.label}>
                        <div className='flex items-center gap-2'>
                            <span className={`h-2.5 w-2.5 rounded-full ${segment.dot}`} />
                            <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>{segment.label}</span>
                        </div>
                        <p className='mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white'>{toMYR(segment.value)}</p>
                        <p className='text-xs text-slate-400'>{percent(segment.value).toFixed(1)}%</p>
                    </div>
                ))}
            </div>

            <p className='mt-5 text-xs text-slate-400'>
                Dikira daripada transaksi berjaya mengikut penapis semasa. Agihan institusi, komisen DagangTEK, komisen YIDE dan caj gateway dijumlahkan tepat kepada jumlah kutipan.
            </p>
        </div>
    )
}

function buildQuery(filters, extra = {}) {
    const params = new URLSearchParams()
    Object.entries({ ...filters, ...extra }).forEach(([key, value]) => {
        if(value !== '' && value !== null && value !== undefined) params.append(key, value)
    })
    return params.toString()
}

function LaporanTransaksi() {

    const [loading, set_loading]            = useState(true)
    const [downloading, set_downloading]    = useState(false)
    const [transaksi, set_transaksi]        = useState([])
    const [rumusan, set_rumusan]            = useState({})
    const [filters, set_filters]            = useState(DEFAULT_FILTERS)
    const [search_input, set_search_input]  = useState('')
    const [page, set_page]                  = useState(1)
    const [limit, set_limit]                = useState(10)
    const [metadata, set_metadata]          = useState({ total: 0, totalPages: 0 })

    const request_id = useRef(0)

    const updateFilter = (key, value) => {
        set_page(1)
        set_filters(prev => ({ ...prev, [key]: value }))
    }

    const debouncedSearch = useMemo(() => debounce(value => updateFilter('search', value), 500), [])
    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])

    const resetFilters = () => {
        debouncedSearch.cancel()
        set_search_input('')
        set_page(1)
        set_filters(DEFAULT_FILTERS)
    }

    const getData = async () => {
        const current = ++request_id.current
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`laporan?${buildQuery(filters, { page, limit })}`, {}, "GET", true)
            if(current !== request_id.current) return
            if(api.status_code === 200) {
                set_transaksi(api.data.row)
                set_metadata({ total: api.data.total, totalPages: api.data.totalPages })
                set_rumusan(api.summary?.[0] || {})
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            if(current === request_id.current) toast.error("Sistem Ralat! Sila hubungi sistem pentadbir anda.")
        } finally {
            if(current === request_id.current) set_loading(false)
        }
    }

    // Excel menggunakan penapis yang sama dengan paparan supaya data sentiasa selari
    const getExcel = async () => {
        set_downloading(true)
        try {
            let api = await SYSADMIN_API(`excel-laporan-infaq?${buildQuery(filters)}`, {}, "GET")
            if(api.status_code === 200) {
                const link = document.createElement('a');
                link.href = api.data;
                link.download = api.data;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Ralat! Terdapat masalah untuk muat turun senarai transaksi ke fail Excel.")
        } finally {
            set_downloading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [filters, page, limit])

    const tempoh = filters.dateFrom && filters.dateTo
        ? `${moment(filters.dateFrom).format("DD MMM YYYY")} – ${moment(filters.dateTo).format("DD MMM YYYY")}`
        : 'Semua tarikh'
    const firstRow  = metadata.total > 0 ? (page - 1) * limit + 1 : 0
    const lastRow   = Math.min(page * limit, metadata.total)
    const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)

    return (
        <div>
            <HomeBredCurbs title={"Laporan Transaksi Sumbangan InfaqYIDE"} />

            {/* Rumusan */}
            <section className='mt-6 space-y-5'>
                <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
                    <div>
                        <h4 className='text-lg font-semibold text-slate-900 dark:text-white'>Rumusan Kutipan</h4>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>Tempoh: <span className='font-medium text-slate-700 dark:text-slate-200'>{tempoh}</span></p>
                    </div>
                    <span className='self-start whitespace-nowrap rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:bg-slate-800 dark:text-slate-400 md:self-auto'>
                        Transaksi berjaya sahaja
                    </span>
                </div>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5'>
                    <GradientStatCard
                    theme='blue'
                    label='Jumlah Kutipan'
                    icon='heroicons:banknotes'
                    loading={loading}
                    value={toMYR(rumusan.JUMLAH_KESELURUHAN_INFAQ)}
                    caption={`${Number(rumusan.JUMLAH_TRANSAKSI_BERJAYA || 0).toLocaleString('ms-MY')} transaksi berjaya`}
                    />
                    <GradientStatCard
                    theme='green'
                    label='Agihan Institusi'
                    icon='heroicons:hand-raised'
                    loading={loading}
                    value={toMYR(rumusan.JUMLAH_AGIHAN_KEPADA_INSTITUSI)}
                    caption='Jumlah bersih untuk diagihkan'
                    />
                    <GradientStatCard
                    theme='orange'
                    label='Komisen DagangTEK'
                    icon='heroicons:building-office-2'
                    loading={loading}
                    value={toMYR(rumusan.JUMLAH_KOMISEN_DAGANGTEK)}
                    caption='7% (≤ RM10,000) / 5%'
                    />
                    <GradientStatCard
                    theme='purple'
                    label='Komisen YIDE'
                    icon='heroicons:building-library'
                    loading={loading}
                    value={toMYR(rumusan.JUMLAH_KOMISEN_INFAQYIDE)}
                    caption='7% (≤ RM20) / 5%'
                    />
                    <GradientStatCard
                    theme='slate'
                    label='Caj Payment Gateway'
                    icon='heroicons:credit-card'
                    loading={loading}
                    value={toMYR(rumusan.JUMLAH_CAJ_GATEWAY)}
                    caption='RM1.00 setiap transaksi FPX'
                    />
                </div>
                <PecahanKutipan rumusan={rumusan} loading={loading} />
            </section>

            {/* Carian & Penapis */}
            <section className='mt-6'>
                <div className='rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                    <div className='flex flex-col gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'>
                                <Icons icon='heroicons:adjustments-horizontal' className='text-lg' />
                            </div>
                            <div>
                                <h4 className='text-base font-semibold text-slate-900 dark:text-white'>Carian & Penapis</h4>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Rumusan, senarai dan fail Excel mengikut penapis ini.</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            {isFiltered && (
                                <button
                                type='button'
                                onClick={resetFilters}
                                className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
                                >
                                    <Icons icon='heroicons:arrow-path' />
                                    Set Semula
                                </button>
                            )}
                            <button
                            type='button'
                            onClick={getExcel}
                            disabled={downloading || metadata.total === 0}
                            className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                <Icons icon={downloading ? 'svg-spinners:180-ring' : 'heroicons:arrow-down-tray'} />
                                {downloading ? 'Menjana Excel...' : 'Muat Turun Excel'}
                            </button>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-12'>
                        <div className='xl:col-span-3'>
                            <label className='block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1'>Carian</label>
                            <div className='relative'>
                                <Icons icon='heroicons:magnifying-glass' className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                                <input
                                type='text'
                                value={search_input}
                                placeholder='No. transaksi, nama penyumbang...'
                                className='form-control py-2 pl-9'
                                onChange={e => {
                                    set_search_input(e.target.value)
                                    debouncedSearch(e.target.value)
                                }}
                                />
                            </div>
                        </div>
                        <div className='xl:col-span-3'>
                            <label className='block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1'>Tempoh Transaksi</label>
                            <Flatpickr
                            value={filters.dateFrom && filters.dateTo ? [filters.dateFrom, filters.dateTo] : []}
                            className='form-control py-2'
                            placeholder='Semua tarikh'
                            options={{ mode: 'range', dateFormat: 'Y-m-d', altInput: true, altFormat: 'd M Y', altInputClass: 'form-control py-2 !bg-white cursor-pointer dark:!bg-slate-900' }}
                            onChange={dates => {
                                if(dates.length === 2) {
                                    set_page(1)
                                    set_filters(prev => ({
                                        ...prev,
                                        dateFrom: moment(dates[0]).format("YYYY-MM-DD"),
                                        dateTo: moment(dates[1]).format("YYYY-MM-DD")
                                    }))
                                } else if(dates.length === 0) {
                                    set_page(1)
                                    set_filters(prev => ({ ...prev, dateFrom: '', dateTo: '' }))
                                }
                            }}
                            />
                        </div>
                        <div className='xl:col-span-2'>
                            <FilterSelect label='Status' value={filters.status} options={STATUS_OPTIONS} onChange={v => updateFilter('status', v)} />
                        </div>
                        <div className='xl:col-span-2'>
                            <FilterSelect label='Jenis Transaksi' value={filters.type} options={TYPE_OPTIONS} onChange={v => updateFilter('type', v)} />
                        </div>
                        <div className='xl:col-span-2'>
                            <FilterSelect label='Channel Pembayaran' value={filters.channel} options={CHANNEL_OPTIONS} onChange={v => updateFilter('channel', v)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Senarai */}
            <section className='mt-6'>
                <div className='overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                    <div className='flex flex-col gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between'>
                        <div>
                            <h4 className='text-base font-semibold text-slate-900 dark:text-white'>Senarai Transaksi Sumbangan Infaq</h4>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>
                                Menunjukkan {firstRow.toLocaleString('ms-MY')}–{lastRow.toLocaleString('ms-MY')} daripada {Number(metadata.total).toLocaleString('ms-MY')} rekod
                            </p>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
                            <span>Paparan</span>
                            <select
                            value={limit}
                            onChange={e => { set_page(1); set_limit(parseInt(e.target.value)) }}
                            className='form-control w-20 py-1.5'
                            >
                                {LIMIT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[1100px] text-sm'>
                            <thead className='bg-slate-50 dark:bg-slate-800/60'>
                                <tr className='text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                                    <th className='w-12 px-5 py-3'>Bil.</th>
                                    <th className='px-4 py-3'>Transaksi</th>
                                    <th className='px-4 py-3'>Jenis / Channel</th>
                                    <th className='px-4 py-3 text-right'>Jumlah</th>
                                    <th className='px-4 py-3 text-right'>Komisen DT</th>
                                    <th className='px-4 py-3 text-right'>Komisen YIDE</th>
                                    <th className='px-4 py-3 text-right'>Caj Gateway</th>
                                    <th className='px-4 py-3 text-right'>Agihan Institusi</th>
                                    <th className='px-4 py-3 text-center'>Status</th>
                                    <th className='w-16 px-4 py-3 text-center'><span className='sr-only'>Tindakan</span></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-slate-100 dark:divide-slate-700 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                                {
                                    (loading && transaksi.length === 0) && Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={`skeleton-${index}`}>
                                            <td colSpan={10} className='px-5 py-4'>
                                                <div className='h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-700' />
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    (!loading && metadata.total === 0) && (
                                        <tr>
                                            <td colSpan={10} className='px-5 py-12 text-center'>
                                                <Icons icon='heroicons:document-magnifying-glass' className='mx-auto mb-2 text-4xl text-slate-300' />
                                                <p className='text-sm text-slate-500'>Tiada transaksi dijumpai untuk penapis yang dipilih.</p>
                                            </td>
                                        </tr>
                                    )
                                }
                                {
                                    (metadata.total > 0) && transaksi.map((item, index) => {
                                        const type      = TYPE_BADGE[item.billpayment_type]
                                        const channel   = CHANNEL_BADGE[item.billpayment_paymentChannel]
                                        const status    = STATUS_BADGE[item.billpayment_status]
                                        return (
                                            <tr key={item.billpayment_id} className='hover:bg-slate-50/70 dark:hover:bg-slate-700/30'>
                                                <td className='px-5 py-3 text-slate-500'>{firstRow + index}.</td>
                                                <td className='px-4 py-3'>
                                                    <p className='font-mono text-[13px] text-slate-800 dark:text-slate-100'>{item.billpayment_invoiceNo}</p>
                                                    <p className='mt-0.5 max-w-[320px] truncate text-xs text-slate-500 dark:text-slate-400' title={item.organizationName}>
                                                        {moment(item.billpayment_createdDate).format("DD MMM YYYY, hh:mm A")}
                                                        {item.organizationName && <> · {item.organizationName}</>}
                                                    </p>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <div className='flex flex-col items-start gap-1'>
                                                        {type ? <Pill className={type.className}>{type.label}</Pill> : <Pill className='bg-slate-100 text-slate-700 ring-slate-500/20'>{item.billpayment_type}</Pill>}
                                                        <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium ${channel?.className || 'text-slate-500'}`}>
                                                            <Icons icon={channel?.icon || 'heroicons:question-mark-circle'} />
                                                            {channel?.label || item.billpayment_paymentChannel || '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900 dark:text-white'>{toMYR(item.billpayment_amount)}</td>
                                                <td className='whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{toMYR(item.billpayment_commission_dagangtek)}</td>
                                                <td className='whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{toMYR(item.billpayment_commission_yide)}</td>
                                                <td className='whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300'>{toMYR(item.billpayment_gateway_fee)}</td>
                                                <td className='whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-emerald-700 dark:text-emerald-400'>{toMYR(item.billpayment_agihan_institusi)}</td>
                                                <td className='px-4 py-3 text-center'>
                                                    {status && <Pill className={status.className}>{status.label}</Pill>}
                                                </td>
                                                <td className='px-4 py-3 text-center'>
                                                    <Link
                                                    to={"/pengurusan/maklumat-transaksi"}
                                                    state={{ data: item }}
                                                    title='Lihat maklumat transaksi'
                                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white'
                                                    >
                                                        <Icons icon='heroicons:eye' className='text-lg' />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    {metadata.totalPages > 1 && (
                        <div className='flex justify-center border-t border-slate-100 px-5 py-4 dark:border-slate-700'>
                            <Pagination
                            currentPage={page}
                            totalPages={metadata.totalPages}
                            handlePageChange={p => { if(p >= 1 && p <= metadata.totalPages) set_page(p) }}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default LaporanTransaksi;
