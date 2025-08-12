import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import moment from 'moment';
import InputGroup from '@/components/ui/InputGroup';

MaklumatBankSimpananTetap.propTypes = {
    
};

function MaklumatBankSimpananTetap(props) {

    const state                                             = useLocation().state
    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading, set_loading]                            = useState(false)

    const [bank_name, set_bank_name]                        = useState("")
    const [bank_holder_name, set_bank_holder_name]          = useState("")
    const [bank_account_number, set_bank_account_number]    = useState("")
    const [current_balance, set_current_balance]            = useState(0.00)

    const [list_transaksi, set_list_transaksi]              = useState([])

    const [loading_info, set_loading_info]                  = useState(true)
    const [loading_list, set_loading_list]                  = useState(true)

    const [opt_for_bank, set_opt_for_bank]                  = useState([])

    const [modal, set_modal]                                = useState(false)
    const open_modal                                        = () => set_modal(true)
    const close_modal                                       = () => set_modal(false)

    const [modal2, set_modal2]                              = useState(false)
    const open_modal2                                       = () => set_modal2(true)
    const close_modal2                                      = () => set_modal2(false)

    const [modal3, set_modal3]                              = useState(false)
    const open_modal3                                       = () => set_modal3(true)
    const close_modal3                                      = () => set_modal3(false)

    const [list_trans, set_list_trans]                      = useState([])
    const [currentPage, setCurrentPage]                     = useState(1);
    const [rowsPerPage, setRowsPerPage]                     = useState(10);
    const [totalRows, setTotalRows]                         = useState(0) 
    const totalPages                                        = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                      = useState(0)

    const GET__BANK__INFO = async () => {
        set_loading_info(true)
        let api = await API(`kewangan/bank-simpanan-tetap/senarai-akaun/${state.bbfd_id}`, {}, "GET")
        console.log("Log Function Get Bank Info : ", api)

        if(api.status_code === 200) {
            set_bank_name(api.data.bbfd_account_bank_name)
            set_bank_holder_name(api.data.bbfd_account_holder_name)
            set_bank_account_number(api.data.bbfd_account_number)
            set_current_balance(api.data.bbfd_balance_amount)
        }
        set_loading_info(false)
    }

    const GET__TRANSACTION__BY__BANK = async () => {
        set_loading_list(true)
        let api = await API(`kewangan/bank-simpanan-tetap/senarai-transaksi-bank/${state.bbfd_id}?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET")
        console.log("Log Get List Transaction : ", api)

        if(api.status_code === 200) {
            set_list_transaksi(api.data.row)
            set_total_data(api.data.total)
            setTotalRows(api.data.total)
        }

        set_loading_list(false)
    }

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

    const UPDATE__FIXED__DEPOSIT__BANK = async () => {
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
                bank_id: state.bbfd_id,
                bank_name: bank_name,
                bank_holder_name: bank_holder_name,
                bank_account_number: bank_account_number,
                bank_balance: parseFloat(current_balance)
            }

            let api = await API("kewangan/bank-simpanan-tetap/kemaskini-akaun", json, "POST", true)
            console.log("Log Api Update Bank Simpanan Tetap : ", api)

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

    const DELETE__FIXED__DEPOSIT__BANK = async () => {
        close_modal2()
        set_loading(true)

        let json = {
            bank_id: state.bbfd_id,
            bank_name: bank_name,
            bank_holder_name: bank_holder_name,
            bank_account_number: bank_account_number
        }

        let api = await API("kewangan/bank-simpanan-tetap/padam-akaun", json, "POST", true)
        console.log("Log Api Delete Bank Simpanan Tetap : ", api)

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

    useEffect(() => {
        GET__BANK__INFO()
        GET__TRANSACTION__BY__BANK()
        GET__BANK__FPX()
    }, [])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Mengemaskini Maklumat Akaun Bank Simpanan Tetap'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={UPDATE__FIXED__DEPOSIT__BANK}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-600'>Anda pasti untuk mengemaskini maklumat akaun bank simpanan tetap ini?</p>
            </Modal>

            <Modal
            title='Pengesahan Memadam Maklumat Akaun Bank Simpanan Tetap'
            themeClass='bg-red-600 text-white'
            activeModal={modal2}
            centered={true}
            onClose={close_modal2}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal2}>Tidak</Button>
                    <Button className='bg-red-600 text-white' onClick={DELETE__FIXED__DEPOSIT__BANK}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-600'>Anda pasti untuk memadam maklumat akaun bank simpanan tetap ini? Peringatan! Akaun bank yang sudah dipadam tidak boleh dikembalikan semula.</p>
            </Modal>

            <Modal
            title='Pengesahan Menambah Rekod Transaksi Bank Simpanan Tetap'
            themeClass='bg-teal-600 text-white'
            activeModal={modal3}
            centered={true}
            onClose={close_modal3}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal3}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={UPDATE__FIXED__DEPOSIT__BANK}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-600'>Anda pasti untuk menambah rekod transaksi akaun bank simpanan tetap?.</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Bank Simpanan Tetap - {state.bbfd_account_holder_name}</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai bank simpanan tetap dan juga senarai transaksi akaun bank anda.</p>  
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
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Terperinci Bank Simpanan Tetap</p>
                        <p className='font-normal text-gray-600 text-sm'>Berikut adalah maklumat terperinci berkaitan dengan maklumat bank simpanan tetap anda.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Select 
                            label={'Nama Bank'}
                            placeholder='Contoh: Maybank2U'
                            defaultValue={bank_name}
                            options={opt_for_bank}
                            onChange={e => set_bank_name(e.target.value)}
                            
                            />
                        </div>
                        <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=''>
                                <Textinput 
                                label={'Nama Pemegang Bank'}
                                placeholder='Contoh: Tarmizi Bin Daud'
                                defaultValue={bank_holder_name}
                                onChange={e => set_bank_holder_name(e.target.value)}
                                
                                />
                            </div>
                            <div className=''>
                                <Textinput 
                                label={'Nombor Akaun Bank'}
                                placeholder='Contoh: 155012919823'
                                defaultValue={bank_account_number}
                                onChange={e => set_bank_account_number(e.target.value)}
                                type={"number"}
                                pattern="^[0-9]" 
                                inputmode="numeric"
                                
                                />
                            </div>
                        </div>
                        <div className='mt-3'>
                            <InputGroup
                            prepend={"RM"} 
                            label={'Baki Terkini Bank'}
                            placeholder='Contoh: RM1,000.00'
                            defaultValue={parseFloat(current_balance).toFixed(2)}
                            onChange={e => set_current_balance(e.target.value)}
                            type={"number"}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                            
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-3'>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='bg-red-600 text-white' onClick={open_modal2}>Padam Akaun Bank</Button>
                    <Button className='bg-emerald-600 text-white' onClick={open_modal}>Kemaskini Maklumat Bank</Button>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='font-semibold text-gray-900 text-lg'>Senarai Transaksi Bank Simpanan Tetap</p>
                            <p className='font-normal text-gray-600 text-sm'>Berikut adalah senarai transaksi bank simpanan tetap anda.</p>
                        </div>
                        {/* <div>
                            <Button className='bg-teal-600 text-white' onClick={() => navigate("/kewangan/tambah-transaksi-simpanan-tetap", { state: state })}>Tambah Transaksi</Button>
                        </div> */}
                    </div>
                    <div className='mt-6'>
                        {
                            loading_list && (
                                <>
                                <div className='flex justify-center items-center'>
                                    <Spinner />
                                </div>
                                </>
                            )
                        }

                        {
                            loading_list === false && list_transaksi.length < 1 && (
                                <>
                                <div className='mt-6 flex justify-center items-center'>
                                    <p className='font-normal text-gray-600 text-sm'>Anda tidak mempunyai transaksi bank simpanan tetap buat masa ini.</p>
                                </div>
                                </>
                            )
                        }

                        {
                            loading_list === false && list_transaksi.length > 0 && (
                                <>
                                <div>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div>
                                            <p className='text-gray-500 text-sm'>Papar {list_transaksi.length} per {total_data} rekod.</p>
                                        </div>
                                        <div>
                                            <Pagination
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                handlePageChange={(val) => {
                                                    setCurrentPage(val)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Select 
                                            placeholder='-- Jumlah Rekod --'
                                            defaultValue={rowsPerPage}
                                            options={[
                                                { label: 5, value: 5},
                                                { label: 10, value: 10},
                                                { label: 20, value: 20},
                                                { label: 50, value: 50},
                                                { label: 100, value: 100}
                                            ]}
                                            onChange={(e) => {
                                                setRowsPerPage(e.target.value)
                                            }}
                                            />
                                        </div>
                                    </div>
                                    <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                        <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                            <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Amaun Transaksi (RM)</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis Transaksi</td>
                                            {/* <td width={'10%'} className='p-3 font-semibold text-sm'>Mod Transaksi</td> */}
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh & Masa</td>
                                            {/* <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td> */}
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                list_transaksi.length > 0 && list_transaksi.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.rtfd_title}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{parseFloat(data.rtfd_amount).toFixed(2)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.rtlookup_name}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.rtlookup_type}</p>
                                                        </td>
                                                        {/* <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.rtfd_debit_credit}</p>
                                                        </td> */}
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{moment(data.rtfd_transaction_date).format("DD MMM YYYY, hh:mm A")}</p>
                                                        </td>
                                                        {/* <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.rtfd_status}</p>
                                                        </td> */}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                </>
                            )
                        }
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default MaklumatBankSimpananTetap;