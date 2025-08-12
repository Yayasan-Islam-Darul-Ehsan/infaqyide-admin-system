import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { API } from '@/utils/api';

TukarKataLaluan.propTypes = {
    
};

function TukarKataLaluan(props) {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                = useState(false)
    const [modal, set_modal]                    = useState(false)

    const [username, set_username]              = useState("")
    const [old_password, set_old_password]      = useState("")
    const [new_password, set_new_password]      = useState("")

    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const TUKAR__KATA__LALUAN = async () => {

        close_modal()

        if(!username) {
            toast.error("Sila lengkapkan ruangan nama pengguna anda.")
        }
        else if(!old_password) {
            toast.error("Sila lengkapkan ruangan kata laluan lama anda.")
        }
        else if(!new_password) {
            toast.error("Sila lengkapkan ruangan kata laluan baharu anda.")
        }
        else {

            set_loading(true)

            let json = {
                username: username,
                currentPassword: old_password.trim(),
                newPassword: new_password.trim()
            }

            let api = await API("changePassword", json)
            console.log("Log Api Change Password : ", api)

            set_loading(false)

            if(api.status === 200 || api.status_code === 200) {
                toast.success(api.message)

                setTimeout(() => {
                    window.sessionStorage.clear()
                    window.location.href = "/"
                }, 1000);
                
            } else {
                toast.error(api.message)
            }
        }
    }

    if(loading) return <Loading />

    return (
        <div>
            <Modal
                title='Pengesahan Tukar Kata Laluan'
                themeClass='bg-teal-600'
                activeModal={modal}
                onClose={close_modal}
                centered={true}
                footerContent={(
                    <>
                    <div className='flex gap-3'>
                        <Button className='' onClick={close_modal}>Tutup</Button>
                        <Button className='bg-teal-600 text-white' onClick={TUKAR__KATA__LALUAN}>Teruskan</Button>
                    </div>
                    </>
                )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>Anda pasti untuk menukar kata laluan anda?</p>
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tukar Kata Laluan Baharu</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat kata laluan anda di bawah untuk menukar kata laluan baharu.</p>  
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
                    <div className='mb-6'>
                        <Textinput 
                        // required
                        label={"Nama Pengguna"}
                        placeholder='Contoh: NamaPengguna'
                        defaultValue={username}
                        onChange={e => set_username(e.target.value)}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput 
                        // required
                        label={"Kata Laluan Lama"}
                        placeholder='Contoh: ••••••••'
                        defaultValue={old_password}
                        onChange={e => set_old_password(e.target.value)}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput
                        // required 
                        label={"Kata Laluan Baharu"}
                        placeholder='Contoh: ••••••••'
                        defaultValue={new_password}
                        onChange={e => set_new_password(e.target.value)}
                        />
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <div className='flex justify-end items-center'>
                    <Button className='bg-teal-600 text-white' onClick={open_modal}>Tukar Kata Laluan</Button>
                </div>
            </section>
        </div>
    );
}

export default TukarKataLaluan;