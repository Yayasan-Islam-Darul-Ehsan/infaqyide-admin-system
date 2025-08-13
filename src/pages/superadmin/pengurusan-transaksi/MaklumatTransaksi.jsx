import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { SYSADMIN_API } from '@/utils/api'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function MaklumatTransaksiSumbangan() {

    const { year, data }                                = useLocation().state
    const navigate                                      = useNavigate()

    const [loading, set_loading]                        = useState(true)
    const [transaksi, set_transaksi]                    = useState(data.billpayment_id || {})
    const [transaksi_id, set_transaksi_id]              = useState(data.billpayment_id || null)
    const [maklumat_transaksi, set_maklumat_transaksi]  = useState(null)

    const [dialog, set_dialog]                          = useState(false)

    if(!transaksi || !transaksi_id) {
        navigate(-1)
    }

    const getTransactionInfo = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/transaksi/${transaksi_id}?year=${year}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_maklumat_transaksi(api.data)
            }   
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi pentadbir sistem anda.")
        } finally {
            set_loading(false)
        }
    }

    const send_notification = async () => {
        // THIS IS SECTION FOR SENDING PAYMENT NOTIFICATION TO PAYER
    }

    const send_receipt = async () => {
        // THIS IS SECTION FOR SEND RECEIPT TO PAYER
    }

    useEffect(() => {
        getTransactionInfo()
    }, [year, data])

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <div className="flex justify-between flex-wrap items-center mb-6">
                <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                    {`Maklumat Transaksi - ${data.billpayment_invoiceNo}`}
                </p>
                <div className='flex flex-row items-center gap-3'>
                    <Button 
                    icon={"heroicons:bell"} 
                    text={"Hantar Notifikasi"}
                    className='bg-teal-600 text-white'
                    disabled={maklumat_transaksi.billpayment_status !== 1}
                    isLoading={loading}
                    />
                    <Button 
                    icon={"heroicons:envelope"} 
                    text={"Hantar Resit"}
                    className='bg-info-600 text-white'
                    disabled={maklumat_transaksi.billpayment_status !== 1}
                    isLoading={loading}
                    />
                </div>
            </div>

            <section>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-3'>
                    <div className='col-span-1 md:col-span-7'>
                        <Card>
                            <div>
                                <p className='font-semibold text-base text-black-500'>Maklumat Pembayaran</p>
                            </div>
                            <div className='mt-3 space-y-3'>
                                <div>
                                    <label htmlFor="" className='form-label'>Status</label>
                                    <p className={`font-semibold ${maklumat_transaksi.billpayment_status === 1 ? "text-emerald-600" : "text-yellow-600"} text-sm`}>{maklumat_transaksi.billpayment_status === 1 ? "Pembayaran Berjaya" : "Gagal Pembayaran"}</p>
                                </div>
                                <Textinput 
                                label={"No. Rujukan Transaksi"}
                                placeholder='Contoh: YI0912381928391839813'
                                defaultValue={maklumat_transaksi.billpayment_invoiceNo}
                                disabled={true}
                                />
                                <Textinput 
                                label={"Jenis Transaksi"}
                                placeholder='Contoh: Infaq'
                                defaultValue={maklumat_transaksi.billpayment_type}
                                disabled={true}
                                />
                                <Textinput 
                                label={"Jumlah Transaksi (RM)"}
                                placeholder='Contoh: RM10.00'
                                defaultValue={`RM` + parseFloat(maklumat_transaksi.billpayment_amount).toFixed(2)}
                                disabled={true}
                                />
                                <Textinput 
                                label={"Tarikh Pembayaran"}
                                placeholder='Contoh: 12 Julai 2025'
                                defaultValue={moment(maklumat_transaksi.billpayment_createdDate).format("DD MMM YYYY, hh:mm A")}
                                disabled={true}
                                />
                                <Textinput 
                                label={"Kaedah Pembayaran"}
                                placeholder='Contoh: Online Banking FPX'
                                defaultValue={maklumat_transaksi.billpayment_paymentChannel === "1" ? "Online Banking FPX" : "Akaun Kredit"}
                                disabled={true}
                                />
                                <Textinput 
                                label={"No. Rujukan FPX"}
                                placeholder='Contoh: 20259182391823'
                                defaultValue={maklumat_transaksi.billpayment_FpxId || "-- tiada maklumat --"}
                                disabled={true}
                                />
                                <Textinput 
                                label={"No. Rujukan toyyibPay"}
                                placeholder='Contoh: TP01923129301920123'
                                defaultValue={maklumat_transaksi.billpayment_toyyibpayInvoiceNo || "-- tiada maklumat --"}
                                disabled={true}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className='col-span-1 md:col-span-5 flex flex-col gap-3'>
                        <Card>
                            <div>
                                <p className='font-semibold text-base text-black-500'>Maklumat Institusi Sumbangan</p>
                            </div>
                            <div>
                                {
                                    maklumat_transaksi.organizationId && (
                                        <>
                                        <div className='flex flex-col justify-center items-center space-y-3'>
                                            <div>
                                                <img src={maklumat_transaksi.organizationImage} alt="" srcset="" className='w-[100px] h-[100px] rounded-full shadow-lg' />
                                            </div>
                                            <div className='mt-3'>
                                                <p className='font-semibold text-lg text-black-500 text-center'>{maklumat_transaksi.organizationName}</p>
                                                <div className='mt-3'></div>
                                                <p className='font-normal text-sm text-slate-500 text-center'>{maklumat_transaksi.organizationEmail || '-- tiada maklumat e-mel --'}</p>
                                                <p className='font-normal text-sm text-slate-500 text-center'>{maklumat_transaksi.organizationPhone || '-- tiada maklumat telephone --'}</p>
                                            </div>
                                        </div>
                                        </>
                                    )
                                }
                            </div>
                        </Card>
                        <Card>
                            <div>
                                <p className='font-semibold text-base text-black-500'>Maklumat Pembayar</p>
                            </div>  
                            <div className='mt-3 space-y-3'>
                                <Textinput 
                                label={"Nama Pembayar"}
                                placeholder='Contoh: Zahari Azar'
                                defaultValue={maklumat_transaksi.account_fullname || maklumat_transaksi.account_username}
                                disabled={true}
                                />
                                <Textinput 
                                label={"E-mel Pembayar"}
                                placeholder='Contoh: zahari18988293@email.com'
                                defaultValue={maklumat_transaksi.account_email || '-- tiada maklumat --'}
                                disabled={true}
                                />
                                <Textinput 
                                label={"No. Telefon Pembayar"}
                                placeholder='Contoh: 0123456789'
                                defaultValue={maklumat_transaksi.account_phone || '-- tiada maklumat --'}
                                disabled={true}
                                />
                            </div>    
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MaklumatTransaksiSumbangan