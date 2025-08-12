import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import { API } from '@/utils/api';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Loading from '@/components/Loading';
import Flatpickr from "react-flatpickr";
import Textarea from '@/components/ui/Textarea';
import { toast } from 'react-toastify';
import moment from 'moment';

TambahTransaksiBankSemasa.propTypes = {
    
};

function TambahTransaksiBankSemasa(props) {

    const navigate = useNavigate()
    const state                                                                 = useLocation().state
    const { width, breakpoints }                                                = useWidth()

    const [bank_id, set_bank_id]                                                = useState(state.bbca_id)
    const [trans_name, set_trans_name]                                          = useState("")
    const [trans_description, set_trans_description]                            = useState("")
    const [trans_category, set_trans_category]                                  = useState("")
    const [trans_mode, set_trans_mode]                                          = useState("")
    const [trans_amount, set_trans_amount]                                      = useState(0.00)
    const [trans_ref_no, set_trans_ref_no]                                      = useState("")
    const [trans_pay_method, set_trans_pay_method]                              = useState("")
    const [trans_date, set_trans_date]                                          = useState(new Date())

    const [opt_for_category, set_opt_for_category]                              = useState([])

    const [loading_pwr_account, set_loading_pwr_account]                        = useState(true)

    const [modal_1, set_modal_1]                                                = useState(false)
    const open_modal_1                                                          = () => set_modal_1(true)
    const close_modal_1                                                         = () => set_modal_1(false)

    const [opt_akaun, set_opt_for_akaun]                                        = useState([])
    const [opt_for_mode, set_opt_for_mode]                                      = useState([{label: 'Penerimaan', value: 'Debit'}, {label: 'Pengeluaran', value: 'Credit'}])
    const [opt_for_pay_method, set_opt_for_pay_method]                          = useState([{label: 'Cash', value: 'Cash'}, {label: 'Online Banking', value: 'Online Banking'}, {label: 'Debit & Credit Card', value: 'Debit & Credit Card'}, {label: 'Cheque', value: 'Cheque'}])
    const [opt_for_kategori_perolehan, set_opt_for_kategori_perolehan]          = useState([])
    const [opt_for_kategori_perbelanjaan, set_opt_for_kategori_perbelanjaan]    = useState([])

    const GET__PWR__ACCOUNT = async () => {
        set_loading_pwr_account(true)
        let api = await API("kewangan/bank-semasa/senarai-akaun", {}, "GET", true)
        if(api.status_code === 200) {

            let array   = []
            let account = api.data.row
            if(account.length > 0) {
                for (let i = 0; i < account.length; i++) {
                    array.push({
                        label: account[i]["bbca_account_bank_name"] + " - " + account[i]["bbca_account_holder_name"] + ` (${account[i]["bbca_account_number"]})`,
                        value: account[i]["bbca_id"]
                    })   
                }
            }

            console.log("List Akaun : ", array)
            set_opt_for_akaun(array)
        }
        set_loading_pwr_account(false)
    }

    const GET__KATEGORI__PEROLEHAN = async () => {
        set_loading_pwr_account(true)    
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
        set_loading_pwr_account(false) 
    }

    const GET__KATEGORI__PERBELANJAAN = async () => {
        set_loading_pwr_account(true)
        let api = await API("kewangan/kategori-kewangan?type=Perbelanjaan", {}, "GET", true)
        if(api.status_code === 200) {
            let array   = []
            let data    = api.data
            if(data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    array.push({ label: data[i]["rtlookup_name"], value: data[i]["rtlookup_id"]})
                }
            }
            set_opt_for_kategori_perbelanjaan(array)
        }
        set_loading_pwr_account(false)
    }

    const CREATE__TRANSACTION = async () => {
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

            set_loading_pwr_account(true)

            let json = {
                trans_name: trans_name,
                trans_description: trans_description,
                trans_amount: parseFloat(trans_amount),
                trans_category: trans_category,
                trans_mode: trans_mode,
                trans_date: moment(trans_date[0]).format("YYYY-MM-DD hh:mm:ss"),
                trans_pay_method: trans_pay_method,
                trans_ref_no: trans_ref_no
            }

            let api = await API(`kewangan/bank-semasa/tambah-transaksi-bank/${bank_id}`, json)
            console.log("Log API Create Fixed Bank Record Transaction : ", api)

            set_loading_pwr_account(false)

            if(api.status_code === 200) {
                toast.success("Maklumat rekod transaksi akaun bank simpanan semasa anda telah berjaya dikemaskini.")    
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
        GET__PWR__ACCOUNT()
        GET__KATEGORI__PEROLEHAN()
        GET__KATEGORI__PERBELANJAAN()
    }, [])

    if(loading_pwr_account) return <Loading />

    return (
        <div>

            <Modal
            title='Maklumat Tambah Transaksi Bank Semasa'
            themeClass='bg-teal-600 text-white'
            activeModal={modal_1}
            centered={true}
            onClose={close_modal_1}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal_1}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={CREATE__TRANSACTION}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-600'>Anda pasti untuk menambah rekod transaksi akaun bank semasa ini?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Transaksi Akaun Bank Simpanan Semasa</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat akaun bank simpanan semasa anda di bawah. Sila pastikan maklumat di bawah adalah tepat dan benar.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Akaun Bank Simpanan Semasa</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat akaun bank simpanan semasa anda di bawah.</p>
                    </div>
                    <div className='mt-3'>
                        <div className='grid grild-cols-1 md:grid-cols-2 gap-3'>
                            <div>
                                <Select 
                                label={'Akaun Bank Simpanan Semasa'}
                                placeholder='Contoh: Akaun Maybank 1'
                                defaultValue={bank_id}
                                onChange={e => set_bank_id(e.target.value)}
                                options={opt_akaun}
                                disabled={true}
                                required
                                />
                            </div>
                            <div>
                                <Select 
                                label={'Jenis Transaksi'}
                                placeholder='Contoh: Pengeluaran atau Penerimaan'
                                defaultValue={trans_mode}
                                onChange={e => set_trans_mode(e.target.value)}
                                options={opt_for_mode}
                                required
                                />
                            </div>
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
                                    <p className='font-semibold text-gray-900 text-lg'>Transaksi Akaun Bank Simpanan Semasa</p>
                                    <p className='font-normal text-gray-600 text-sm'>Berikut adalah maklumat bank simpanan semasa anda di bawah.</p>
                                </div>
                                <div className='mt-3'>
                                    <div className='grid grild-cols-1 md:grid-cols-2 gap-3'>
                                        <div>
                                            {
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
                                            }
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
                                            required
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Textinput 
                                        label={'Nama Transaksi'}
                                        placeholder='Contoh: Penerimaan Dana Daripada Majlis Agama Islan Negeri'
                                        defaultValue={trans_name}
                                        onChange={e => set_trans_name(e.target.value)}
                                        required
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Textarea 
                                        label={'Keterangan Transaksi'}
                                        placeholder='Contoh: Keterangan Maklumat Mengenai Penerimaan Dana Daripada Majlis Agama Islan Negeri Sebanyak RM10,000.00'
                                        dvalue={trans_description}
                                        onChange={e => set_trans_description(e.target.value)}
                                        required
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <label htmlFor="" className='form-label'>Tarikh & Masa Transaksi</label>
                                        <Flatpickr
                                        value={trans_date}
                                        data-enable-time
                                        id="date-time-picker"
                                        className="form-control py-2"
                                        onChange={(date) => set_trans_date(date)}
                                        required
                                        style={{ background: "white" }}
                                        />
                                    </div>
                                    <div className='mt-3 grid grild-cols-1 md:grid-cols-1 gap-3'>
                                        <Select 
                                        label={`Kaedah Bayaran ${trans_mode === "Debit" ? 'Penerimaan' : 'Pengeluaran'}`}
                                        placeholder='Contoh: Cash'
                                        defaultValue={trans_pay_method}
                                        onChange={e => set_trans_pay_method(e.target.value)}
                                        options={opt_for_pay_method}
                                        required
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
                                <Button className='bg-teal-600 text-white' onClick={open_modal_1}>Tambah Transaksi</Button>
                            </div>
                        </section> 
                    </div>
                    </>
                )
            }
        </div>
    );
}

export default TambahTransaksiBankSemasa;