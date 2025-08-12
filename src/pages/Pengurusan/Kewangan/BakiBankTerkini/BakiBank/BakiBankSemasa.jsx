import React, { useState } from 'react';
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

BakiBank.propTypes = {
    
};

function BakiBank(props) {

    const navigate                                  = useNavigate()
    const { width, breakpoints }                    = useWidth()
    const [loading, set_loading]                    = useState(false)

    const [currentPage, setCurrentPage]             = useState(1);
    const [rowsPerPage, setRowsPerPage]             = useState(5);

    const [totalRows, setTotalRows]                 = useState(0) 
    const totalPages                                = Math.ceil(totalRows / rowsPerPage);

    const [total_data, set_total_data]              = useState(0)

    const [bank_balance, set_bank_balance]          = useState(239.70)
    const [transaction, set_transaction]            = useState([
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
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Baki Bank Semasa</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai baki bank semasa dan juga senarai transaksi anda.</p>  
                    </div>
                    {/* <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button>
                    </div> */}
                </div>
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                        <div className='flex flex-row gap-3'>
                            <div>
                                <img src='https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Malaysia.png' className='rounded-full w-[70px] h-[70px] object-cover' />
                            </div>
                            <div className='pl-3'>
                                <p className='text-sm text-gray-500'>Baki Terkini</p>
                                <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(bank_balance).toFixed(2)}</p>
                                <p className='mt-1 font-normal text-xs text-gray-400'>* Baki diatas merujuk kepada angka terkini pada {moment().format("DD MMM YYYY, hh:mm A")}.</p>

                                <div className='mt-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                        <Button className='btn btn-sm bg-gray-900 hover:bg-gray-700 text-white items-center gap-2'><ArrowUpIcon className='text-white' /> Penerimaan</Button>
                                        <Button className='btn btn-sm bg-gray-900 hover:bg-gray-700 text-white items-center gap-2'><ArrowDownIcon className='text-white' /> Pengeluaran</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-transparent p-6 rounded-xl'>
                        
                    </div>
                </div>
            </section>

            {/* <section className='mt-3'>
                <div className=''>
                    <Card className='flex'>
                        <InputGroup
                            className='bg-gray-100 w-full md:w-[300px]'
                            type="text"
                            prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                            placeholder='Carian.....'
                            merged
                        />
                    </Card>
                </div>
            </section>  */}

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
                                            <td width={'20%'} className='p-3 font-semibold text-xs'>Butiran Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs'>Jenis Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs'>Jumlah (RM)</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Status</td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Tarikh & Masa</td>
                                            <td width={'10%'} className='text-center p-3 font-semibold text-xs'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-xs p-3'>
                                            {
                                                transaction.length < 1 && (
                                                    <tr className='border border-gray-100 p-3'>
                                                        <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai ahli khairat kematian yang berdaftar buat sementara waktu.</td>
                                                    </tr>
                                                )
                                            }

                                            {
                                                transaction.length > 0 && transaction.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-xs'>{index + 1}.</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.transaction_invoice}</p>
                                                        </td>
                                                        <td width={'20%'} className='p-3 font-normal text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.transaction_name}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'><Badge className='bg-primary-600 text-white'>{data.transaction_type}</Badge></p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip'>
                                                            <p className='font-normal text-gray-900'>{parseFloat(data.transaction_amount).toFixed(2)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip text-center'>
                                                            <p className='font-normal text-gray-900'>{get_badge(data.transaction_status)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-xs text-clip text-center'>
                                                            <p className='font-normal text-gray-900'>{data.transaction_datetime}</p>
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

export default BakiBank;