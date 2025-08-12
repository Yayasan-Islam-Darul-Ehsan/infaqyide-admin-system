import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { API } from '@/utils/api';

TambahMaklumatPerbankan.propTypes = {
    
};

function TambahMaklumatPerbankan(props) {

    const { user }                  = useSelector(user => user.auth)
    const navigate                  = useNavigate()
    const { width, breakpoints }    = useWidth()

    const [loading, set_loading]    = useState(false)
    const [modal, set_modal]        = useState(false)

    const [bank_id, set_bank_id]                            = useState("")
    const [bank_name, set_bank_name]                        = useState("")
    const [bank_holder_name, set_bank_holder_name]          = useState("")
    const [bank_account_number, set_bank_account_number]    = useState("")

    const [opt_for_bank, set_opt_for_bank] = useState([])

    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const GET__BANK__FPX = async () => {
        set_loading(true)
        let api     = await fetch("https://toyyibpay.com/api/getBank")
        let json    = await api.json()

        json = json.sort((a, b) => a.bank.localeCompare(b.bank));

        let array = []
        if(json.length > 0) {
            for (let i = 0; i < json.length; i++) {
                array.push({
                    label: json[i]["bank"],
                    value: json[i]["id"]
                })
            }
            set_opt_for_bank(array)
        }

        set_loading(false)
    }

    const TAMBAH__PERBANKAN = async () => {
        close_modal()
        if(!bank_name) {
            toast.error("Maklumat nama bank tidak lengkap. Sila lengkapkan maklumat perbankan di bawah.")
        }
        else if(!bank_holder_name) {
            toast.error("Maklumat nama pemegang akaun bank tidak lengkap. Sila lengkapkan maklumat perbankan di bawah.")
        }
        else if(!bank_name) {
            toast.error("Maklumat nombor akaun bank tidak lengkap. Sila lengkapkan maklumat perbankan di bawah.")
        }
        else {

            set_loading(true)
            let json = {
                org_id: user.user ? user.user.id : user.id,
                org_bank_id: bank_id,
                org_bank_name: bank_name,
                org_bank_acc_number: bank_account_number,
                org_acc_holder_name: bank_holder_name,
                org_bank_acc_default: 0
            }

            let api = await API("addBankInstitusi", json)
            console.log("Log Function Create Institusi Bank : ", api)
            set_loading(false)

            if(api.status === 200) {
                toast.success("Maklumat perbankan telah berjaya disimpan.")
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
            else {
                toast.error("Harap maaf! Maklumat perbankan anda tidak berjaya disimpan. Sila pastikan semua maklumat perbankan telah lengkap diisi.")
                toast.error(api.message)
            }
        }
    }

    useEffect(() => {
        GET__BANK__FPX()
    }, [])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            centered={true}
            title='Pengesahan Tambah Maklumat Perbankan'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={TAMBAH__PERBANKAN}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-600'>Anda pasti untuk menambah maklumat perbankan ini?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Perbankan Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai perbankan institusi anda.</p>  
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
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Tambah Perbankan</p>
                        <p className='text-sm font-normal text-gray-600'>Sila lengkapkan maklumat perbankan institusi anda di bawah.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Select 
                            // required
                            label={"Pilihan Bank"}
                            placeholder='Contoh: Maybank2U'
                            defaultValue={bank_name}
                            options={opt_for_bank}
                            onChange={e => {
                                set_bank_id(e.target.value)
                                let bank_name = opt_for_bank.filter(a => a.value === e.target.value)
                                set_bank_name(bank_name[0]["label"])
                            }}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                            // required
                            label={"Nama Pemilik Bank"}
                            placeholder='Contoh: Akaun Bank Masjid Klana 1'
                            defaultValue={bank_holder_name}
                            onChange={e => set_bank_holder_name(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                            // required
                            label={"Nombor Akaun Bank"}
                            placeholder='Contoh: 98192831927143'
                            defaultValue={bank_account_number}
                            onChange={e => set_bank_account_number(e.target.value)}
                            type={"number"}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-3'>
                <div className='flex justify-end items-center'>
                    <Button className='bg-teal-600 text-white' onClick={open_modal}>Tambah Maklumat Perbankan</Button>
                </div>
            </section>
        </div>
    );
}

export default TambahMaklumatPerbankan;