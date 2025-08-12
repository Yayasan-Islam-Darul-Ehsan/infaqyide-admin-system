import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';

SenaraiTransaksiPerbelanjaan.propTypes = {
    
};

function SenaraiTransaksiPerbelanjaan(props) {

    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading, set_loading]                            = useState(false)

    const [list_trans, set_list_trans]                      = useState([])
    const [currentPage, setCurrentPage]                     = useState(1);
    const [rowsPerPage, setRowsPerPage]                     = useState(10);
    const [totalRows, setTotalRows]                         = useState(0) 
    const totalPages                                        = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                      = useState(0)

    const GET__TRANSACTION = async () => {
        set_loading(true)
        let api = await API(`kewangan/senarai-transaksi-pengeluaran?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET")
        console.log("Log Api Get List Transaksi Perbelanjaan : ", api)

        if(api.status_code === 200) {
            set_list_trans(api.data.row)
            set_total_data(api.data.total)
            setTotalRows(api.data.total)
        }

        set_loading(false)
    }

    useEffect(() => {
        GET__TRANSACTION()
    }, [currentPage, rowsPerPage])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Transaksi Rekod Perbelanjaan</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai rekod transaksi yang telah diterima oleh akaun bank anda.</p>  
                    </div>
                    <div>
                        <Button onClick={() => navigate("/perbelanjaan/tambah-rekod-transaksi")} className='bg-teal-600 text-white'>Tambah Rekod Transaksi</Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='font-semibold text-gray-900 text-lg'>Senarai Transaksi Perbelanjaan</p>
                            <p className='font-normal text-gray-600 text-sm'>Berikut adalah senarai transaksi perbelanjaan oleh bank-bank anda.</p>
                        </div>
                    </div>
                    <div className='mt-6'>
                        {
                            loading && (
                                <>
                                <div className='flex justify-center items-center'>
                                    <Spinner />
                                </div>
                                </>
                            )
                        }

                        {
                            loading === false && list_trans.length < 1 && (
                                <>
                                <div className='mt-6 flex justify-center items-center'>
                                    <p className='font-normal text-gray-600 text-sm'>Anda tidak mempunyai transaksi rekod perbelanjaan oleh bank anda semasa buat masa ini.</p>
                                </div>
                                </>
                            )
                        }

                        {
                            loading === false && list_trans.length > 0 && (
                                <>
                                <div>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div>
                                            <p className='text-gray-500 text-sm'>Papar {list_trans.length} per {total_data} rekod.</p>
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
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Amaun Transaksi (RM)</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori Transaksi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis Transaksi</td>
                                            {/* <td width={'10%'} className='p-3 font-semibold text-sm'>Mod Transaksi</td> */}
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh & Masa</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                list_trans.length > 0 && list_trans.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.TRANS_TITLE}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{parseFloat(data.TRANS_AMOUNT).toFixed(2)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.TRANS_CATEGORY_NAME}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.TRANS_CATEGORY_TYPE}</p>
                                                        </td>
                                                        {/* <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.TRANS_DEBIT_CREDIT}</p>
                                                        </td> */}
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{moment(data.TRANS_DATE).format("DD MMM YYYY, hh:mm A")}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <Button className='' onClick={() => navigate("/perbelanjaan/maklumat-transaksi", { state: data })}>
                                                                <Icons icon={"heroicons:pencil-square"} className={"text-lg text-yellow-600"} />
                                                            </Button>
                                                        </td>
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

export default SenaraiTransaksiPerbelanjaan;