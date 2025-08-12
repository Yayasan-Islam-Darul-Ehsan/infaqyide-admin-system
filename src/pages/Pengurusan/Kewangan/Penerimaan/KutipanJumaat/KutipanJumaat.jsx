import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import { ArrowDownIcon, ArrowUpIcon, Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Modal from '@/components/ui/Modal';
import Textinput from '@/components/ui/Textinput';

KutipanJumaat.propTypes = {
    
};

function KutipanJumaat(props) {

    const navigate                                  = useNavigate()
    const { width, breakpoints }                    = useWidth()
    const [loading, set_loading]                    = useState(false)

    const [currentPage, setCurrentPage]             = useState(1);
    const [rowsPerPage, setRowsPerPage]             = useState(10);

    const [totalRows, setTotalRows]                 = useState(10) 
    const [totalPages, setTotalPages]               = useState(Math.ceil(totalRows / rowsPerPage));

    const [total_data, set_total_data]              = useState(0)
    const [transaction, set_transaction]            = useState([
        {
            transaction_id: 1,
            transaction_invoice: `KJ09019290819287234`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 150.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(10, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 2,
            transaction_invoice: `KJ090192909128812333`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 200.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(17, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 3,
            transaction_invoice: `KJ090112918289372373`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 250.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(24, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 4,
            transaction_invoice: `KJ090100029392883455`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 300.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(31, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 5,
            transaction_invoice: `KJ0998182877290192490`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 350.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(38, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 6,
            transaction_invoice: `KJ090128371298347823`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 400.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(45, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 7,
            transaction_invoice: `KJ090238472918273645`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 450.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(52, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 8,
            transaction_invoice: `KJ090374829372918273`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 500.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(59, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 9,
            transaction_invoice: `KJ090918273645092873`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 550.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(66, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        },
        {
            transaction_id: 10,
            transaction_invoice: `KJ090374828273645192`,
            transaction_datetime: moment().format("DD MMM YYYY, hh:mm A"),
            transaction_amount: 600.00,
            transaction_status: 'Approve',
            transaction_name: 'Kutipan Jumaat ' + moment().subtract(73, 'days').format("DD MMM YYYY"),
            transaction_type: 'Kredit'
        }
    ]
    )

    const [modal, set_modal] = useState(false)

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

    useEffect(() => {
        setTotalPages(Math.ceil(transaction.length / rowsPerPage))
    }, [])

    return (
        <div>

            <Modal
            title='Penambahan Maklumat Kutipan Jumaat'
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
                        label={'Butiran Kutipan Jumaat'}
                        placeholder='Contoh: Butiran Kutipan Tabung Jumaat Untuk Bulan Jun 2024'
                    />
                    <Textinput 
                        className='mb-3'
                        label={'Jumlah Kutipan (RM)'}
                        placeholder='Contoh: RM 200.00'
                        type={"number"}
                        pattern="^[0-9]" 
                        inputmode="numeric"
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <Select 
                            label={'Tahun Kutipan'}
                            placeholder='Contoh: 2024'
                            defaultValue={''}
                            options={[
                                { label: moment().subtract(1, 'year').format("YYYY"), value: moment().subtract(1, 'year').format("YYYY") },
                                { label: moment().format("YYYY"), value: moment().format("YYYY") },
                                { label: moment().add(1, 'year').format("YYYY"), value: moment().add(1, 'year').format("YYYY") }
                            ]}
                        />
                        <Select 
                            label={'Bulan Kutipan'}
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
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Kutipan Jumaat - (Tabung Masjid)</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai kutipan jumaat anda sepanjang tahun.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button onClick={() => set_modal(true)} className='bg-emerald-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Tambah Maklumat Kutipan
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
                                <p className='text-sm text-gray-500'>Jumlah Kutipan Jumaat Keseluruhan</p>
                                <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(1150.70).toFixed(2)}</p>
                                <p className='mt-1 font-normal text-xs text-gray-400'>*Baki diatas merujuk kepada jumlah kutipan keseluruhan terkini sehingga {moment().format("DD MMM YYYY, hh:mm A")}.</p>

                                {/* <div className='mt-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                        <Button className='btn btn-sm bg-gray-900 hover:bg-gray-700 text-white items-center gap-2'><ArrowUpIcon className='text-white' /> Penerimaan</Button>
                                        <Button className='btn btn-sm bg-gray-900 hover:bg-gray-700 text-white items-center gap-2'><ArrowDownIcon className='text-white' /> Pengeluaran</Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white p-6 border border-gray-200 rounded-xl'>
                        <div className='pl-3'>
                            <p className='text-sm text-gray-500'>Jumlah Kutipan Jumaat {moment().format("MMMM YYYY")}</p>
                            <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(756.00).toFixed(2)}</p>
                            <p className='mt-1 font-normal text-xs text-gray-400'>*Baki diatas merujuk kepada bulan {moment().format("MMMM YYYY")}.</p>
                        </div>
                    </div>
                    <div className='col-span-1 bg-white p-6 border border-gray-200 rounded-xl'>
                        <div className='pl-3'>
                            <p className='text-sm text-gray-500'>Jumlah Kutipan Jumaat {moment().subtract(1, 'month').format("MMMM YYYY")}</p>
                            <p className='font-semibold text-2xl text-gray-900'>RM {parseFloat(1150.70 - 756.00).toFixed(2)}</p>
                            <p className='mt-1 font-normal text-xs text-gray-400'>*Baki diatas merujuk kepada bulan {moment().subtract(1, 'month').format("MMMM YYYY")}.</p>
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
                                            <td width={'20%'} className='p-3 font-semibold text-xs'>Butiran Kutipan</td>
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
                                                        <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai kutipan tetap buat sementara waktu.</td>
                                                    </tr>
                                                )
                                            }

                                            {
                                                transaction.length > 0 && transaction.map((data, index) => (index < rowsPerPage) && (
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

export default KutipanJumaat;