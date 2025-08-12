import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import { Spinner } from 'evergreen-ui';
import InputGroup from '@/components/ui/InputGroup';
import Icons from '@/components/ui/Icon';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Badge from '@/components/ui/Badge';


RekodPelupusanAset.propTypes = {
    
};

function RekodPelupusanAset(props) {

    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()
    const state                                         = useLocation().state

    const [list_data, set_list_data]                    = useState([])
    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);
    const [totalRows, setTotalRows]                     = useState(10) 
    const [total_data, set_total_data]                  = useState(0)
    const totalPages                                    = Math.ceil(total_data / rowsPerPage);
    

    const [loading_data, set_loading_data]              = useState(true)

    const GET__DATA = async () => {
        set_loading_data(true)
        let api = await API(`pelupusan/senarai-pelupusan-aset?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET")
        console.log("Log Function Get Data : ", api)

        if(api.status_code === 200) {
            set_list_data(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
        }

        set_loading_data(false)
    }

    useEffect(() => {
        GET__DATA()
    }, [currentPage, rowsPerPage])

    // const handleDataTableOnChange = (page, rows) => {
    //     setCurrentPage(page);
    //     setRowsPerPage(rows);
    //     const startIndex = (page - 1) * rows;
    //     const endIndex = startIndex + rows;
    //     set_list_data(list_data.slice(startIndex, endIndex));
    // };

    return (
        <div>
            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Permohonan Pelupusan Aset</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai permohonan pelupusan aset untuk institusi anda.</p>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button className='bg-teal-600 text-white' onClick={() => navigate("/aset/permohonan-pelupusan-aset")}>Permohonan Pelupusan Aset</Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    {
                        loading_data && (
                            <>
                                <div className='flex justify-center items-center'><Spinner /></div>
                            </>
                        )
                    }

                    {
                        !loading_data && (
                            <>
                            <div>
                                <InputGroup
                                    className='bg-gray-100 w-full md:w-[300px]'
                                    type="text"
                                    prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                                    placeholder='Carian.....'
                                    merged
                                />
                                <div className='mt-3'>
                                    {
                                        loading_data === false && (
                                            <>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <p className='text-gray-500 text-sm'>Papar {list_data.length} per {total_data} rekod.</p>
                                                    </div>
                                                    <div>
                                                        <Pagination
                                                            totalPages={totalPages}
                                                            currentPage={currentPage}
                                                            handlePageChange={(val) => {
                                                                setCurrentPage(val)
                                                                // handleDataTableOnChange(val, rowsPerPage)
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
                                                        <td width={'20%'} className='p-3 font-semibold text-sm'>Maklumat Aset</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Pemohon</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>No. Telefon Pemohon</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Kelas</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Cadangan Pelupusan</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                                        <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                                    </thead>
                                                    <tbody className='text-sm p-3'>
                                                        {
                                                            list_data.length < 1 && (
                                                                <tr className='border border-gray-100 p-3'>
                                                                    <td colSpan={10} className='p-3 text-center'>Anda tidak mempunyai senarai permohonan pelupusan aset buat masa sekarang.</td>
                                                                </tr>
                                                            )
                                                        }
                                                        {
                                                            list_data.length > 0 && list_data.map((data, index) => (
                                                                <tr key={index} className='border border-gray-100 p-3'>
                                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                    <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                        {/* <p className='font-semibold text-gray-900'>{data.pelupusan_ref_no}</p> */}
                                                                        <p className='font-normal text-gray-900'>{data.aset_nama}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.nama_pemohon ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.no_pemohon ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.aset_kategori ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.aset_jenis ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.aset_kelas ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{moment(data.tarikh_cadangan_pelupusan).format("DD MMM, YYYY")}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        {
                                                                            data.status === "Aktif" && (
                                                                                <Badge className=' justify-center items-center bg-emerald-600 text-white'>{data.status}</Badge>
                                                                            )
                                                                        }
                                                                        {/* <p className='font-normal text-gray-900'>{data.status ?? '-- tiada maklumat --'}</p> */}
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                        <button className='' onClick={() => navigate("/aset/maklumat-pelupusan-aset", { state: data })}>
                                                                            <Icons className={"text-lg text-yellow-500"} icon={"heroicons:pencil-square"} />
                                                                        </button>
                                                                        {/* <div className=''>
                                                                            <Button className='btn  btn-sm text-sm bg-teal-600 text-white' onClick={() => navigate("/aset/maklumat-pelupusan-aset", { state: data })}>Lihat Butiran</Button>
                                                                        </div> */}
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
                            </div>
                            </>
                        )
                    }
                </Card>
            </section>
        </div>
    );
}

export default RekodPelupusanAset;