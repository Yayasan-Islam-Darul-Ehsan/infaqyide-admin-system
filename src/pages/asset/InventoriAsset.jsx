import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import Pagination from "@/components/ui/Pagination";
import Icons from '@/components/ui/Icon';
import { INVENTORI__ASET } from './inventori-aset';
import { API } from '@/utils/api';
import { Spinner } from 'evergreen-ui';
import InputGroup from '@/components/ui/InputGroup';
import moment from 'moment';
import Badge from '@/components/ui/Badge';

function InventoriAsset() {

    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()
    const state                                         = useLocation().state

    const [table_data, set_table_data]                  = useState(INVENTORI__ASET);

    const [kategori, set_kategori]                      = useState(false)
    const [jenis, set_jenis]                            = useState(false)
    const [cari, set_cari]                              = useState(false)

    const [class_asset, set_class_asset]                = useState(null)
    const [location_asset, set_location_asset]          = useState(null)
    const [display, set_display]                        = useState(null)

    const [list_data, set_list_data]                    = useState([])
    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);
    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                  = useState(0)

    const [loading_data, set_loading_data]              = useState(true)

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // You can add any other logic you need here, such as making an API call to fetch data for the new page
    };

    const GET__LIST__DATA = async () => {
        set_loading_data(true)
        let api = await API(`aset/senarai-aset?limit=${rowsPerPage}&page=${currentPage}`, {}, "GET")
        console.log("Log Get Senarai Aset : ", api)

        if(api.status_code === 200) {
            set_list_data(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
        }

        set_loading_data(false)
    }

    useEffect(() => {
        GET__LIST__DATA()
    }, [currentPage, rowsPerPage])

    return (
        <div>
            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Aset Inventori</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai aset inventori untuk isntitusi anda.</p>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button onClick={() => navigate("/aset/pendaftaran-aset")} className='bg-teal-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:plus-circle'} className={'text-lg'}/>Daftar Aset
                        </Button>
                    </div>
                </div>
            </section>
            
            {/* <section className='mt-6'>
                <div className=' flex-row justify-between items-center gap-4'>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-lg'>Inventori Aset</p>
                        </div>
                        <div>
                            <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-4 '>
                                <div className='flex items-center space-x-4'>
                                    <p className='text-sm'>Kategori Aset</p>
                                    <Radio  
                                    label={'Institusi'}
                                    checked={kategori}
                                    onChange={val => {
                                        console.log(val.target.checked)
                                        set_kategori(val.target.checked)
                                    }}
                                    name='kategori'
                                    />
                                    <Radio
                                    label={'Waqaf'}
                                    checked={!kategori}
                                    onChange={val => {
                                        console.log(val.target.checked)
                                        set_kategori(!val.target.checked)
                                    }}
                                    name='kategori'
                                    />
                                </div>
                                <div className='flex items-center space-x-4'>
                                    <p className='text-sm'>Jenis Aset</p>
                                    <Radio  
                                    label={'Alih'}
                                    checked={jenis}
                                    onChange={val => {
                                        console.log(val.target.checked)
                                        set_jenis(val.target.checked)
                                    }}
                                    name='jenis'
                                    />
                                    <Radio
                                    label={'Tak Alih'}
                                    checked={!jenis}
                                    onChange={val => {
                                        console.log(val.target.checked)
                                        set_jenis(!val.target.checked)
                                    }}
                                    name='jenis'
                                    />
                                </div>
                                <div className='items-center space-x-4 mt-4'>
                                    <Select 
                                        label={'Kelas Aset'} 
                                        placeholder='-- Sila Pilih Kelas Aset --' 
                                        defaultValue={class_asset} 
                                        options={[
                                        { label: '-- Pilih Kelas Aset --', value: '' },
                                        { label: 'Kenderaan', value: 'Kenderaan' },
                                        { label: 'Hartanah', value: 'Online Banking' },
                                        { label: 'Peralatan Perabot', value: 'Peralatan Perabot'}
                                        ]}
                                        onChange={e => set_class_asset(e.target.value)}
                                    />
                                </div>
                                <div className='items-center space-x-4 mt-4'>
                                    <Select 
                                        label={'Lokasi Aset'} 
                                        placeholder='-- Sila Pilih Lokasi Aset --' 
                                        defaultValue={location_asset} 
                                        options={[
                                        { label: '-- Pilih Lokasi Aset --', value: '' },
                                        { label: 'Pejabat', value: 'Kenderaan' },
                                        { label: 'Bilik Mesyuarat', value: 'Bilik Mesyuarat' },
                                        { label: 'Surau', value: 'Surau'}
                                        ]}
                                        onChange={e => set_location_asset(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className='mt-6 flex flex-row items-center justify-center'>
                        <Button
                            icon="heroicons-outline:magnifying-glass"
                            text="Cari Senarai Aset Inventori"
                            className="btn-primary btn-sm"
                            onClick={() => set_cari(true)}
                        />
                    </div>
                    {cari && (
                    <Card className='mt-6'>
                        <div>
                            <div className='flex flex-row items-center justify-end'>
                                <Select 
                                    label={'bilangan paparan'} 
                                    placeholder='-- Paparan --' 
                                    defaultValue={display} 
                                    options={[
                                    { label: '15', value: '' },
                                    { label: '30', value: '30' },
                                    { label: '60', value: '60' },
                                    { label: '90', value: '90'}
                                    ]}
                                    onChange={e => set_display(e.target.value)}
                                />
                            </div>
                            <div className='mt-6'>
                                <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Bil.</td>
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>No. Tag Aset</td>
                                        <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Model/No.Siri</td>
                                        <td width={'15%'}   className='p-3 font-semibold text-xs text-center'>Nama Aset</td>
                                        <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Lokasi</td>
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Maklumat</td>
                                    </thead>
                                    <tbody className='text-xs p-3'>
                                        {
                                            table_data.map((row, index) => (
                                                <tr className='border border-gray-100 p-3' key={index}>
                                                    <td width={'5%'} className='p-3 font-semibold text-xs text-center'>
                                                        {index +1}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_tag_number}
                                                    </td>
                                                    <td width={'15%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_model}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_name}
                                                    </td>
                                                    <td width={'5%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_lokasi}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                    <button
                                                        onClick={() => navigate(`/aset/maklumat-aset`)}
                                                        className='py-3 px-2'
                                                        >
                                                        <Icons icon={'heroicons-outline:eye'} className={'bg-white text-primary-600 text-xl'} />
                                                    </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='mt-6 '>
                                <div className='text-sm'>
                                    <p className={`text-sm text-gray-500`}>paparan 1 hingga 15 entri</p>
                                </div>
                                <div>
                                    <Pagination
                                    className='flex flex-row items-center justify-end text-sm'
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                    )}
                </div>
            </section> */}

            <section className='mt-6'>
                <Card>
                    {
                        loading_data && (
                            <>
                            <div className='flex justify-center items-center'>
                            <Spinner />
                            </div>
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
                                                        <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Aset Inventori</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Kelas</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Bilangan Unit</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Lokasi</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Daftar</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Status</td>
                                                        <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                                    </thead>
                                                    <tbody className='text-sm p-3'>
                                                        {
                                                            list_data.length < 1 && (
                                                                <tr className='border border-gray-100 p-3'>
                                                                    <td colSpan={10} className='p-3 text-center'>Anda tidak mempunyai senarai aset inventori buat masa sekarang.</td>
                                                                </tr>
                                                            )
                                                        }
                                                        {
                                                            list_data.length > 0 && list_data.map((data, index) => (
                                                                <tr key={index} className='border border-gray-100 p-3'>
                                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{(currentPage - 1) * rowsPerPage + index + 1}.</td>
                                                                    <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.aset_nama}</p>
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
                                                                        <p className='font-normal text-gray-900'>{data.aset_bilangan ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.lokasi_nama ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{moment(data.created_date).format("DD MMM, YYYY")}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip text-center'>
                                                                        {
                                                                            data.status === "Aktif" && (
                                                                                <Badge className=' justify-center items-center bg-emerald-600 text-white'>{data.status}</Badge>
                                                                            )
                                                                        }

                                                                        {
                                                                            data.status === "Dipadam" && (
                                                                                <Badge className=' justify-center items-center bg-red-600 text-white'>{data.status}</Badge>
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                        {
                                                                            data.status !== "Dipadam" && 
                                                                            (
                                                                                <div className=''>
                                                                                    <Button className='' onClick={() => navigate("/aset/maklumat-aset", { state: data })}>
                                                                                        <Icons icon={"heroicons:pencil-square"} width={24} className="text-yellow-500" />
                                                                                    </Button>
                                                                                </div>
                                                                            )
                                                                        }
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

export default InventoriAsset;