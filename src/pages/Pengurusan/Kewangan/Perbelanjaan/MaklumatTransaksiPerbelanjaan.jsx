import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import moment from 'moment';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Flatpickr from "react-flatpickr";
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';

MaklumatTransaksiPerbelanjaan.propTypes = {
    
};

function MaklumatTransaksiPerbelanjaan(props) {

    const state                                             = useLocation().state
    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading, set_loading]                            = useState(true)
    const [data, set_data]                                  = useState(null)

    const [loading_bank, set_loading_bank]                                      = useState(false)

    const [option_bank_type, set_option_bank_type]                              = useState([{ label: 'Bank Akaun Semasa', value: 'Bank Akaun Semasa' }, { label: 'Bank Simpanan Tetap', value: 'Bank Simpanan Tetap' }])
    const [option_bank, set_option_bank]                                        = useState([])

    const [bank_type, set_bank_type]                                            = useState("")
    const [bank_id, set_bank_id]                                                = useState("")
    const [trans_name, set_trans_name]                                          = useState("")
    const [trans_description, set_trans_description]                            = useState("")
    const [trans_category, set_trans_category]                                  = useState("")
    const [trans_mode, set_trans_mode]                                          = useState("Debit")
    const [trans_amount, set_trans_amount]                                      = useState("")
    const [trans_ref_no, set_trans_ref_no]                                      = useState("")
    const [trans_pay_method, set_trans_pay_method]                              = useState("")
    const [trans_date, set_trans_date]                                          = useState(new Date())

    const [opt_akaun, set_opt_for_akaun]                                        = useState([])
    const [opt_for_mode, set_opt_for_mode]                                      = useState([{label: 'Penerimaan', value: 'Debit'}, {label: 'Pengeluaran', value: 'Credit'}])
    const [opt_for_pay_method, set_opt_for_pay_method]                          = useState([{label: 'Cash', value: 'Cash'}, {label: 'Online Banking', value: 'Online Banking'}, {label: 'Debit & Credit Card', value: 'Debit & Credit Card'}, {label: 'Cheque', value: 'Cheque'}])
    const [opt_for_kategori_perolehan, set_opt_for_kategori_perolehan]          = useState([])
    const [opt_for_kategori_perbelanjaan, set_opt_for_kategori_perbelanjaan]    = useState([])

    const [modal_1, set_modal_1]                                                = useState(false)
    const open_modal_1                                                          = () => set_modal_1(true)
    const close_modal_1                                                         = () => set_modal_1(false)

    const GET__KATEGORI__PEROLEHAN = async () => {
        set_loading(true)    
        let api = await API("kewangan/kategori-kewangan?type=Perolehan", {}, "GET", true)
        if(api.status_code === 200) {
            let array   = []
            let data    = api.data
            if(data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    array.push({ label: data[i]["rtlookup_name"], value: data[i]["rtlookup_id"]})
                }
            }
            set_opt_for_kategori_perolehan(array)
        }
        set_loading(false) 
    }

    const GET__KATEGORI__PERBELANJAAN = async () => {
        set_loading(true)    
        let api = await API("kewangan/kategori-kewangan?type=Perbelanjaan", {}, "GET", true)
        if(api.status_code === 200) {
            let array   = []
            let data    = api.data
            if(data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    array.push({ label: data[i]["rtlookup_name"], value: data[i]["rtlookup_id"]})
                }
            }
            set_opt_for_kategori_perolehan(array)
        }
        set_loading(false) 
    }

    const CALL__BANK__AKAUN__SEMASA = async () => {
        set_loading_bank(true)

        let api = await API(`kewangan/bank-semasa/senarai-akaun?page=1&limit=100`, {}, "GET", true)
        console.log("Log Call Bank Akaun Semasa : ", api)

        if(api.status_code === 200) {
            let array   = []
            let data    = api.data.row

            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: `${data[i]["bbca_account_bank_name"]} - (${data[i]["bbca_account_number"]})`,
                    value: data[i]["bbca_id"]
                })
            }

            set_option_bank(array)
            set_loading_bank(false)
            
        } else {
            set_loading_bank(false)
            toast.error("Harap maaf! Anda tidak mempunyai senarai maklumat akaun bank semasa.")
        }
    }

    const CALL__BANK__SIMPANAN__TETAP = async () => {
        set_loading_bank(true)

        let api = await API(`kewangan/bank-simpanan-tetap/senarai-akaun?page=1&limit=100`, {}, "GET", true)
        console.log("Log Call Bank Simpanan Tetap : ", api)

        if(api.status_code === 200) {
            let array   = []
            let data    = api.data.row

            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: `${data[i]["bbfd_account_bank_name"]} - (${data[i]["bbfd_account_number"]})`,
                    value: data[i]["bbfd_id"]
                })
            }

            set_option_bank(array)
            set_loading_bank(false)
        } else {
            set_loading_bank(false)
            toast.error("Harap maaf! Anda tidak mempunyai senarai maklumat akaun bank semasa.")
        }
    }

    const GET__DATA = async () => {
        set_loading(true)
        let api = await API(`kewangan/senarai-transaksi-perolehan/${state.TRANS_ID}`, { bank_type: state.BANK_TYPE }, "POST")
        console.log("Log Get Maklumat Transaksi : ", api)

        if(api.status_code === 200) {
            set_data(api.data)

            let dataa = api.data

            if(state.BANK_TYPE === "rtfd") {
                set_bank_type("Bank Simpanan Tetap")
                set_bank_id(dataa.bbfd_id)
                set_trans_name(dataa.rtfd_title)
                set_trans_description(dataa.rtfd_description)
                set_trans_category(dataa.rtfd_category)
                set_trans_mode(dataa.rtfd_debit_credit)
                set_trans_amount(dataa.rtfd_amount)
                set_trans_ref_no(dataa.rtfd_reference_number)
                set_trans_pay_method(dataa.rtfd_payment_method)
                set_trans_date(new Date(moment(dataa.rtfd_transaction_date)))

                if(dataa.rtfd_debit_credit === "Debit") {
                    GET__KATEGORI__PEROLEHAN()
                } else {
                    GET__KATEGORI__PERBELANJAAN()
                }

                CALL__BANK__SIMPANAN__TETAP()
            }
            else if(state.BANK_TYPE === "rtca") {
                set_bank_type("Bank Akaun Semasa")
                set_bank_id(dataa.bbca_id)
                set_trans_name(dataa.rtca_title)
                set_trans_description(dataa.rtca_description)
                set_trans_category(dataa.rtca_category)
                set_trans_mode(dataa.rtca_debit_credit)
                set_trans_amount(dataa.rtca_amount)
                set_trans_ref_no(dataa.rtca_reference_number)
                set_trans_pay_method(dataa.rtca_payment_method)
                set_trans_date(new Date(moment(dataa.rtca_transaction_date)))

                if(dataa.rtfd_debit_credit === "Debit") {
                    GET__KATEGORI__PEROLEHAN()
                } else {
                    GET__KATEGORI__PERBELANJAAN()
                }

                CALL__BANK__AKAUN__SEMASA()
            }
        }

        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }

    const UPDATE__TRANSACTION = async () => {
        close_modal_1()

        if(!bank_id || bank_id === "" || bank_id === null) {
            toast.error("Tiada ID akaun panjar wang runcit dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_name || trans_name === "") {
            toast.error("Tiada maklumat nama transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_description || trans_description === "") {
            toast.error("Tiada maklumat keterangan transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_amount || trans_amount === "") {
            toast.error("Tiada maklumat jumlah amaun transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_category || trans_category === "") {
            toast.error("Tiada maklumat kategori transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_mode || trans_mode === "") {
            toast.error("Tiada maklumat mod bayaran transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_pay_method || trans_pay_method === "") {
            toast.error("Tiada maklumat kaedah bayaran transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else if(!trans_date || trans_date === "") {
            toast.error("Tiada maklumat tarikh dan masa bayaran transaksi dijumpai. Sila pastikan maklumat di bawah telah lengkap.")
        }
        else {

            set_loading(true)

            let json = {
                record_id: state.TRANS_ID,
                bank_id: bank_id,
                trans_name: trans_name,
                trans_description: trans_description,
                trans_amount: parseFloat(trans_amount),
                trans_category: trans_category,
                trans_mode: trans_mode,
                trans_date: trans_date.length > 0 ? moment(trans_date[0]).format("YYYY-MM-DD hh:mm:ss") : moment(trans_date).format("YYYY-MM-DD hh:mm:ss"),
                trans_pay_method: trans_pay_method,
                trans_ref_no: trans_ref_no
            }

            let url = bank_type === "Bank Akaun Semasa" ? `kewangan/bank-semasa/kemaskini-transaksi-bank/${bank_id}` : `kewangan/bank-simpanan-tetap/kemaskini-transaksi-bank/${bank_id}`

            let api = await API(url, json)
            console.log("Log API Create Fixed Bank Record Transaction : ", api)

            set_loading(false)

            if(api.status_code === 200) {
                toast.success("Maklumat rekod transaksi akaun bank anda telah berjaya dikemaskini.")    
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
            else {
                toast.error(api.message || api.Error)
            }
        }
    }

    useEffect(() => {
        GET__DATA()
    }, [])
    
    if(loading) return <Loading />

    return (
        <div>
            {/* <section>
                <Card>
                    <pre>
                    {JSON.stringify(state, undefined, 4)}
                    </pre>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <pre>
                    {JSON.stringify(data, undefined, 4)}
                    </pre>
                </Card>
            </section> */}

            <Modal
            title='Pengesahan Menambah Rekod Transaksi Perbelanjaan'
            themeClass='bg-teal-600 text-white'
            activeModal={modal_1}
            centered={true}
            onClose={close_modal_1}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal_1}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={UPDATE__TRANSACTION}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-600'>Anda pasti untuk mengemaskini maklumat transaksi perbelanjaan ini?</p>
            </Modal>

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
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Akaun Bank</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat akaun bank simpanan tetap anda di bawah.</p>
                    </div>
                    <div className='mt-3'>
                        <div className='grid grild-cols-1 md:grid-cols-2 gap-3'>
                            <div>
                                <Select 
                                label={'Jenis Bank'}
                                placeholder='Contoh: Bank Akaun Semasa atau Bank Simpanan Tetap'
                                defaultValue={bank_type}
                                onChange={e => {

                                    set_bank_type(e.target.value)
                                    set_bank_id("")

                                    if(e.target.value === "Bank Akaun Semasa") {
                                        CALL__BANK__AKAUN__SEMASA()
                                    } else {
                                        CALL__BANK__SIMPANAN__TETAP()
                                    }
                                }}
                                options={option_bank_type}
                                
                                />
                            </div>
                            {
                                !loading_bank && (
                                    <div>
                                        <Select 
                                        label={`Akaun ${bank_type}`}
                                        placeholder='Contoh: Akaun Maybank 1'
                                        defaultValue={bank_id}
                                        onChange={e => set_bank_id(e.target.value)}
                                        options={option_bank}
                                        
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Card>
            </section>

            {
                bank_id && trans_mode && (
                    <>
                    <div>
                        <section className='mt-6'>
                            <Card>
                                <div>
                                    <p className='font-semibold text-gray-900 text-lg'>Malkumat Transaksi {bank_type}</p>
                                    <p className='font-normal text-gray-600 text-sm'>Berikut adalah maklumat {bank_type.toLowerCase()} anda di bawah.</p>
                                </div>
                                <div className='mt-3'>
                                    <div className='grid grild-cols-1 md:grid-cols-2 gap-3'>
                                        <div>
                                            {/* {
                                                trans_mode === "Debit" && (
                                                    <>
                                                    <Select 
                                                    label={'Kategori Transaksi'}
                                                    placeholder='Contoh: Penerimaan Dana Majlis Agama Islam Negeri'
                                                    defaultValue={trans_category}
                                                    onChange={e => set_trans_category(e.target.value)}
                                                    options={opt_for_kategori_perolehan}
                                                    required
                                                    />
                                                    </>
                                                )
                                            }
                                            {
                                                trans_mode === "Credit" && (
                                                    <>
                                                    <Select 
                                                    label={'Kategori Transaksi'}
                                                    placeholder='Contoh: Debit atau Kredit'
                                                    defaultValue={trans_category}
                                                    onChange={e => set_trans_category(e.target.value)}
                                                    options={opt_for_kategori_perbelanjaan}
                                                    required
                                                    />
                                                    </>
                                                )
                                            } */}
                                            <Select 
                                                label={'Kategori Transaksi'}
                                                placeholder='Contoh: Penerimaan Dana Majlis Agama Islam Negeri'
                                                defaultValue={trans_category}
                                                onChange={e => set_trans_category(e.target.value)}
                                                options={opt_for_kategori_perolehan}
                                                
                                            />
                                        </div>
                                        <div>
                                            <Textinput 
                                            label={"Amaun Transaksi (RM)"}
                                            placeholder='Contoh: RM 100.00'
                                            defaultValue={trans_amount}
                                            onChange={e => set_trans_amount(e.target.value)}
                                            type={"number"}
                                            pattern="^[0-9]" 
                                            inputmode="numeric"
                                            
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Textinput 
                                        label={'Nama Transaksi'}
                                        placeholder='Contoh: Penerimaan Dana Daripada Majlis Agama Islan Negeri'
                                        defaultValue={trans_name}
                                        onChange={e => set_trans_name(e.target.value)}
                                        
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Textarea 
                                        label={'Keterangan Transaksi'}
                                        placeholder='Contoh: Keterangan Maklumat Mengenai Penerimaan Dana Daripada Majlis Agama Islan Negeri Sebanyak RM10,000.00'
                                        dvalue={trans_description}
                                        onChange={e => set_trans_description(e.target.value)}
                                        
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <label htmlFor="" className='form-label'>Tarikh & Masa Transaksi</label>
                                        <Flatpickr
                                        style={{ backgroundColor: 'white' }}
                                        value={trans_date}
                                        data-enable-time
                                        id="date-time-picker"
                                        className="form-control py-2"
                                        onChange={(date) => set_trans_date(date)}
                                        
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Select 
                                        label={`Kaedah Bayaran ${trans_mode === "Debit" ? 'Penerimaan' : 'Pengeluaran'}`}
                                        placeholder='Contoh: Cash'
                                        defaultValue={trans_pay_method}
                                        onChange={e => set_trans_pay_method(e.target.value)}
                                        options={opt_for_pay_method}
                                        
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Textinput 
                                        label={'No. Rujukan Resit'}
                                        placeholder='Contoh: AJ1092310203912093'
                                        defaultValue={trans_ref_no}
                                        onChange={e => set_trans_ref_no(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </section>
                        <section className='mt-3'>
                            <div className='flex justify-end items-center'>
                                <Button className='bg-teal-600 text-white' onClick={open_modal_1}>Kemaskini Rekod Transaksi</Button>
                            </div>
                        </section> 
                    </div>
                    </>
                )
            }
        </div>
    );
}

export default MaklumatTransaksiPerbelanjaan;