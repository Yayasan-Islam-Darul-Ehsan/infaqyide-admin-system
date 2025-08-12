import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Icons from '@/components/ui/Icon';
import moment from 'moment';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';

PerbelanjaanBank.propTypes = {
    
};

function PerbelanjaanBank(props) {

    const navigate                          = useNavigate()
    const { width, breakpoints }            = useWidth()

    const [currentPage, setCurrentPage]     = useState(1);
    const [rowsPerPage, setRowsPerPage]     = useState(10);
    const [totalRows, setTotalRows]         = useState(10) 
    const [totalPages, setTotalPages]       = useState(Math.ceil(totalRows / rowsPerPage));
    const [total_data, set_total_data]      = useState(0)

    const [loading, set_loading]            = useState(false)
    const [transaction, set_transaction]    = useState([
        {
            "id": 1,
            "invoice_number": "INV001",
            "bill_name": "Salaries",
            "bill_description": "Monthly salaries for staff",
            "transaction_type": "Expenditure",
            "transaction_amount": 5000,
            "transaction_date_time": "2024-07-01T09:00:00",
            "payment_method": "Bank Transfer",
            "payor_name": "Masjid Finance Dept.",
            "payor_email": "finance@masjid.com",
            "payor_phone": "+60123456789",
            "debit_credit": "Debit"
        },
        {
            "id": 2,
            "invoice_number": "INV002",
            "bill_name": "Utility Bills",
            "bill_description": "Electricity and water bills for June",
            "transaction_type": "Expenditure",
            "transaction_amount": 800,
            "transaction_date_time": "2024-07-02T10:00:00",
            "payment_method": "Credit Card",
            "payor_name": "Masjid Admin",
            "payor_email": "admin@masjid.com",
            "payor_phone": "+60123456790",
            "debit_credit": "Debit"
        },
        {
            "id": 3,
            "invoice_number": "INV003",
            "bill_name": "Maintenance",
            "bill_description": "Routine maintenance of mosque facilities",
            "transaction_type": "Expenditure",
            "transaction_amount": 1500,
            "transaction_date_time": "2024-07-03T11:00:00",
            "payment_method": "Cheque",
            "payor_name": "Masjid Maintenance Team",
            "payor_email": "maintenance@masjid.com",
            "payor_phone": "+60123456791",
            "debit_credit": "Debit"
        },
        {
            "id": 4,
            "invoice_number": "INV004",
            "bill_name": "Office Supplies",
            "bill_description": "Purchase of stationery and office supplies",
            "transaction_type": "Expenditure",
            "transaction_amount": 300,
            "transaction_date_time": "2024-07-04T12:00:00",
            "payment_method": "Cash",
            "payor_name": "Masjid Office Manager",
            "payor_email": "office@masjid.com",
            "payor_phone": "+60123456792",
            "debit_credit": "Debit"
        },
        {
            "id": 5,
            "invoice_number": "INV005",
            "bill_name": "Security Services",
            "bill_description": "Monthly payment for security services",
            "transaction_type": "Expenditure",
            "transaction_amount": 700,
            "transaction_date_time": "2024-07-05T13:00:00",
            "payment_method": "Bank Transfer",
            "payor_name": "Masjid Security Dept.",
            "payor_email": "security@masjid.com",
            "payor_phone": "+60123456793",
            "debit_credit": "Debit"
        },
        {
            "id": 6,
            "invoice_number": "INV006",
            "bill_name": "IT Services",
            "bill_description": "IT support and software maintenance",
            "transaction_type": "Expenditure",
            "transaction_amount": 1200,
            "transaction_date_time": "2024-07-06T14:00:00",
            "payment_method": "Bank Transfer",
            "payor_name": "Masjid IT Dept.",
            "payor_email": "it@masjid.com",
            "payor_phone": "+60123456794",
            "debit_credit": "Debit"
        },
        {
            "id": 7,
            "invoice_number": "INV007",
            "bill_name": "Marketing",
            "bill_description": "Advertising and promotional activities",
            "transaction_type": "Expenditure",
            "transaction_amount": 600,
            "transaction_date_time": "2024-07-07T15:00:00",
            "payment_method": "Credit Card",
            "payor_name": "Masjid Marketing Dept.",
            "payor_email": "marketing@masjid.com",
            "payor_phone": "+60123456795",
            "debit_credit": "Debit"
        },
        {
            "id": 8,
            "invoice_number": "INV008",
            "bill_name": "Cleaning Services",
            "bill_description": "Weekly cleaning services",
            "transaction_type": "Expenditure",
            "transaction_amount": 400,
            "transaction_date_time": "2024-07-08T16:00:00",
            "payment_method": "Cash",
            "payor_name": "Masjid Cleaning Dept.",
            "payor_email": "cleaning@masjid.com",
            "payor_phone": "+60123456796",
            "debit_credit": "Debit"
        },
        {
            "id": 9,
            "invoice_number": "INV009",
            "bill_name": "Loan Loss Provisions",
            "bill_description": "Provision for potential loan losses",
            "transaction_type": "Expenditure",
            "transaction_amount": 2000,
            "transaction_date_time": "2024-07-09T17:00:00",
            "payment_method": "Bank Transfer",
            "payor_name": "Masjid Finance Dept.",
            "payor_email": "finance@masjid.com",
            "payor_phone": "+60123456789",
            "debit_credit": "Debit"
        },
        {
            "id": 10,
            "invoice_number": "INV010",
            "bill_name": "Interest Expenses",
            "bill_description": "Interest paid on borrowed funds",
            "transaction_type": "Expenditure",
            "transaction_amount": 1000,
            "transaction_date_time": "2024-07-10T18:00:00",
            "payment_method": "Bank Transfer",
            "payor_name": "Masjid Finance Dept.",
            "payor_email": "finance@masjid.com",
            "payor_phone": "+60123456789",
            "debit_credit": "Debit"
        }
    ])

    const [modal, set_modal]                = useState(false)

    useEffect(() => {
        set_total_data(transaction.length)
        set_total_data(transaction.length)
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

    return (
        <div>
            <Modal
            title='Penambahan Maklumat Perbelanjaan Bank'
            themeClass='bg-primary-600'
            activeModal={modal}
            onClose={() => set_modal(false)}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end gap-3'>
                    <Button onClick={() => set_modal(false)} className=''>Tutup</Button>
                    <Button onClick={() => set_modal(false)} className='bg-primary-600 text-white'>Simpan</Button>
                </div>
                </>
            )}
            >
                <div>
                    <Textinput 
                        className='mb-3'
                        label={'Butiran Perbelanjaan Bank'}
                        placeholder='Contoh: Butiran Penerimaan Dana Untuk Bulan Jun 2024'
                    />
                    <Textinput 
                        className='mb-3'
                        label={'Jumlah Perbelanjaan (RM)'}
                        placeholder='Contoh: RM 200.00'
                        type={'number'}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <Select
                            label={'Tahun Perbelanjaan'}
                            placeholder='Contoh: 2024'
                            defaultValue={''}
                            options={[
                                { label: moment().subtract(1, 'year').format("YYYY"), value: moment().subtract(1, 'year').format("YYYY") },
                                { label: moment().format("YYYY"), value: moment().format("YYYY") },
                                { label: moment().add(1, 'year').format("YYYY"), value: moment().add(1, 'year').format("YYYY") }
                            ]}
                        />
                        <Select 
                            label={'Bulan Perbelanjaan'}
                            placeholder='Contoh: Januari'
                            defaultValue={''}
                            options={[
                                { label: 'Januari', value: 'Januari' },
                                { label: 'Februari', value: 'Februari' },
                                { label: 'Mac', value: 'Mac' },
                                { label: 'April', value: 'April' },
                                { label: 'Mei', value: 'Mei' },
                                { label: 'Jun', value: 'Jun' },
                                { label: 'Julai', value: 'Julai' },
                                { label: 'Ogos', value: 'Ogos' },
                                { label: 'September', value: 'September' },
                                { label: 'Oktober', value: 'Oktober' },
                                { label: 'November', value: 'November' },
                                { label: 'Disember', value: 'Disember' }
                            ]}
                        />
                    </div>
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Perbelanjaan Masjid - (Bank)</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai perbelanjaan bank oleh institusi anda sepanjang tahun.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button onClick={() => set_modal(true)} className='bg-emerald-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Tambah Maklumat Perbelanjaan
                        </Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                    <div className='col-span-2 bg-white p-6 border border-gray-200 rounded-xl'>
                        <div className='flex flex-row gap-3'>
                            <div>
                                <img src='https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Malaysia.png' className='rounded-full w-[70px] h-[70px] object-cover' />
                            </div>
                            <div className='pl-3'>
                                <p className='text-sm text-gray-500'>Jumlah Perbelanjaan Keseluruhan</p>
                                <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(97136.50).toFixed(2)}</p>
                                <p className='mt-1 font-normal text-xs text-gray-400'>*Angka diatas merujuk kepada jumlah perbelanjaan sehingga {moment().format("DD MMM YYYY, hh:mm A")}.</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white p-6 border border-gray-200 rounded-xl'>
                        <div className='pl-3'>
                            <p className='text-sm text-gray-500'>Jumlah Perbelanjaan {moment().format("MMMM YYYY")}</p>
                            <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(23456.70).toFixed(2)}</p>
                            <p className='mt-1 font-normal text-xs text-gray-400'>*Jumlah diatas merujuk kepada perbelanjaan bulan {moment().format("MMMM YYYY")}.</p>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white p-6 border border-gray-200 rounded-xl'>
                        <div className='pl-3'>
                            <p className='text-sm text-gray-500'>Jumlah Perbelanjaan {moment().subtract(1, 'month').format("MMMM YYYY")}</p>
                            <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(97136.50 - 23456.70).toFixed(2)}</p>
                            <p className='mt-1 font-normal text-xs text-gray-400'>*Angka diatas merujuk kepada perbelanjaan bulan {moment().subtract(1, 'month').format("MMMM YYYY")}.</p>
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
                        />
                        <div className='mt-3'>
                            {
                                loading && (
                                    <>
                                    <div className='flex flex-col justify-center items-center'>
                                        <Spinner />
                                    </div>
                                    </>
                                )
                            }
                            {
                                loading === false && (
                                    <>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-gray-500 text-xs'>Papar {transaction.length} per {total_data} rekod.</p>
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
                                            <td width={'5%'} className='p-3 font-semibold text-xs'>Bil.</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs'>No. Invois</td>
                                            <td width={'20%'} className='p-3 font-semibold text-xs'>Butiran Perbelanjaan</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs'>Jenis Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs'>Jumlah (RM)</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Kaedah Bayaran</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Tarikh & Masa</td>
                                            <td width={'10%'} className='text-center p-3 font-semibold text-xs'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-xs p-3'>
                                            {
                                                transaction.length < 1 && (
                                                    <tr className='border border-gray-100 p-3'>
                                                        <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai kutipan tetap buat sementara waktu.</td>
                                                    </tr>
                                                )
                                            }

                                            {
                                                transaction.length > 0 && transaction.map((data, index) => (index < rowsPerPage) && (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-xs'>{index + 1}.</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.invoice_number}</p>
                                                        </td>
                                                        <td width={'20%'} className='p-3 font-normal text-xs text-clip'>
                                                            <p className='font-medium text-gray-900'>{data.bill_name}</p>
                                                            <p className='font-normal text-xs text-gray-500'>{data.bill_description}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'><Badge className='bg-primary-600 text-white'>{data.transaction_type}</Badge></p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'>{parseFloat(data.transaction_amount).toFixed(2)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip text-center'>
                                                            <p className='font-normal text-gray-900'><Badge className='bg-teal-600 text-white'>{data.payment_method}</Badge></p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip text-center'>
                                                            <p className='font-normal text-gray-900'>{data.transaction_date_time}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                            <button onClick={() => navigate(`/ahli-khairat/detail?a=${btoa(data.member_id)}`, { state: data })} className='py-3 px-2'>
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
    );
}

export default PerbelanjaanBank;