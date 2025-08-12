import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { data_transaksi } from './data-transaksi';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';

ListTransaksiBayaran.propTypes = {
    
};

function ListTransaksiBayaran(props) {

    const { width, breakpoints }                    = useWidth();
    const navigate = useNavigate()

    const [loading, set_loading]                    = useState(true)
    const [list_transaction, set_list_transaction]  = useState(data_transaksi)

    const [currentPage, setCurrentPage]             = useState(1)
    const [totalPages, setTotalPages]               = useState(1)

    return (
        <div>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-3xl'}`}>Senarai Transaksi Bayaran</p>  
                        <p className={`text-xs text-gray-500`}>Berikut adalah senarai transaksi bayaran anda. Anda boleh menyemak dan mencetak resit bayaran anda.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow items-center gap-2'><Icons icon={'heroicons:folder-arrow-down'} />Muat Turun Senarai</Button>
                        <Button className='bg-white border border-gray-200 shadow items-center gap-2'><Icons icon={'heroicons:printer'} /> Cetak Senarai</Button>
                        {/* <Button className='bg-teal-500 text-white items-center gap-2'><Icons icon={'heroicons:plus-circle'} /> Tambah Tanggungan</Button> */}
                    </div>
                </div>
            </section>        

            <section className='mt-6'>
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
            </section>

            <section className='mt-3'>
                <div>
                    <Card>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-500 text-xs'>Papar {currentPage} per {totalPages} rekod.</p>
                            </div>
                            <div>
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                />
                            </div>
                            <div>
                                <Select 
                                placeholder='-- Jumlah Rekod --'
                                options={[
                                    { label: 10, value: 10},
                                    { label: 20, value: 20},
                                    { label: 50, value: 50},
                                    { label: 100, value: 100},
                                    { label: 'Semua', value: 'All'}
                                ]}
                                />
                            </div>
                        </div>

                        <div className='mt-3'>
                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                    <td width={'5%'} className='p-3 font-semibold text-xs'>Bil.</td>
                                    <td width={'30%'} className='p-3 font-semibold text-xs'>Transaksi</td>
                                    <td width={'20%'} className='p-3 font-semibold text-xs text-center'>Jumlah (RM)</td>
                                    <td width={'20%'} className='p-3 font-semibold text-xs text-center'>Kaedah Bayaran</td>
                                    <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Tarikh</td>
                                    <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Status</td>
                                    <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Tindakan</td>
                                </thead>
                                <tbody className='text-xs p-3'>
                                    {
                                        list_transaction.length < 1 && (
                                            <tr className='border border-gray-100 p-3'>
                                                <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
                                            </tr>
                                        )
                                    }

                                    {
                                        list_transaction.length > 0 && list_transaction.map((data, index) => (
                                            <tr key={index} className='border border-gray-100 p-3'>
                                                <td width={'5%'} className='p-3 font-normal text-xs'>{index + 1}.</td>
                                                <td width={'30%'} className='p-3 font-semibold text-xs text-clip'>
                                                    <p className='font-semibold text-gray-900'>{data.transaction_bill_name}</p>
                                                    <p className='font-normal text-gray-900'>{data.transaction_bill_description}</p>
                                                </td>
                                                <td width={'20%'} className='p-3 font-semibold text-xs text-center'>{parseFloat(data.transaction_amount).toFixed(2)}</td>
                                                <td width={'20%'} className='p-3 font-normal text-xs text-center'><Badge className='bg-slate-600 text-white'>{data.transaction_payment_method}</Badge></td>
                                                <td width={'5%'} className='p-3 font-normal text-xs text-center'>{moment(data.transaction_date).format("DD MMMM YYYY, h:m A")}</td>
                                                <td width={'5%'} className='p-3 font-normal text-xs text-center'><Badge className={`${data.transaction_status === "Success" ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>{data.transaction_status}</Badge></td>
                                                <td width={'10%'} className='p-3 font-normal flex'>
                                                    <button onClick={() => navigate("/transaction/info", { state: data })} className='py-3 px-2'>
                                                        <Icons icon={'heroicons:eye'} className={'bg-white text-blue-500 text-xl'} />
                                                    </button>
                                                    <button onClick={() => navigate("/transaction/info", { state: data })} className='py-3 px-2'>
                                                        <Icons icon={'heroicons:credit-card'} className={'bg-white text-yellow-500 text-xl'} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default ListTransaksiBayaran;