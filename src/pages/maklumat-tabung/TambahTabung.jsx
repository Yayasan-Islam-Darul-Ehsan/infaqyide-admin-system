import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import { API } from '@/utils/api';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

TambahTabung.propTypes = {
    
};

function TambahTabung(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading_page, set_loading_page]              = useState(true)
    const [loading, set_loading]                        = useState(false)
    const [tabung_type, set_tabung_type]                = useState("")
    const [tabung_bank, set_tabung_bank]                = useState("")
    const [tabung_name, set_tabung_name]                = useState("")
    const [tabung_description, set_tabung_description]  = useState("")
    const [tabung_permalink, set_tabung_permalink]      = useState("")
    const [tabung_status, set_tabung_status]            = useState("Aktif")

    const [opt_for_bank, set_opt_for_bank]              = useState([])

    const [modal, set_modal]                            = useState(false)
    const open_modal                                    = () => set_modal(true)
    const close_modal                                   = () => set_modal(false)

    const GET__LIST__BANK = async () => {
        set_loading_page(true)
        let api = await API("getBankInstitusi", { org_id: user.user ? user.user.id : user.id })
        console.log("Log Get List Bank : ", api)

        if(api.status === 200) {
            if(api.data.length > 0) {

                let data    = api.data
                let array   = []

                for (let i = 0; i < data.length; i++) {
                    array.push({
                        label: data[i]["org_bank_acc_name"] + " - (" + data[i]["org_bank_acc_id"] + ")",
                        value: data[i]["org_bank_acc_id"]
                    })
                }

                set_opt_for_bank(array)
            }
        }

        set_loading_page(false)
    }

    const CREATE__TABUNG = async () => {
        close_modal()

        if(!tabung_type) {
            toast.error("Sila lengkapkan maklumat jenis tabung anda.")
        }
        else if(!tabung_bank) {
            toast.error("Sila lengkapkan maklumat bank untuk tabung anda.")
        }
        else if(!tabung_name) {
            toast.error("Sila lengkapkan maklumat nama tabung anda.")
        }
        else if(!tabung_description) {
            toast.error("Sila lengkapkan maklumat keterangan tabung anda.")
        }
        else if(!tabung_permalink) {
            toast.error("Sila lengkapkan maklumat permalink tabung anda.")
        }
        else {
            set_loading_page(true)
            let json = {
                org_id: user.user ? user.user.id : user.id,
                tabung_name: tabung_name,
                tabung_type: tabung_type,
                tabung_desc: tabung_description,
                tabung_permalink: tabung_permalink,
                tabung_bankacc: tabung_bank,
                tabung_status: 1
            }

            let api = await API("insertTabung", json)
            console.log("Log Create Tabung : ", api)

            if(api.status === 200) {
                toast.success("Tabung anda telah berjaya disimpan.")
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
            else {
                toast.error(api.message)
            }
        }
    }

    useEffect(() => {
        GET__LIST__BANK()
    }, [])

    if(loading || loading_page ) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Menambah Rekod Tabung'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-success-600 text-white' onClick={() => {
                        close_modal()
                        CREATE__TABUNG()
                    }}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk menambah rekod tabung dengan maklumat di bawah?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Tabung Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Lengkapkan maklumat tabung anda di bawah dah pastikan semua maklumat adalah tepat dan benar.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                    <div>
                        <p className='font-semibold text-base text-yellow-600'>Peringatan!</p>
                    </div>
                    <div className='mt-3'>
                        <ul className=''>
                            <li className='text-sm text-gray-600'>Semua medan dibawah adalah wajib diisi.</li>
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
                            // required
                            label={"Jenis Tabung"}
                            placeholder='Contoh: Infaq'
                            description={"Jenis tabung adalah kategori tabung yang telah dibahagikan kepada 3 jenis iaitu tabung infaq, tabung waqaf dan tabung kempen."}
                            defaultValue={tabung_type}
                            options={[
                                {label: 'Infaq', value: 'Infaq'},
                                {label: 'Waqaf', value: 'Wakaf'},
                                {label: 'Kempen', value: 'Kempen'},
                            ]}
                            onChange={e => set_tabung_type(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Select 
                            // required
                            label={"Pilih Akaun Bank"}
                            placeholder='Contoh: Maybank2U'
                            description={'Sila pilih bank yang telah anda daftarkan. Jika tiada, sila tambah rekod bank anda terlebih dahulu.'}
                            defaultValue={tabung_bank}
                            options={opt_for_bank}
                            onChange={e => set_tabung_bank(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                            // required
                            label={"Nama Tabung"}
                            placeholder='Contoh: Tabung Kutipan Infaq Tahun 2025'
                            defaultValue={tabung_name}
                            onChange={e => set_tabung_name(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textarea
                            // required
                            label={"Keterangan Tabung"}
                            placeholder='Contoh: Tabung ini dibuat khas untuk mengutip kutipan infaq dan derma sempena tahun 2025.'
                            dvalue={tabung_description}
                            onChange={e => set_tabung_description(e.target.value)}
                            />
                        </div>
                        {/* <div className='mt-3'>
                            <InputGroup 
                            classGroup='lowercase'
                            className='lowercase'
                            classLabel='lowercase'
                            // required
                            label={"Tabung Permalink"}
                            prepend={`${window.location.origin}/institusi/tabung/`}
                            description={"URL ini boleh digunapakai untuk membenarkan pengguna untuk menyalurkan sumbangan infaq dan waqaf mereka kepada tabung ini."}
                            defaultValue={tabung_permalink}
                            onChange={e => set_tabung_permalink(e.target.value)}
                            />
                        </div> */}
                    </div>
                </Card>
            </section>

            <section className='mt-3'>
                <div className='flex justify-end'>
                    <Button className='bg-teal-600 text-white' onClick={open_modal}>Tambah Tabung Institusi</Button>
                </div>
            </section>
        </div>
    );
}

export default TambahTabung;