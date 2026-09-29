import Loading from '@/components/Loading'
import Icons from '@/components/ui/Icon'
import GradientStatCard from '@/components/ui/GradientStatCard'
import { SYSADMIN_API, SYSADMIN_API_FILE } from '@/utils/api'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const LOGO_INFAQYIDE = "https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/89/80/fe/8980fe8a-9e65-d611-b7b9-9be5d186d4b3/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp"

const STATUS = {
    1: { label: 'Berjaya', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', stamp: 'border-emerald-500 text-emerald-600', stampLabel: 'DIBAYAR' },
    2: { label: 'Dalam Proses', className: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20', stamp: 'border-yellow-500 text-yellow-600', stampLabel: 'DALAM PROSES' },
    3: { label: 'Gagal', className: 'bg-red-50 text-red-700 ring-red-600/20', stamp: 'border-red-500 text-red-600', stampLabel: 'GAGAL' },
    4: { label: 'Tidak Selesai', className: 'bg-slate-100 text-slate-700 ring-slate-500/20', stamp: 'border-slate-400 text-slate-500', stampLabel: 'TIDAK SELESAI' }
}

const JENIS = {
    'Infaq': 'Infaq Am',
    'Auto-Infaq': 'Auto Infaq',
    'Auto-infaq': 'Auto Infaq',
    'Kempen': 'Kempen',
    'Topup': 'Tambah Nilai'
}

const SETTLEMENT = {
    'Pending': { label: 'Menunggu Agihan', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
    'Approved': { label: 'Telah Diagihkan', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
    'Rejected': { label: 'Agihan Ditolak', className: 'bg-red-50 text-red-700 ring-red-600/20' },
    'Others': { label: 'Lain-Lain', className: 'bg-slate-100 text-slate-700 ring-slate-500/20' }
}

function toMYR(amount = 0) {
    return Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(parseFloat(amount || 0))
}

function Pill({ className = '', children }) {
    return <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}>{children}</span>
}

function Field({ label, value, mono = false }) {
    return (
        <div>
            <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>{label}</p>
            <p className={`mt-1 break-all text-sm text-slate-800 dark:text-slate-100 ${mono ? 'font-mono' : ''}`}>{value || '–'}</p>
        </div>
    )
}

function SideCard({ title, tag, children }) {
    return (
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-5 flex items-center justify-between'>
                <h4 className='text-base font-semibold text-slate-900 dark:text-white'>{title}</h4>
                {tag && <span className='rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-500/10'>{tag}</span>}
            </div>
            {children}
        </div>
    )
}

function MaklumatTransaksiSumbangan() {

    const location                          = useLocation()
    const navigate                          = useNavigate()
    const data                              = location.state?.data || {}
    const transaksi_id                      = data.billpayment_id || null

    const [loading, set_loading]            = useState(true)
    const [trx, set_trx]                    = useState(null)
    const [downloading, set_downloading]    = useState(false)

    const muatTurunResit = async () => {
        set_downloading(true)
        try {
            let { blob, fileName } = await SYSADMIN_API_FILE(`pengurusan/transaksi/${transaksi_id}/resit`, `Resit-InfaqYIDE-${trx.billpayment_invoiceNo}.pdf`)
            const url  = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch (e) {
            toast.error(e.message || "Resit tidak dapat dimuat turun.")
        } finally {
            set_downloading(false)
        }
    }

    const getTransactionInfo = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/transaksi/${transaksi_id}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_trx(api.data)
            } else {
                toast.error(api.message || "Maklumat transaksi tidak dijumpai.")
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi pentadbir sistem anda.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => {
        if(!transaksi_id) {
            navigate(-1)
            return
        }
        getTransactionInfo()
    }, [transaksi_id])

    if (loading) {
        return <Loading />
    }

    if (!trx) {
        return (
            <div className='rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm'>
                <Icons icon='heroicons:document-magnifying-glass' className='mx-auto mb-3 text-5xl text-slate-300' />
                <p className='text-slate-500'>Maklumat transaksi tidak dijumpai.</p>
                <button type='button' onClick={() => navigate(-1)} className='btn btn-sm mt-4 rounded-lg border border-slate-200 bg-white text-slate-700'>Kembali</button>
            </div>
        )
    }

    const status            = STATUS[trx.billpayment_status] || STATUS[4]
    const berjaya           = Number(trx.billpayment_status) === 1
    const jenis             = JENIS[trx.billpayment_type] || trx.billpayment_type
    const isFPX             = trx.billpayment_paymentChannel === "Online Banking"
    const channel           = isFPX ? "Online Banking (FPX)" : (trx.billpayment_paymentChannel || "–")
    const amaun             = parseFloat(trx.billpayment_amount || 0)
    const dt                = parseFloat(trx.billpayment_amountToDT || 0)
    const yide              = parseFloat(trx.billpayment_amountToYIDE || 0)
    const agihan_yide_lama  = parseFloat(trx.billpayemnt_amountSplitYIDE || 0)
    const institusi         = parseFloat(trx.billpayemnt_amountSplitInstitusi || 0)
    const isTopup           = trx.billpayment_type === "Topup"
    const caj_gateway       = isTopup ? 0 : Math.max(Math.round((amaun - dt - yide - agihan_yide_lama - institusi) * 100) / 100, 0)
    const jumlah_potongan   = dt + yide + agihan_yide_lama + caj_gateway
    const peratus           = value => amaun > 0 ? `${Math.round((value / amaun) * 100)}%` : ''
    const nama_penyumbang   = trx.account_fullname || trx.billpayment_payorName || trx.account_username || '–'
    const emel_penyumbang   = trx.account_email || trx.billpayment_payorEmail
    const telefon_penyumbang = trx.account_phone || trx.billpayment_payorPhone
    const tarikh            = moment(trx.billpayment_createdDate)
    const settlement        = SETTLEMENT[trx.settlement_status]

    return (
        <div>
            {/* Header */}
            <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div>
                    <button type='button' onClick={() => navigate(-1)} className='mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white'>
                        <Icons icon='heroicons:arrow-left' />
                        Kembali ke senarai transaksi
                    </button>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Sumbangan {jenis} {toMYR(amaun)}</h1>
                        <Pill className={status.className}>{status.label}</Pill>
                        <Pill className='bg-slate-50 text-slate-700 ring-slate-500/20'>{jenis}</Pill>
                    </div>
                    <p className='mt-1 font-mono text-sm text-slate-500'>{trx.billpayment_invoiceNo}</p>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <button
                    type='button'
                    onClick={muatTurunResit}
                    disabled={!berjaya || isTopup || downloading}
                    className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <Icons icon={downloading ? 'svg-spinners:180-ring' : 'heroicons:arrow-down-tray'} />
                        {downloading ? 'Menjana PDF...' : 'Muat Turun Resit (PDF)'}
                    </button>
                    <button
                    type='button'
                    disabled
                    title='Akan datang'
                    className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <Icons icon='heroicons:envelope' />
                        Hantar Resit
                    </button>
                    <button
                    type='button'
                    disabled
                    title='Akan datang'
                    className='btn btn-sm inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <Icons icon='heroicons:bell' />
                        Hantar Notifikasi
                    </button>
                </div>
            </div>

            {/* Amaran status */}
            {!berjaya && (
                <div className='mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'>
                    <Icons icon='heroicons:exclamation-triangle' className='mt-0.5 shrink-0 text-xl' />
                    <div>
                        <p className='font-semibold'>Resit tidak tersedia</p>
                        <p className='text-sm'>
                            Transaksi ini berstatus <b>{status.label}</b>. Resit rasmi hanya dikeluarkan untuk transaksi berjaya.
                        </p>
                    </div>
                </div>
            )}

            {/* Ringkasan */}
            <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
                <GradientStatCard
                theme='blue'
                label='Amaun Dibayar'
                icon='heroicons:banknotes'
                value={toMYR(amaun)}
                caption={channel}
                />
                <GradientStatCard
                theme='purple'
                label='Jumlah Potongan'
                icon='heroicons:receipt-percent'
                value={isTopup ? '–' : toMYR(jumlah_potongan)}
                caption={isTopup ? 'Tiada potongan untuk tambah nilai' : 'Komisen DT, YIDE & caj gateway'}
                />
                <GradientStatCard
                theme='green'
                label='Diterima Institusi'
                icon='heroicons:building-library'
                value={isTopup ? '–' : toMYR(institusi)}
                caption={isTopup ? 'Masuk ke akaun kredit pengguna' : 'Nilai bersih agihan'}
                />
                <GradientStatCard
                theme='orange'
                label='Tarikh Transaksi'
                icon='heroicons:calendar-days'
                value={tarikh.format('DD MMM YYYY')}
                caption={tarikh.format('hh:mm A')}
                />
            </div>

            <div className='mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3'>

                {/* Resit rasmi */}
                <div className='xl:col-span-2'>
                    <div className='relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                        <div className='h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500' />

                        {/* Cop status */}
                        <div className={`pointer-events-none absolute right-8 top-28 rotate-[-12deg] rounded-xl border-4 px-4 py-1 text-xl font-black tracking-[0.2em] opacity-20 ${status.stamp}`}>
                            {status.stampLabel}
                        </div>

                        <div className='p-8'>
                            {/* Kepala resit */}
                            <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
                                <div className='flex items-center gap-4'>
                                    <img src={LOGO_INFAQYIDE} alt='InfaqYIDE' className='h-14 w-14 rounded-2xl shadow-sm' />
                                    <div>
                                        <p className='text-xl font-bold text-slate-900 dark:text-white'>InfaqYIDE</p>
                                        <p className='text-sm text-slate-500'>Yayasan Islam Darul Ehsan</p>
                                    </div>
                                </div>
                                <div className='sm:text-right'>
                                    <p className='text-xs font-bold uppercase tracking-[0.2em] text-emerald-600'>Resit Rasmi Sumbangan</p>
                                    <p className='mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white'>{trx.billpayment_invoiceNo}</p>
                                    <p className='text-sm text-slate-500'>{tarikh.format('DD MMMM YYYY, hh:mm A')}</p>
                                </div>
                            </div>

                            <div className='my-6 border-t border-dashed border-slate-200 dark:border-slate-600' />

                            {/* Pihak */}
                            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                <div>
                                    <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>Diterima Daripada</p>
                                    <p className='mt-2 font-semibold text-slate-900 dark:text-white'>{nama_penyumbang}</p>
                                    {emel_penyumbang && <p className='text-sm text-slate-500'>{emel_penyumbang}</p>}
                                    {telefon_penyumbang && <p className='text-sm text-slate-500'>{telefon_penyumbang}</p>}
                                </div>
                                <div>
                                    <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>Disalurkan Kepada</p>
                                    {trx.organizationId ? (
                                        <div className='mt-2 flex items-center gap-3'>
                                            {trx.organizationImage && <img src={trx.organizationImage} alt='' className='h-10 w-10 rounded-full border border-slate-100 object-cover' />}
                                            <div>
                                                <p className='font-semibold text-slate-900 dark:text-white'>{trx.organizationName}</p>
                                                {trx.organizationEmail && <p className='text-sm text-slate-500'>{trx.organizationEmail}</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className='mt-2 text-sm text-slate-500'>Akaun kredit InfaqYIDE</p>
                                    )}
                                </div>
                            </div>

                            {/* Butiran */}
                            <div className='mt-8 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700'>
                                <table className='w-full text-sm'>
                                    <thead className='bg-slate-50 dark:bg-slate-700/40'>
                                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500'>
                                            <th className='px-5 py-3'>Butiran</th>
                                            <th className='px-5 py-3 text-right'>Amaun</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-slate-100 dark:divide-slate-700'>
                                        <tr>
                                            <td className='px-5 py-4'>
                                                <p className='font-medium text-slate-900 dark:text-white'>Sumbangan {jenis}</p>
                                                <p className='text-xs text-slate-500'>{trx.billpayment_billdescription || trx.billpayment_billname}</p>
                                            </td>
                                            <td className='px-5 py-4 text-right font-semibold tabular-nums text-slate-900 dark:text-white'>{toMYR(amaun)}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot className='bg-slate-900 text-white dark:bg-slate-950'>
                                        <tr>
                                            <td className='px-5 py-4 text-xs font-bold uppercase tracking-[0.2em]'>Jumlah Dibayar</td>
                                            <td className='px-5 py-4 text-right text-lg font-bold tabular-nums'>{toMYR(amaun)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Pecahan agihan */}
                            {!isTopup && (
                                <div className='mt-6 rounded-xl bg-slate-50 p-5 dark:bg-slate-700/30'>
                                    <p className='mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400'>Pecahan Agihan Sumbangan</p>
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                            <span>Komisen DagangTEK {peratus(dt)}</span>
                                            <span className='tabular-nums'>– {toMYR(dt)}</span>
                                        </div>
                                        <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                            <span>Komisen YIDE {peratus(yide)}</span>
                                            <span className='tabular-nums'>– {toMYR(yide)}</span>
                                        </div>
                                        {agihan_yide_lama > 0 && (
                                            <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                                <span>Agihan YIDE (formula lama)</span>
                                                <span className='tabular-nums'>– {toMYR(agihan_yide_lama)}</span>
                                            </div>
                                        )}
                                        <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                            <span>Caj payment gateway</span>
                                            <span className='tabular-nums'>– {toMYR(caj_gateway)}</span>
                                        </div>
                                        <div className='flex justify-between border-t border-slate-200 pt-2 font-semibold text-emerald-700 dark:border-slate-600 dark:text-emerald-400'>
                                            <span>Agihan bersih kepada institusi</span>
                                            <span className='tabular-nums'>{toMYR(institusi)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Maklumat pembayaran ringkas */}
                            <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                                <Field label='Kaedah Bayaran' value={channel} />
                                <Field label='Status' value={status.label} />
                                <Field label='No. Rujukan FPX' value={trx.billpayment_FpxId} mono />
                                <Field label='Invois toyyibPay' value={trx.billpayment_toyyibpayInvoiceNo} mono />
                            </div>

                            <div className='mt-8 flex flex-col items-center gap-1 border-t border-dashed border-slate-200 pt-6 text-center dark:border-slate-600'>
                                <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>Terima kasih atas sumbangan anda. Semoga Allah SWT memberkati.</p>
                                <p className='text-xs text-slate-400'>Resit ini dijana oleh komputer dan tidak memerlukan tandatangan.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel sisi */}
                <div className='space-y-6'>
                    <SideCard title='Maklumat Pembayaran' tag='Bayaran'>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1'>
                            <Field label='No. Rujukan' value={trx.billpayment_invoiceNo} mono />
                            <Field label='Kod Bil' value={trx.billpayment_billcode} mono />
                            <Field label='Invois Gerbang' value={trx.billpayment_toyyibpayInvoiceNo} mono />
                            <Field label='ID FPX' value={trx.billpayment_FpxId} mono />
                            <Field label='Saluran Bayaran' value={channel} />
                            <div>
                                <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>Status</p>
                                <div className='mt-1 flex items-center gap-2'>
                                    <Pill className={status.className}>{status.label}</Pill>
                                    <span className='text-xs text-slate-400'>({trx.billpayment_status})</span>
                                </div>
                            </div>
                            <Field label='Kemas Kini Terakhir' value={trx.billpayment_lastModified ? moment(trx.billpayment_lastModified).format('DD MMM YYYY, hh:mm A') : null} />
                        </div>
                    </SideCard>

                    {!isTopup && (
                        <SideCard title='Status Agihan' tag='Settlement'>
                            {trx.settlement_batch_no ? (
                                <div className='space-y-4'>
                                    <div>
                                        <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>Status</p>
                                        <div className='mt-1'>
                                            {settlement ? <Pill className={settlement.className}>{settlement.label}</Pill> : trx.settlement_status}
                                        </div>
                                    </div>
                                    <Field label='No. Batch' value={trx.settlement_batch_no} mono />
                                    <Field label='No. EFT' value={trx.settlement_eft_no} mono />
                                    <Field label='Tarikh Settlement' value={trx.settlement_date ? moment(trx.settlement_date).format('DD MMM YYYY') : null} />
                                </div>
                            ) : (
                                <div className='rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700/30'>
                                    {berjaya
                                        ? 'Transaksi ini belum dimasukkan ke dalam batch agihan. Batch dijana secara automatik pada hari bekerja berikutnya.'
                                        : 'Hanya transaksi berjaya akan diagihkan kepada institusi.'}
                                </div>
                            )}
                        </SideCard>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MaklumatTransaksiSumbangan
