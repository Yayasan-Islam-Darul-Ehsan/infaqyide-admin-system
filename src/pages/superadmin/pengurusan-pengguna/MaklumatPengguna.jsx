import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icons from '@/components/ui/Icon'
import Textarea from '@/components/ui/Textarea'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { SYSADMIN_API } from '@/utils/api'
import { Dialog } from 'evergreen-ui'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function MaklumatPengguna() {

    const { state }                                     = useLocation()
    const navigate                                      = useNavigate()

    const [loading, set_loading]                        = useState(true)
    const [pengguna, set_pengguna]                      = useState(state || {})
    const [pengguna_id, set_pengguna_id]                = useState(state.account_id || null)
    const [maklumat_pengguna, set_maklumat_pengguna]    = useState(null)

    const [dialog, set_dialog]                          = useState(false)

    if(!pengguna || !pengguna_id) {
        navigate(-1)
    }

    const getAccountInfo = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/pengguna/${pengguna_id}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_maklumat_pengguna(api.data)
            }   
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi pentadbir sistem anda.")
        } finally {
            set_loading(false)
        }
    }

    const updateAccountInfo = async () => {
        set_dialog(false)
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/pengguna/${pengguna_id}`, maklumat_pengguna, "PATCH", true)
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi pentadbir sistem anda.")
        } finally {
            set_loading(false)
        } 
    }

    useEffect(() => {
        getAccountInfo()
    }, [state])

    if(loading) {
        return <Loading />
    }

    return (
        <div>

            <Dialog
            title="Pengesahan Mengemaskini Maklumat Pengguna"
            intent='danger'
            isShown={dialog}
            cancelLabel='Tutup'
            confirmLabel='Ya, Teruskan'
            onCancel={() => set_dialog(!dialog)}
            onConfirm={updateAccountInfo}
            >
                <div>
                    <p className='text-sm text-slate-600'>Anda pasti untuk mengemaskini maklumat akaun pengguna ini?</p>
                </div>
            </Dialog>

            <section>
                <HomeBredCurbs title={`Maklumat Pengguna: ${state.account_fullname || state.account_username}`} />
            </section>

            <section>
                <Card title={"Kemaskini Maklumat Pengguna"} subtitle={"Sila pasti semua maklumat pengguna lengkap dengan maklumat yang sah."}>

                    {
                        (!maklumat_pengguna.account_fullname || !maklumat_pengguna.account_email || !maklumat_pengguna.account_phone || !maklumat_pengguna.account_address) && (
                            <div className='border border-yellow-600 rounded-lg mb-6 bg-white shadow-lg shadow-yellow-50'>
                                <div className='bg-yellow-50 rounded-lg p-3 flex gap-1 items-center'>
                                    <Icons icon={"heroicons:exclamation-triangle"} className={"text-yellow-600 text-lg"} />
                                    <p className='font-medium text-base text-yellow-600'>Maklumat Tidak Lengkap</p>
                                </div>
                                <div className='bg-white rounded-lg p-3'>
                                    <p className='font-normal text-sm text-slate-600'>Maklumat akaun pengguna ini tidak lengkap.</p>
                                </div>
                            </div>
                        )
                    }
                    {/* {JSON.stringify(maklumat_pengguna, undefined, 4)} */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 last:col-span-1 gap-3'>
                        <div>
                            <Textinput 
                            label={"Nama Pengguna"}
                            placeholder='Contoh: ZahariAzar'
                            defaultValue={maklumat_pengguna.account_username}
                            onChange={e => {
                                //set_maklumat_pengguna({...maklumat_pengguna, account_username: e.target.value })
                            }}
                            disabled={true}
                            enableWhiteSpace={false}
                            />
                        </div>
                        <div>
                            <Textinput 
                            label={"Nama Penuh"}
                            placeholder='Contoh: Zahari Azar'
                            defaultValue={maklumat_pengguna.account_fullname}
                            onChange={e => set_maklumat_pengguna({...maklumat_pengguna, account_fullname: e.target.value })}
                            />
                        </div>
                        <div>
                            <Textinput 
                            label={"E-mel Pengguna"}
                            placeholder='Contoh: zahari1928123@email.com'
                            defaultValue={maklumat_pengguna.account_email}
                            onChange={e => set_maklumat_pengguna({...maklumat_pengguna, account_email: e.target.value })}
                            enableWhiteSpace={false}
                            />
                        </div>
                        <div>
                            <Textinput 
                            label={"No. Telefon Pengguna"}
                            placeholder='Contoh: 0123456789'
                            defaultValue={maklumat_pengguna.account_phone}
                            onChange={e => set_maklumat_pengguna({...maklumat_pengguna, account_phone: e.target.value })}
                            isNumberOnly
                            enableWhiteSpace={false}
                            />
                        </div>
                    </div>
                    <div className='mt-3 grid grid-cols-1 gap-3'>
                        <div>
                            <Textarea 
                            label={"Alamat Menetap"}
                            placeholder='Contoh: No 11, Jalan Bandar Tasik Selatan, 57000 Kuala Lumpur'
                            dvalue={maklumat_pengguna.account_address}
                            onChange={e => set_maklumat_pengguna({...maklumat_pengguna, account_phone: e.target.address })}
                            isNumberOnly
                            enableWhiteSpace={false}
                            />
                        </div>
                    </div>
                </Card>
            </section>
            <section className='mt-6'>
                <div className='flex justify-end items-center'>
                    <Button onClick={() => set_dialog(!dialog)} className='bg-teal-600 text-white'>Kemaskini Maklumat</Button>
                </div>
            </section>
        </div>
    )
}

export default MaklumatPengguna