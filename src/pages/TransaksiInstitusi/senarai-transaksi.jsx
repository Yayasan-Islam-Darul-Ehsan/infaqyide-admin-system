import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { useSelector } from 'react-redux';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Badge from '@/components/ui/Badge';


SenaraiHebahan.propTypes = {
    
};

function SenaraiHebahan(props) {

    const { user }                                      = useSelector(user => user.auth)

    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading, set_loading_status]                 = useState(true)
    const [senarai_transaksi, set_senarai_transaksi]    = useState([])

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);

    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                  = useState(0)

    
    const GET__LIST__TRANSAKSI = async () => {
        set_loading_status(true)
        let api = await API(`getTransaksiInstitusiBaru?page=${currentPage}&limit=${rowsPerPage}`, { org_id: user.id }, "POST", true)
        console.log("Log Get Transaksi Institusi Details : ", api)
        if(api.status_code === 200) {
            set_senarai_transaksi(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
            
        }
        setTimeout(() => {
            set_loading_status(false)
        }, 500);
    }

    const handleDataTableOnChange = async (page, limit) => {
        set_loading_table(true)
        let api = await API(`getTransaksiInstitusiBaru?page=${page}&limit=${limit}`, { org_id: user.id }, "POST", true)
        if(api.status_code === 200) {
            set_senarai_transaksi(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
        }
        setTimeout(() => {
            set_loading_table(false)
        }, 1000);
    }

    
    useEffect(() => {
        GET__LIST__TRANSAKSI()
    }, [currentPage, rowsPerPage])

    if(loading) return <Loading />

    const GetStatus = (TransaksiStatus) => {
        if(TransaksiStatus === 2) {
            return <Badge className='bg-yellow-500 text-white justify-center'></Badge>
        }
        else if(TransaksiStatus === 1) {
            return <Badge className='bg-emerald-600 text-white justify-center'>Berjaya</Badge>
        }
        else if(TransaksiStatus === 3) {
            return <Badge className='bg-red-500 text-white justify-center'>Gagal</Badge>
        }
        else  {
            return <Badge className='bg-red-500 text-white justify-center'>Tidak Diketahui</Badge>
        }
        
    }

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Maklumat Transaksi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai transaksi institusi.</p>  
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
                            !loading && (
                                <>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-500 text-sm'>Papar {senarai_transaksi.length} per {total_data} rekod.</p>
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

                                    <div className='mt-3'>
                                        <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Rujukan</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Nama</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Tabung</td>
                                                <td width={'5%'} className='p-3 font-semibold text-sm'>Jumlah (RM)</td>
                                                <td width={'15%'} className='p-3 font-semibold text-sm'>Tarikh</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Tindakan</td>
                                                
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    senarai_transaksi.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai transaksi buat masa sementara waktu.</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    senarai_transaksi.length > 0 && senarai_transaksi.map((data, index) => (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.bill_invoice_no}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.bill_fullname}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.tabung_name}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{parseFloat(data.bill_amount).toFixed(2)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{moment(data.bill_created).format("DD MMM YYYY, hh:mm A")}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{GetStatus(data.bill_status)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                <button onClick={() => navigate(`/institusi/transaksi-institusi/maklumat-transaksi/${data.bill_invoice_no}`, { state: data })} className='py-3 px-2'>
                                                                    <Icons icon={'heroicons:eye'} className={'bg-white text-blue-500 text-xl'} />
                                                                </button>
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
                    </Card>
                </div>
            </section>

            

            
        </div>
    );
}

export default SenaraiHebahan;