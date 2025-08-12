import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Pane } from 'evergreen-ui';
import { toast } from 'react-toastify';

TambahNilai.propTypes = {
    
};

function TambahNilai(props) {

    const state                                         = useLocation().state
    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading_page, set_loading_page]              = useState(true)
    const [loading, set_loading]                        = useState(true)
    const [tabung_id, set_tabung_id]                    = useState(state.tabung_id)
    const [tabung_type, set_tabung_type]                = useState("")
    const [tabung_bank, set_tabung_bank]                = useState("")
    const [tabung_name, set_tabung_name]                = useState("")
    const [tabung_description, set_tabung_description]  = useState("")
    const [tabung_permalink, set_tabung_permalink]      = useState("")
    const [tabung_status, set_tabung_status]            = useState("Aktif")

    const [pay_amount, set_pay_amount]                  = useState(0.00)
    const [payor_name, set_payor_name]                  = useState("")
    const [payor_email, set_payor_email]                = useState("")
    const [payor_phone, set_payor_phone]                = useState("")
    const [pay_method, set_pay_method]                  = useState("")
    const [pay_bank, set_pay_bank]                      = useState("")

    const [opt_list_bank, set_opt_list_bank]            = useState([])
    const option_for_payment_channel = [
        {label: 'Online Banking (FPX)', value: 'Online Banking'}
    ]

    const GET__BANK__FPX = async () => {
        set_loading(true)

        let api     = await fetch("https://toyyibpay.com/api/getBankFPX")
        let bank    = await api.json()

        let array = []

        if(bank.length > 0) {
            for (let i = 0; i < bank.length; i++) {
                array.push({
                    label: bank[i]["NAME"],
                    value: bank[i]["CODE"]
                })   
            }
            set_opt_list_bank(array)
        }
        set_loading(false)
    }

    const CREATE__PAYMENT = async () => {

        if(!pay_method) {
            toast.error("Sila buat pilihan kaedah bayaran terlebih dahulu")
        }
        else if(!pay_bank) {
            toast.error("Sila buat pilihan bank anda terlebih dahulu")
        }
        else if(parseFloat(pay_amount) === 0.00) {
            toast.error("Amaun tambah nilai tidah boleh RM0.00")
        }
        else if(parseFloat(pay_amount) < 30) {
            toast.error("Amaun tambah nilai tidah boleh kurang daripada RM30.00")
        }
        else if(parseFloat(pay_amount) > 30000) {
            toast.error("Amaun tambah nilai tidah boleh lebih daripada RM30,000.00")
        }
        else if(!payor_name) {
            toast.error("Maklumat nama pembayar tidak lengkap")
        }
        else if(!payor_email) {
            toast.error("Maklumat E-mel pembayar tidak lengkap")
        }
        else if(!payor_phone) {
            toast.error("Maklumat nombor telefon pembayar tidak lengkap")
        }
        else {

            set_loading(true)

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "organizationId": user.id,
                "tabungId": state.tabung_id,
                "billAmount": parseFloat(pay_amount),
                "billPaymentChannel": pay_method  
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            await fetch(process.env.NODE_ENV === "production" ? "https://api.al-jariyah.com/admin/tambah-nilai" : "https://demo-api.al-jariyah.com/admin/tambah-nilai", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                set_loading(false)
                console.log(result)

                if(result.status_code === 200) {
                    setTimeout(() => {
                       // window.location.href = result.body.billPaymentUrl
                       window.open(result.body.billPaymentUrl, 'blank')
                    }, 500);
                } else {
                    toast.error(result.message)
                }

            })
            .catch((error) => {
                set_loading(false)
                console.error(error)
                toast.error(error)
            });
        }
    }

    useEffect(() => {
        GET__BANK__FPX()
    }, [])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Nilai Tabung</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat pembayaran tambah nilai di bawah dan pilih kaedah bayaran tambah nilai anda..</p>  
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

            {/* <section className='mt-6'>
                <Card>
                    <div>
                        <pre>{JSON.stringify(state, undefined, 4)}</pre>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <pre>{JSON.stringify(user, undefined, 4)}</pre>
                    </div>
                </Card>
            </section> */}

            <section className='mt-6'>
                <Card>
                    <div className='mb-6'>
                        <Textinput 
                            label={"Nama Institusi"}
                            defaultValue={user.fullname ?? user.username}
                            disabled={true}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput 
                            label={"Nama Tabung"}
                            defaultValue={state.tabung_name}
                            disabled={true}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput 
                            label={"Nama Pembayar"}
                            placeholder='Contoh: Ahmad Jazali Bin Supardi'
                            defaultValue={payor_name}
                            onChange={e => set_payor_name(e.target.value)}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput 
                            label={"E-mel Pembayar"}
                            placeholder='Contoh: ahmadjazalisupardi@email.com'
                            defaultValue={payor_email}
                            onChange={e => set_payor_email(e.target.value)}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput 
                            label={"No. Telefon Pembayar"}
                            placeholder='Contoh: 0123456789'
                            defaultValue={payor_phone}
                            onChange={e => set_payor_phone(e.target.value)}
                        />
                    </div>
                    <div className='mb-6'>
                        <Textinput 
                            label={"Amaun Tambah Nilai (RM)"}
                            placeholder='Contoh: 30.00'
                            description={"* Had minima tambah nilai adalah RM30.00."}
                            defaultValue={pay_amount}
                            onChange={e => set_pay_amount(e.target.value)}
                            type={"number"}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                        />
                    </div>
                    <div className='mb-6'>
                        <Select 
                            label={"Kaedah Pembayaran"}
                            placeholder='Contoh: Online Banking (FPX)'
                            defaultValue={pay_method}
                            options={option_for_payment_channel}
                            onChange={e => set_pay_method(e.target.value)}
                        />
                    </div>
                    {
                        pay_method === "Online Banking" && (
                            <>
                            <label htmlFor="" className='form-label'>Pilihan Bank</label>
                            <div className='grid grid-cols-4 gap-3'>
                                {
                                    opt_list_bank.map((item, index) => 
                                        pay_bank === item.value ?
                                        (
                                            <Button 
                                            key={index}
                                            onClick={() => set_pay_bank(item.value)}
                                            className={`bg-gray-200 flex flex-col justify-center items-center border border-gray-300 rounded shadow-sm py-3`}>
                                                <img src={`https://toyyibpay.com/asset/img/logobank/${item.value}.png`} className='w-[100px] h-[100px] object-contain' />
                                                <p className='font-semibold mt-3 text-sm text-gray-900'>{item.label}</p>
                                            </Button>
                                        ) : 
                                        (
                                            <Button 
                                            key={index}
                                            onClick={() => set_pay_bank(item.value)}
                                            className={`bg-white flex flex-col justify-center items-center border border-gray-300 rounded shadow-sm py-3`}>
                                                <img src={`https://toyyibpay.com/asset/img/logobank/${item.value}.png`} className='w-[100px] h-[100px] object-contain' />
                                                <p className='font-semibold mt-3 text-sm text-gray-900'>{item.label}</p>
                                            </Button>
                                        )
                                    )
                                }
                            </div>
                            </>
                        )
                    }

                </Card>
            </section>
            <section className='mt-6 flex justify-end items-end'>
                <Button className='bg-teal-600 text-white' onClick={CREATE__PAYMENT}>Tambah Nilai</Button>
            </section>
        </div>
    );
}

export default TambahNilai;