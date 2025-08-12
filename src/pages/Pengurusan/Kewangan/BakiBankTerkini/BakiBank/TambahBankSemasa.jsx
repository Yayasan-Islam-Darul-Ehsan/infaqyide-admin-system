import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { API } from '@/utils/api';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

TambahBankSemasa.propTypes = {
    
};

function TambahBankSemasa(props) {

    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading, set_loading]                            = useState(true)

    const [bank_name, set_bank_name]                        = useState("")
    const [bank_holder_name, set_bank_holder_name]          = useState("")
    const [bank_account_number, set_bank_account_number]    = useState("")
    const [current_balance, set_current_balance]            = useState(0.00)

    const [opt_for_bank, set_opt_for_bank]                  = useState([])

    const [modal, set_modal]                                = useState(false)

    const open_modal                                        = () => set_modal(true)
    const close_modal                                       = () => set_modal(false)

    const GET__BANK__FPX = async () => {
        set_loading(true)
        let api     = await fetch("https://toyyibpay.com/api/getBankFPX")
        let json    = await api.json()

        let array   = []
        if(json.length > 0) {
            for (let i = 0; i < json.length; i++) {
                array.push({
                    label: json[i]["NAME"],
                    value: json[i]["NAME"]
                })                
            }
        }

        set_opt_for_bank(array)
        set_loading(false)
    }

    const CREATE__CURRENT__BANK = async () => {
        close_modal()
        if(!bank_name || bank_name === "" || bank_name === undefined || bank_name === null) {
            toast.error("Maklumat nama bank tidak lengkap. Sila lengkapkan maklumat yang diperlukan di bawah.")
        }
        else if(!bank_name || bank_name === "" || bank_name === undefined || bank_name === null) {
            toast.error("Maklumat nama bank tidak lengkap. Sila lengkapkan maklumat yang diperlukan di bawah.")
        }
        else if(!bank_name || bank_name === "" || bank_name === undefined || bank_name === null) {
            toast.error("Maklumat nama bank tidak lengkap. Sila lengkapkan maklumat yang diperlukan di bawah.")
        }
        else {

            set_loading(true)
            let json = {
                bank_name: bank_name,
                bank_holder_name: bank_holder_name,
                bank_account_number: bank_account_number,
                bank_balance: current_balance ?? 0.00
            }

            let api = await API("kewangan/bank-semasa/tambah-akaun", json, "POST", true)
            console.log("Log Api Tambah Bank Semasa : ", api)

            set_loading(false)

            if(api.status_code === 200) {
                toast.success(api.message)
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
        GET__BANK__FPX()
    }, [])

    if(loading) return <Loading />

    return (
        <div>
            <Modal
            title='Pengesahan Tambah Akaun Bank Semasa'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={CREATE__CURRENT__BANK}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-600'>Anda pasti untuk tambah rekod maklumat akaun bank semasa?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Akaun Bank Semasa</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat akaun bank semasa anda di bawah. Sila pastikan maklumat di bawah adalah tepat dan benar.</p>  
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
                        <p className='font-semibold text-gray-900 text-lg'>Borang Akaun Bank Semasa</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat bank semasa anda di bawah.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Select 
                            label={'Nama Bank'}
                            placeholder='Contoh: Maybank2U'
                            defaultValue={bank_name}
                            options={opt_for_bank}
                            onChange={e => set_bank_name(e.target.value)}
                            // required
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                            label={'Nama Pemegang Bank'}
                            placeholder='Contoh: Tarmizi Bin Daud'
                            defaultValue={bank_holder_name}
                            onChange={e => set_bank_holder_name(e.target.value)}
                            // required
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                            label={'Nombor Akaun Bank'}
                            placeholder='Contoh: 155012919823'
                            defaultValue={bank_account_number}
                            onChange={e => set_bank_account_number(e.target.value)}
                            type={"number"}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                            // required
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                            label={'Baki Terkini Bank'}
                            placeholder='Contoh: RM1,000.00'
                            defaultValue={current_balance}
                            onChange={e => set_current_balance(e.target.value)}
                            type={"number"}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                            // required
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-3'>
                <div className='flex justify-end items-center'>
                    <Button className='bg-teal-600 text-white' onClick={open_modal}>Tambah Bank Semasa</Button>
                </div>
            </section>
        </div>
    );
}

export default TambahBankSemasa;