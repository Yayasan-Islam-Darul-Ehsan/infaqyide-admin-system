import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { ArrowDownIcon, ArrowUpIcon, Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import Modal from '@/components/ui/Modal';
import Textinput from '@/components/ui/Textinput';
import { toast } from 'react-toastify';

MaklumatPanjarWangRuncit.propTypes = {
    
};

function MaklumatPanjarWangRuncit(props) {

    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()
    const [loading, set_loading]                            = useState(false)




    const [bank_balance, set_bank_balance]                  = useState(239.70)
    const [transaction, set_transaction]                    = useState([
        {
            transaction_id: 1,
            transaction_invoice: `AJ09019290819287234`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 12.00,
            transaction_status: 'Approve',
            transaction_name: 'Sumbangan Ke Tabung Infaq Am Sebanyak RM 12.00',
            transaction_type: 'Debit'
        },
        {
            transaction_id: 2,
            transaction_invoice: `AJ090192909128812333`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 50.00,
            transaction_status: 'Cancel',
            transaction_name: 'Sumbangan Ke Tabung Infaq Am Sebanyak RM 50.00',
            transaction_type: 'Debit'
        },
        {
            transaction_id: 3,
            transaction_invoice: `AJ090112918289372373`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 120.00,
            transaction_status: 'Approve',
            transaction_name: 'Sumbangan Ke Tabung Infaq Am Sebanyak RM 120.00',
            transaction_type: 'Debit'
        },
        {
            transaction_id: 4,
            transaction_invoice: `AJ090100029392883455`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 100.00,
            transaction_status: 'Approve',
            transaction_name: 'Sumbangan Ke Tabung Infaq Am Sebanyak RM 100.00',
            transaction_type: 'Debit'
        },
        {
            transaction_id: 5,
            transaction_invoice: `AJ0998182877290192490`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 1000.00,
            transaction_status: 'Cancel',
            transaction_name: 'Sumbangan Ke Tabung Infaq Am Sebanyak RM 1000.00',
            transaction_type: 'Debit'
        }
    ])

    const [nama_pwr, set_nama_pwr]                          = useState("")
    const [baki_semasa_pwr, set_baki_semasa_pwr]            = useState(0.00)
    const [has_pwr_account, set_has_pwr_account]            = useState(false)
    const [pwr_id, set_pwr_id]                              = useState(null)

    const [loading_pwr_account, set_loading_pwr_account]    = useState(true)
    const [loading_pwr_trans, set_loading_pwr_trans]        = useState(true)

    const [list_pwr_account, set_list_pwr_account]          = useState(null)
    const [list_pwr_transaction, set_list_pwr_transaction]  = useState([])
    const [root_data, set_root_data]                        = useState([])

    const [currentPage, setCurrentPage]                     = useState(1);
    const [rowsPerPage, setRowsPerPage]                     = useState(10);
    const [totalRows, setTotalRows]                         = useState(0) 
    const [total_data, set_total_data]                      = useState(0)
    const totalPages                                        = Math.ceil(total_data / rowsPerPage);

    const [modal_1, set_modal_1]                            = useState(false)
    const [modal_2, set_modal_2]                            = useState(false)

    const [modal_3, set_modal_3]                            = useState(false)
    const [modal_4, set_modal_4]                            = useState(false)

    const open_modal_1                                      = () => set_modal_1(true)
    const open_modal_2                                      = () => set_modal_2(true)
    const open_modal_3                                      = () => set_modal_3(true)
    const open_modal_4                                      = () => set_modal_4(true)

    const close_modal_1                                     = () => set_modal_1(false)
    const close_modal_2                                     = () => set_modal_2(false)
    const close_modal_3                                     = () => set_modal_3(false)
    const close_modal_4                                     = () => set_modal_4(false)

    const [trans_name, set_trans_name]                      = useState("")
    const [trans_description, set_trans_description]        = useState("")

    const GET__PWR__ACCOUNT = async () => {
        set_loading_pwr_account(true)
        let api = await API("kewangan/panjar-wang-runcit/list-account", {}, "GET", true)
        console.log("Log API Get List PWR Accounts : ", api)
        if(api.status_code === 200) {

            let account = api.data
            if(account.length > 0) {
                set_has_pwr_account(true)
                set_list_pwr_account(account[0])
                GET__PWR__TRANSACTION(account[0]["pwr_id"])
                set_pwr_id(account[0]["pwr_id"])
            }
        }
        set_loading_pwr_account(false)
    }

    const CREATE__PWR__ACOUNT = async () => {
        close_modal_2()
        if(has_pwr_account) {
            toast.error("Harap maaf! Anda tidak boleh mempunya lebih daripada 1 akaun panjar wang runcit.")
        }
        else if(!nama_pwr || nama_pwr === "" || nama_pwr === null || nama_pwr === undefined) {
            toast.error("Nama akaun panjar wang runcit tidak lengkap. Sila lengkapkan maklumat yang diperlukan.")
        }
        else {

            set_loading(true)

            let json = {
                pwr_holder_name: nama_pwr,
                pwr_balance_amount: parseFloat(baki_semasa_pwr).toFixed(2),
                pwr_float_amount: 0.00
            }

            let api = await API("kewangan/panjar-wang-runcit/create-account", json)
            console.log("Log Api Create Akaun PWR : ", api)
            set_loading(false)

            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
            else {
                toast.error(api.message)
            }
        }
    }

    const GET__PWR__TRANSACTION = async (pwr_id) => {
        set_loading_pwr_trans(true)
        let api = await API(`kewangan/panjar-wang-runcit/list-pwr-transaction/${pwr_id}`, {}, "GET", true)
        console.log("Log API Get List PWR Transactions : ", api)
        if(api.status_code === 200) {
            set_list_pwr_transaction(api.data)
            set_root_data(api.data)
            set_total_data(api.data.length)
        }
        set_loading_pwr_trans(false)
    }

    const CREATE__PWR__TRANSACTION = async () => {

    }

    const SEARCH_TRANSACTION = (search) => {
        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.rtpwr_title.toLowerCase().indexOf(search.toLowerCase()) !== -1)
            set_list_pwr_transaction(filtered_data)
        }

        if(search == "" || search == null) {
            set_list_pwr_transaction(root_data)
        }
    }

    useEffect(() => {
        GET__PWR__ACCOUNT()
    }, [])

    const get_badge = (status) => {
        if(status === 'Approve') {
            return <Badge className='bg-emerald-600 text-white'>Transaksi Berjaya</Badge>
        } 
        else if(status === 'Pending') {
            return <Badge className='bg-yellow-600 text-white'>Dalam Proses</Badge>
        } 
        else if(status === 'Cancel') {
            return <Badge className='bg-red-600 text-white'>Transaksi Gagal</Badge>
        } 
        else {
            return <Badge className='bg-gray-600 text-white'>Lain-lain</Badge>
        }
    }

    const NO__ACCOUNT = () => (
        <>
            <div className='mt-6'>
                <Card>
                    <div className='flex justify-center items-center'>
                        <p className='font-normal text-gray-600 text-sm'>Anda tidak mempunyai sebarang akaun panjar wang runcit. Klik butang dibawah untuk membuat akaun panjar wang runcit anda.</p>
                    </div>
                    <div className='mt-3 flex justify-center items-center'>
                        <Button className='bg-teal-600 hover:bg-teal-500 text-white' onClick={open_modal_1}>Daftar Akaun Panjar Wang Runcit</Button>
                    </div>
                </Card>
            </div>
        </>
    )

    const handleDataTableOnChange = (page, rows) => {
        setCurrentPage(page);
        setRowsPerPage(rows);
        const startIndex = (page - 1) * rows;
        const endIndex = startIndex + rows;
        set_list_pwr_transaction(root_data.slice(startIndex, endIndex));
    };

    if(loading_pwr_account) return <Loading />
    
    return (
        <div>

            <Modal
            title='Borang Pendaftaran Akaun Panjar Wang Runcit'
            themeClass='bg-teal-600 text-white'
            activeModal={modal_1}
            centered={true}
            onClose={close_modal_1}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className=''>
                        Tutup
                    </Button>
                    <Button 
                        onClick={() => { 
                            close_modal_1()
                            open_modal_2()
                        }}  
                        className='bg-teal-600 text-white'
                    >
                        Teruskan
                    </Button>
                </div>
                </>
            )}
            >
                <div className='mb-3'>
                    <Textinput 
                        label={'Nama Akaun Panjar Wang Runcit'}
                        placeholder="Contoh: Akaun PWR Masjid Dato' Umbi Kuala Klawang"
                        defaultValue={nama_pwr}
                        onChange={e => set_nama_pwr(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Textinput 
                        label={'Baki Semasa Panjar Wang Runcit'}
                        placeholder="Contoh: RM10.00"
                        defaultValue={baki_semasa_pwr}
                        onChange={e => set_baki_semasa_pwr(e.target.value)}
                        type={'number'}
                        required
                    />
                </div>
            </Modal>

            <Modal
            title='Pengesahan Pendaftaran Akaun Panjar Wang Runcit'
            themeClass='bg-teal-600 text-white'
            activeModal={modal_2}
            centered={true}
            onClose={close_modal_2}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className=''>
                        Tutup
                    </Button>
                    <Button 
                        onClick={() => { 
                            close_modal_1()
                            close_modal_2()
                            CREATE__PWR__ACOUNT()
                        }}  
                        className='bg-teal-600 text-white'
                    >
                        Teruskan
                    </Button>
                </div>
                </>
            )}
            >
                <p className='text-gray-500 text-sm'>Anda pasti untuk teruskan pendaftaran akaun panjar wang runcit anda dengan maklumat yang diberi?</p>
            </Modal>


            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Panjar Wang Runcit - Petty Cash</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai panjar wang runcit dan juga senarai transaksi anda.</p>  
                    </div>
                </div>
            </section>

            {
                has_pwr_account === false && <NO__ACCOUNT />
            }

            {
                has_pwr_account && (
                    <>
                    <div>
                    <section className='mt-6'>
                        <div className='grid grid-cols-1 md:grid-cols-1'>
                            <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                <div className='flex flex-row gap-3'>
                                    <div>
                                        <img src='https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Malaysia.png' className='rounded-full w-[70px] h-[70px] object-cover' />
                                    </div>
                                    <div className='pl-3'>
                                        <p className='text-sm text-gray-500'>Baki Terkini {list_pwr_account.pwr_holder_name}</p>
                                        <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(list_pwr_account.pwr_balance_amount).toFixed(2)}</p>
                                        <p className='mt-1 font-normal text-sm text-gray-400'>* Baki diatas merujuk kepada angka terkini pada {moment().format("DD MMM YYYY, hh:mm A")}.</p>

                                        <div className='mt-6'>
                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                                <Button onClick={() => navigate("/panjar-wang-runcit/tambah-transaksi")} className='btn btn-sm bg-teal-600 hover:bg-teal-500 text-white items-center gap-2'><ArrowUpIcon className='text-white' /> Tambah Rekod Penerimaan Kutipan</Button>
                                                <Button onClick={() => navigate("/panjar-wang-runcit/tambah-transaksi")} className='btn btn-sm bg-teal-600 hover:bg-teal-500 text-white items-center gap-2'><ArrowDownIcon className='text-white' /> Tambah Rekod Pengeluaran Kutipan</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='mt-6'>
                        <div>
                            <Card>
                                <InputGroup
                                    className='bg-gray-100 w-full md:w-[300px]'
                                    type="text"
                                    prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                                    placeholder='Carian.....'
                                    merged
                                    onChange={e => SEARCH_TRANSACTION(e.target.value)}
                                />
                                <div className='mt-3'>
                                    {
                                        loading_pwr_trans && (
                                            <>
                                            <div className='flex flex-col justify-center items-center'>
                                                <Spinner />
                                            </div>
                                            </>
                                        )
                                    }
                                    {
                                        loading_pwr_trans === false && (
                                            <>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <p className='text-gray-500 text-sm'>Papar {list_pwr_transaction.length} per {total_data} rekod.</p>
                                                    </div>
                                                    <div>
                                                        <Pagination
                                                            totalPages={totalPages}
                                                            currentPage={currentPage}
                                                            handlePageChange={(val) => {
                                                                setCurrentPage(val)
                                                                handleDataTableOnChange(val, rowsPerPage)
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
                                                            const newRowsPerPage = e.target.value;
                                                            setRowsPerPage(e.target.value)
                                                            handleDataTableOnChange(currentPage, newRowsPerPage);
                                                        }}
                                                        />
                                                    </div>
                                                </div>

                                                <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                    <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                    {/* <td width={'10%'} className='p-3 font-semibold text-sm'>No. Invois</td> */}
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Butiran Transaksi</td>
                                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori Transaksi</td>
                                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis Transaksi</td>
                                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Jumlah (RM)</td>
                                                    {/* <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Status</td> */}
                                                    <td width={'10%'} className='p-3 font-semibold text-sm '>Tarikh & Masa</td>
                                                    <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                                </thead>
                                                <tbody className='text-sm p-3'>
                                                    {
                                                        list_pwr_transaction.length < 1 && (
                                                            <tr className='border border-gray-100 p-3'>
                                                                <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai transaksi panjar wang runcit buat masa sekarang.</td>
                                                            </tr>
                                                        )
                                                    }

                                                    {
                                                        list_pwr_transaction.length > 0 && list_pwr_transaction.map((data, index) => (
                                                            <tr key={index} className='border border-gray-100 p-3'>
                                                                <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                {/* <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.transaction_invoice}</p>
                                                                </td> */}
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.rtpwr_title}</p>
                                                                </td>
                                                                <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'><Badge className='bg-teal-600 text-white'>{data.rtlookup_name}</Badge></p>
                                                                </td>
                                                                <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'><Badge className='bg-primary-600 text-white'>{data.rtlookup_type}</Badge></p>
                                                                </td>
                                                                <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{parseFloat(data.rtpwr_amount).toFixed(2)}</p>
                                                                </td>
                                                                {/* <td width={'10%'} className='p-3 font-normal text-sm text-clip text-center'>
                                                                    <p className='font-normal text-gray-900'>{get_badge(data.rtpwr_status)}</p>
                                                                </td> */}
                                                                <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{moment(data.rtpwr_transaction_date).format("DD MMM YYYY, hh:mm A")}</p>
                                                                </td>
                                                                <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                    <button 
                                                                        onClick={() => navigate(`/panjar-wang-runcit/maklumat-transaksi?a=${btoa(data.member_id)}`, 
                                                                        { 
                                                                            state: { 
                                                                                pwr_id: pwr_id, 
                                                                                data: data 
                                                                            }
                                                                        })} className='py-3 px-2'>
                                                                        <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-500 text-xl'} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            </>
                                        )
                                    }
                                </div>
                            </Card>
                        </div>
                    </section>
                    </div>
                    </>
                )
            }
        </div>
    );
}

export default MaklumatPanjarWangRuncit;