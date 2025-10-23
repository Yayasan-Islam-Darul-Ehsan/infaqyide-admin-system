import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';

MaklumatTabung.propTypes = {
    
};

function MaklumatTabung(props) {

    const state                                         = useLocation().state
    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading_page, set_loading_page]              = useState(true)
    const [loading, set_loading]                        = useState(false)
    const [tabung_id, set_tabung_id]                    = useState(state.tabung_id)
    const [tabung_type, set_tabung_type]                = useState("")
    const [tabung_bank, set_tabung_bank]                = useState("")
    const [tabung_name, set_tabung_name]                = useState("")
    const [tabung_description, set_tabung_description]  = useState("")
    const [tabung_permalink, set_tabung_permalink]      = useState("")
    const [tabung_status, set_tabung_status]            = useState("Aktif")

    const [opt_for_bank, set_opt_for_bank]              = useState([])

    const [disabled_editing, set_disable_editing]       = useState(true)

    const [modal, set_modal] = useState(false)

    const GET__LIST__BANK = async () => {
        set_loading_page(true)
        let api = await API("getBankInstitusi", { org_id: user.user ? user.user.id : user.id })
        console.log("Log Get List Bank : ", api)

        if(api.status === 200) {
            if(api.data.length > 0) {

                let data    = api.data
                let array   = []

                array.push({
                    label: '-- Pilih Bank --',
                    value: ''
                })
                for (let i = 0; i < data.length; i++) {
                    array.push({
                        label: data[i]["org_bank_acc_name"] + " - (" + data[i]["org_bank_acc_id"] + ")",
                        value: data[i]["org_bank_acc_id"]
                    })
                }
                console.log("Bank Options: ", array);
                set_opt_for_bank(array)
            }
        }
    }

    const GET__TABUNG__DETAILS = async () => {
        set_loading_page(true)
        let api = await API("getTabungDetails", { tabung_id: state.tabung_id })
        console.log("Log Api Get Tabung Details : ", api)
        if(api.status === 200) {
            set_tabung_type(api.data[0].tabung_type)
            set_tabung_bank(api.data[0].org_bank_acc_id)
            set_tabung_name(api.data[0].tabung_name)
            set_tabung_description(api.data[0].tabung_desc)
            set_tabung_permalink(api.data[0].tabung_permalink)
            set_tabung_bank(parseInt(api.data[0].org_bank_acc_id))
            
        }

        setTimeout(() => {
            set_loading_page(false)
        }, 1000);
    }

    const UPDATE__TABUNG = async () => {

        if(!tabung_type) {
            toast.error("Maklumat jenis tabung tidak lengkap. Sila pastikan maklumat jenis tabung telah lengkap.")
        }
        else if(!tabung_bank) {
            toast.error("Maklumat bank tabung tidak lengkap. Sila pastikan maklumat bank tabung telah lengkap.")
        }
        else if(!tabung_name) {
            toast.error("Maklumat nama tabung tidak lengkap. Sila pastikan maklumat bank tabung telah lengkap.")
        }
        else if(!tabung_description) {
            toast.error("Maklumat keterangan tabung tidak lengkap. Sila pastikan maklumat keterangan tabung telah lengkap.")
        }
        else if(!tabung_permalink) {
            toast.error("Maklumat permalink tabung tidak lengkap. Sila pastikan maklumat permalink tabung telah lengkap.")
        }
        else {
            
            set_loading(true)
            set_loading_page(true)

            let json = {
                tabung_bankacc : tabung_bank,
                tabung_desc: tabung_description,
                tabung_id: tabung_id,
                tabung_name: tabung_name,
                tabung_permalink: tabung_permalink,
                tabung_status: 1,
                tabung_type: tabung_type
            }

            console.log("Log JSON : ", json)

            let api = await API("updateTabung", json)
            console.log("Log Function Update Tabung : ", api)

            if(api.status !== 200) {
                toast.error(api.message)
            }
            else {
                toast.success("Kemaskini maklumat tabung anda telah berjaya disimpan.")
                setTimeout(() => {
                    navigate(-1)
                }, 500);
            }
        }
    }

    useEffect(() => {
        GET__LIST__BANK()
        GET__TABUNG__DETAILS()
    }, [])

    if(loading_page) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Kemaskini Maklumat Tabung'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={() => set_modal(false)}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={() => set_modal(false)}>Tidak</Button>
                    <Button className='bg-success-600 text-white' onClick={() => { 
                        set_modal(false)
                        UPDATE__TABUNG()
                    }}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-600'>Anda pasti untuk mengemaskini maklumat tabung anda?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Tabung Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai tabung institusi anda.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        {
                            disabled_editing && (<Button onClick={() => set_disable_editing(!disabled_editing)} className='bg-teal-600 font-medium text-sm text-white'>Aktifkan Kemaskini</Button>)
                        }
                        {
                            !disabled_editing && (<Button onClick={() => set_disable_editing(!disabled_editing)} className='bg-white text-gray-600 font-medium text-sm'>Nyahaktif Kemaskini</Button>)
                        }
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                    <div>
                        <p className='font-semibold text-lg text-gray-600'>Peringatan!</p>
                    </div>
                    <div className=''>
                        <ul className=''>
                            <li className='text-sm text-gray-600'>Semua medan dibawah adalah wajib diisi.</li>
                            {/* <li className='text-sm text-gray-600'>2. Sila pastikan semua maklumat yang diisi adalah tepat dan benar.</li> */}
                        </ul>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-lg text-gray-900'>Maklumat Tabung</p>
                        <p className='font-normal text-sm text-gray-600'>Informasi mengenai tabung yang akan disimpan.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Select 
                            
                            label={"Jenis Tabung"}
                            placeholder='Contoh: Infaq'
                            description={"Jenis tabung adalah kategori tabung yang telah dibahagikan kepada 3 jenis iaitu tabung infaq, tabung waqaf dan tabung kempen."}
                            dvalue={tabung_type}
                            disabled={disabled_editing}
                            options={[
                                {label: 'Infaq', value: 'Infaq'},
                                {label: 'Waqaf', value: 'Wakaf'},
                                {label: 'Kempen', value: 'Kempen'},
                            ]}
                            onChange={e => set_tabung_type(e.target.value)}
                            />
                        </div>
                        {
                            (
                                <div className='mt-3'>
                                    <Select 
                                    
                                    label={"Pilih Akaun Bank"}
                                    placeholder='Contoh: Maybank2U'
                                    description={'Sila pilih bank yang telah anda daftarkan. Jika tiada, sila tambah rekod bank anda terlebih dahulu.'}
                                    defaultValue={tabung_bank}
                                    disabled={disabled_editing}
                                    options={opt_for_bank}
                                    onChange={e => set_tabung_bank(e.target.value)}
                                    />
                                </div>
                            )
                        }
                        <div className='mt-3'>
                            <Textinput 
                            
                            label={"Nama Tabung"}
                            placeholder='Contoh: Tabung Kutipan Infaq Tahun 2025'
                            defaultValue={tabung_name}
                            disabled={disabled_editing}
                            onChange={e => set_tabung_name(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textarea
                            
                            label={"Keterangan Tabung"}
                            placeholder='Contoh: Tabung ini dibuat khas untuk mengutip kutipan infaq dan derma sempena tahun 2025'
                            dvalue={tabung_description}
                            disabled={disabled_editing}
                            onChange={e => set_tabung_description(e.target.value)}
                            />
                        </div>
                        
                        {/* <div className='mt-3'>
                            <InputGroup 
                            
                            label={"Tabung Permalink"}
                            prepend={`${window.location.origin}/institusi/tabung/`}
                            description={"URL ini boleh digunapakai untuk membenarkan pengguna untuk menyalurkan sumbangan infaq dan waqaf mereka kepada tabung ini."}
                            defaultValue={tabung_permalink}
                            disabled={disabled_editing}
                            onChange={e => set_tabung_permalink(e.target.value)}
                            />
                        </div> */}
                    </div>
                </Card>
            </section>

            {
                !disabled_editing && (
                    <>
                    <section className='mt-3'>
                        <div className='flex justify-end'>
                            <Button className='bg-teal-600 text-white' onClick={() => set_modal(true)}>Kemaskini Maklumat Tabung</Button>
                        </div>
                    </section>
                    </>
                )
            }

            {/* <section className='mt-3'>
                <div className='flex justify-end'>
                    <Button className='bg-teal-600 text-white' onClick={() => set_modal(true)}>Kemaskini Maklumat Tabung</Button>
                </div>
            </section> */}
        </div>
    );
}

export default MaklumatTabung;