import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Loading from '@/components/Loading';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import moment from 'moment';

MaklumatAJK.propTypes = {
    
};

function MaklumatAJK(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const state                                             = useLocation().state
    const { width, breakpoints }                        = useWidth()

    const [jawatan_ajk, set_jawatan_ajk]                = useState("")
    const [nama_ajk, set_nama_ajk]                      = useState("")
    const [emel_ajk, set_email_ajk]                     = useState("")
    const [phone_ajk, set_phone_ajk]                    = useState("")
    const [create_date, set_create_date]                  = useState(new Date(moment()))

    const [modal, set_modal]                                = useState(false)
    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const [loading, set_loading]                        = useState(true)
    const [opt_for_title, set_opt_for_title]            = useState([])

    const [disabled_editing, set_disable_editing]       = useState(true)
    
 
    const GET__LIST__AJK__TITLE = async () => {
        set_loading(true)
        let api = await API("reference?title=Sub+User", {}, "GET")
        console.log("Log Api Get Reference : ", api)

        if(api.status === 200 && api.data.length > 0) {
            let data    = api.data
            let array   = []
            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: data[i]["ref_name"],
                    value: data[i]["ref_name"]
                })
            }
            set_opt_for_title(array)
        }
        set_loading(false)
    }

    const GET__AJK = async () => {
        set_loading(true)
        let api = await API(`getAJKDetails?ajkId=${state.subUserId}`, {}, "GET")
        console.log("Log Get AJK Details : ", api)

        if(api.status === 200) {

            let data = api.data[0]

            set_nama_ajk(data.username)
            set_jawatan_ajk(data.role)
            set_email_ajk(data.email)
            set_phone_ajk(data.phone)
            set_create_date(new Date(data.createdDate))
        }

        set_loading(false)
    }

    const UPDATE_AJK = async () => {

        close_modal()

        let json = {
            ajkId: state.subUserId,
            username: nama_ajk,
            role: jawatan_ajk,
            email: emel_ajk,
            phone: phone_ajk,
            createdDate: create_date,
        }
        console.log("Payload sent to updateAJK API: ", json);

        let api = await API(`updateAJK`, json)
        console.log("Log Api Update Institusi : ", api)

        if(api.status_code === 200 || api.status === 200) {
            toast.success("Maklumat AJK telah berjaya dikemasini.")
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } else {
            toast.error(api.message)
        }
    }
    

    useEffect(() => {
        GET__LIST__AJK__TITLE()
        GET__AJK()
    }, [])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
                title='Pengesahan Mengemaskini AJK Institusi'
                themeClass='bg-teal-600 text-white'
                activeModal={modal}
                centered={true}
                onClose={close_modal}
                footerContent={(
                    <>
                    <div>
                        <Button className='' onClick={close_modal}>Tutup</Button>
                        <Button className='bg-success-600 text-white' onClick={() => {
                            close_modal()
                            UPDATE_AJK()
                        }}>Kemaskini Maklumat AJK</Button>
                    </div>
                    </>
                )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk mengemaskini maklumat AJK di bawah? Jika sudah pasti, klik butang kemaskini di bawah.</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Ahli AJK Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai pendaftaran ahli jawatankuasa untuk institusi anda.</p>  
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
                    {/* <div>
                        <p className='font-semibold text-lg text-gray-600'>Peringatan!</p>
                    </div> */}
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
                        <p className='font-semibold text-lg text-gray-900'>Maklumat Ahli AJK </p>
                        <p className='font-normal text-sm text-gray-600'>Informasi mengenai ahli AJK yang akan disimpan.</p>
                    </div>
                    <div className='mt-6'>
                        {
                            opt_for_title.length > 0 && jawatan_ajk && (
                            <div>
                                <Select 
                                
                                label={"Kategori Jawatan"}
                                placeholder='Contoh: Pengurusi AJK Masjid'
                                description={"Sila pilih jawatan untuk ahli jawatankuasa institusi anda."}
                                options={opt_for_title}
                                defaultValue={jawatan_ajk}
                                disabled={disabled_editing}
                                onChange={e => set_jawatan_ajk(e.target.value)}
                                />
                            </div>
                            )
                        }
                        <div className='mt-6'>
                            <Textinput 
                            
                            label={"Nama Ahli Jawatankuasa"}
                            placeholder='Contoh: Muhd Akmar Bin Muhd Khilmie'
                            defaultValue={nama_ajk}
                            disabled={disabled_editing}
                            onChange={e => set_nama_ajk(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                            label={"E-mel Ahli Jawatankuasa"}
                            
                            placeholder='Contoh: akmarkhlimie@email.com'
                            defaultValue={emel_ajk}
                            disabled={disabled_editing}
                            onChange={e => set_email_ajk(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                            name={"Phone"}
                            isMask={true}
                            register={() => {}}
                            
                            label={"No. Telefon Ahli Jawatankuasa"}
                            placeholder='Contoh: 0123456789'
                            defaultValue={phone_ajk}
                            disabled={disabled_editing}
                            onChange={e => set_phone_ajk(e.target.value)}
                            type={'number'}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                            maxLength={12}
                            max={12}
                            isNumberOnly
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {
                !disabled_editing && (
                    <>
                    <section className='mt-6'>
                        <div className='flex justify-end items-center'>
                            <Button className='bg-teal-600 text-white' onClick={open_modal}>Kemaskini Maklumat AJK</Button>
                        </div>
                    </section>
                    </>
                )
            }
        </div>
    );
}

export default MaklumatAJK;