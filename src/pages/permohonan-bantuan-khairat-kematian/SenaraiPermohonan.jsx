import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';

SenaraiPermohonan.propTypes = {
    
};

function SenaraiPermohonan(props) {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                = useState(true)
    const [list_data, set_list_data]            = useState([])
    const [root_data, set_root_data]            = useState([])

    const [currentPage, setCurrentPage]         = useState(1);
    const [rowsPerPage, setRowsPerPage]         = useState(10);

    const [totalRows, setTotalRows]             = useState(0) 
    const totalPages                            = Math.ceil(totalRows / rowsPerPage);

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.nama_borang.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_list_data(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_list_data(root_data)
        }
        
    }

    const GET__DATA = async () => {
        set_loading(true)
        let api = await API(`kariah/permohonan-bantuan-khairat/senarai-permohonan?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET")
        console.log("Log Api Get Senarai Permohonan : ", api)

        if(api.status_code === 200) {
            set_list_data(api.data.row)
            set_root_data(api.data.row)
            setTotalRows(api.data.total)
        }

        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }

    useEffect(() => {
        GET__DATA()
    }, [currentPage, rowsPerPage])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Permohonan Bantuan Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai ahli kariah yang berdaftar di bawah institusi anda. Klik pada senarai kariah di bawah untuk melihat maklumat lanjut.</p>  
                    </div>
                    {/* <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                    </div> */}
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
                        onChange={e => SEARCH__DATA(e.target.value)}
                        />
                    </Card>
                </div>
            </section>

            <section className='mt-3'>
                <div>
                    <Card>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-500 text-xs'>Papar {list_data.length} per {rowsPerPage} rekod.</p>
                            </div>
                            <div>
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={(e) => {
                                        setCurrentPage(e.target.value)
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
                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Permohonan</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Rujukan (Arwah)</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Lahir</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm '>Maklumat Penerima</td>
                                    <td width={'12%'} className='p-3 font-semibold text-sm'>Status Permohonan</td>
                                    <td width={'12%'} className='p-3 font-semibold text-sm'>Status Pembayaran</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Tindakan</td>
                                </thead>
                                <tbody className='text-sm p-3'>
                                    {
                                        list_data.length < 1 && (
                                            <tr className='border border-gray-100 p-3'>
                                                <td colSpan={8} className='p-3 text-center'>Anda tidak mempunyai rekod permohonan bantuan khairat kematian buat masa sementara waktu.</td>
                                            </tr>
                                        )
                                    }

                                    {
                                        list_data.length > 0 && list_data.map((data, index) => (
                                            <tr key={index} className='border border-gray-100 p-3'>
                                                <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                <td width={'20%'} className='p-3 font-semibold text-sm text-clip'>
                                                    <p className='font-semibold text-gray-900'>{data.nama_borang}</p>
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                    <p className='font-base text-gray-900'>{data.nama_rujukan_arwah}</p>
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal text-sm'>
                                                <p className='font-normal text-gray-900'>{data.tarikh_lahir_rujukan_arwah ? moment(data.tarikh_lahir_rujukan_arwah).format("DD MMM YYYY") : "-- tiada maklumat --"}</p>
                                                </td>
                                                <td width={'10%'} className='p-3 text-sm'>
                                                    <p className='font-base text-gray-900'>{data.nama_penerima}</p>
                                                    <p className='font-base text-gray-900'>{data.emel_penerima}</p>
                                                </td>
                                                <td width={'12%'} className='p-3 font-normal text-sm'>
                                                    <div className='bg-primary-500 text-white rounded p-1 text-center'>
                                                        <p className='font-normal text-sm text-white'>{data.status_borang ?? '-- tiada maklumat --'}</p>
                                                    </div>
                                                </td>
                                                <td width={'12%'} className='p-3 font-normal text-sm'>
                                                    <div className='bg-gray-500 text-white rounded p-1 text-center'>
                                                        <p className='font-normal text-sm text-white'>{data.status_terima_bayaran ?? '-- tiada maklumat --'}</p>
                                                    </div>
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                    <button onClick={() => navigate("/permohonan-bantuan-khairat/maklumat-permohonan", { state: data })} className='py-3 px-2'>
                                                        <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-600 text-xl'} />
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

            {/* <section className='mt-6'>
                <Card>
                    <pre>
                        {JSON.stringify(list_data, undefined, 4)}
                    </pre>
                </Card>
            </section> */}
        </div>
    );
}

export default SenaraiPermohonan;