import Loading from '@/components/Loading'
import { SYSADMIN_API } from '@/utils/api'
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

    useEffect(() => {
        getTransactionInfo()
    }, [year, data])

    if (loading) {
        return <Loading />
    }

    return (
        <div>MaklumatTransaksi</div>
    )
}

export default MaklumatTransaksiSumbangan