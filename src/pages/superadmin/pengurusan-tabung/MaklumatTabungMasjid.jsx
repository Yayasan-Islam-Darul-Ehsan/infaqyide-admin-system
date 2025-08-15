import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { SYSADMIN_API } from '@/utils/api'
import { Dialog } from 'evergreen-ui'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function MaklumatTabungMasjid() {

    const { state }                                     = useLocation()
    const navigate                                      = useNavigate()

    const [loading, set_loading]                        = useState(true)
    const [tabung, set_tabung]                          = useState(state || {})
    const [tabung_id, set_tabung_id]                    = useState(state.tabungId || null)
    const [maklumat_tabung, set_maklumat_tabung]        = useState(null)

    const [dialog, set_dialog]                          = useState(false)

    if(!tabung || !tabung_id) {
        navigate(-1)
    }

    const getTabungInfo = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/tabung/${tabung_id}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_maklumat_tabung(api.data)
            }   
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi pentadbir sistem anda.")
        } finally {
            set_loading(false)
        }
    }

    const updateTabungInfo = async () => {
        set_dialog(false)
        set_loading(true)

        try {
            
            let api = await SYSADMIN_API(`pengurusan/tabung/${tabung_id}`, maklumat_tabung, "PATCH", true)
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate(-1)
                }, 500);
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk mengemaskini maklumat tabung. Sila hubungi pentadbir sistem anda.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => {
        getTabungInfo()
    }, [state])

    if (loading) {
        return <Loading />
    }

    return (
        <div>

            <Dialog
            isShown={dialog}
            title="Pengesahan Kemaskini Maklumat Tabung"
            cancelLabel='Tutup'
            confirmLabel='Ya, Teruskan'
            onCloseComplete={() => set_dialog(false)}
            onCancel={() => set_dialog(false)}
            onConfirm={updateTabungInfo}
            >
                <p className='font-normal text-sm text-slate-600'>Anda pasti untuk mengemaskini maklumat tabung ini?</p>
            </Dialog>

            <div className="flex justify-between flex-wrap items-center mb-6">
                <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                    {`Maklumat Tabung - ${state.tabungName}`}
                </p>
            </div>

            <section>
                <Card title={"Maklumat Tabung"} subtitle={"Lengkapkan maklumat tabung institusi di bawah dan pastikan semua maklumat adalah benar."}>
                    <div className='grid grdi-cols-1 md:grid-cols-2 gap-3'>
                        <Textinput 
                        label={"Kod Tabung"}
                        placeholder='Contoh: TB09192012983912'
                        defaultValue={maklumat_tabung.tabungCode}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Nama Institusi - Pemilik Tabung"}
                        placeholder='Contoh: MASJID AN-NUR'
                        defaultValue={maklumat_tabung.organizationName}
                        disabled={true}
                        />
                    </div>
                    <div className='mt-3 grid grdi-cols-1 md:grid-cols-1 gap-3'>
                        <Select 
                        label={"Jenis Tabung"}
                        placeholder='Contoh: Infaq'
                        defaultValue={maklumat_tabung.tabungType}
                        onChange={e => set_maklumat_tabung({...maklumat_tabung, tabungType: e.target.value})}
                        options={[
                            {label: 'Infaq', value:'Infaq'},
                            {label: 'Wakaf', value:'Wakaf'},
                            {label: 'Kempen', value:'Kempen'},
                        ]}
                        />
                        <Textinput 
                        label={"Nama Tabung"}
                        placeholder='Contoh: Tabung Anak Yatim An-Nur'
                        defaultValue={maklumat_tabung.tabungName}
                        onChange={e => set_maklumat_tabung({...maklumat_tabung, tabungName: e.target.value})}
                        />
                        <Textarea 
                        label={"Keterangan Tabung"}
                        placeholder='Contoh: Keterangan Tabung Anak Yatim An-Nur'
                        dvalue={maklumat_tabung.tabungDescription}
                        onChange={e => set_maklumat_tabung({...maklumat_tabung, tabungDescription: e.target.value})}
                        />
                    </div>
                    <div className='mt-3 grid grdi-cols-1 md:grid-cols-2 gap-3'>
                        <Textinput 
                        label={"Baki Semasa Tabung"}
                        placeholder='100.00'
                        defaultValue={maklumat_tabung.tabungBalance}
                        onChange={e => set_maklumat_tabung({...maklumat_tabung, tabungBalance: e.target.value})}
                        isNumberOnly
                        enableWhiteSpace={false}
                        />
                        <Textinput 
                        label={"Baki Apungan Tabung"}
                        placeholder='0.00'
                        defaultValue={maklumat_tabung.tabungFloat}
                        onChange={e => set_maklumat_tabung({...maklumat_tabung, tabungFloat: e.target.value})}
                        isNumberOnly
                        enableWhiteSpace={false}
                        />
                    </div>
                </Card>
                <div className='mt-3 flex justify-end items-center'>
                    <Button 
                    text={"Kemaskini Maklumat"}
                    icon={"heroicons:inbox-arrow-down"}
                    onClick={() => set_dialog(true)}
                    className='bg-teal-600 text-white'
                    />
                </div>
            </section>
        </div>
    )
}

export default MaklumatTabungMasjid