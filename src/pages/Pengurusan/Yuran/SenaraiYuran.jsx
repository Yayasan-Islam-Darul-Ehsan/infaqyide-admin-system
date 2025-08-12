import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { API } from '@/utils/api';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Loading from '@/components/Loading';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Badge from '@/components/ui/Badge';


SenaraiYuran.propTypes = {
    
};

function SenaraiYuran(props) {

    const navigate                  = useNavigate()
    const { width, breakpoints }    = useWidth()
    
    const [loading, set_loading]                = useState(true)
    const [senarai_yuran, set_senarai_yuran]    = useState([])
    const [root_data, set_root_data]            = useState([])

    const [currentPage, setCurrentPage]         = useState(1);
    const [rowsPerPage, setRowsPerPage]         = useState(10);

    const [totalRows, setTotalRows]             = useState(0) 
    const totalPages                            = Math.ceil(totalRows / rowsPerPage);

    const fetch_yuran = async () => {
        set_loading(true)
        let api = await API(`kariah/yuran/list?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET", true)
        console.log("Senarai yuran",api)
        if(api.status_code === 200) {
            set_senarai_yuran(api.data.row)
            set_root_data(api.data.row)
            setTotalRows(api.data.total)
        }
        set_loading(false)
    }

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.yuran_name.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_senarai_yuran(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_senarai_yuran(root_data)
        }
        
    }

    useEffect(() => {
        fetch_yuran(currentPage, rowsPerPage)
    }, [currentPage, rowsPerPage])

    const get_badge = (status) => {
        if(status === 'Active') {
            return <Badge className='bg-emerald-600 text-white'>Aktif</Badge>
        } 
        else if(status === 'Pending') {
            return <Badge className='bg-yellow-600 text-white'>Dalam Proses</Badge>
        } 
        else if(status === 'Expired') {
            return <Badge className='bg-red-600 text-white'>Tamat Tempoh</Badge>
        } 
        else {
            return <Badge className='bg-gray-600 text-white'>Lain-lain</Badge>
        }
    }

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Yuran Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai yuran khairat kematian. Klik pada senarai yuran di bawah untuk melihat maklumat lanjut.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        {/* <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button> */}
                        <Button className='bg-teal-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm' onClick={() => navigate("/yuran/create")}>
                            Tambah Yuran Khairat
                        </Button>
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
                        placeholder='Carian nama yuran.....'
                        merged
                        onChange={e => SEARCH__DATA(e.target.value)}
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
                                            <p className='text-gray-500 text-sm'>Papar {senarai_yuran.length} per {totalRows} rekod.</p>
                                        </div>
                                        <div>
                                            <Pagination
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                handlePageChange={(e) => {
                                                    set_loading(true)
                                                    setCurrentPage(e)
                                                    //handle_onChange(e, rowsPerPage)
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
                                                set_loading(true)
                                                setRowsPerPage(e.target.value)
                                                //handle_onChange(currentPage, e.target.value)
                                            }}
                                            />
                                        </div>
                                    </div>

                                    <div className='mt-3'>
                                        <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Yuran</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Amaun Yuran (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Jenis Yuran</td>
                                                <td width={'5%'} className='p-3 font-semibold text-sm text-center'>Status</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Tarikh</td>
                                                <td width={'5%'} className='p-3 font-semibold text-sm text-center'>Tindakan</td>
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    senarai_yuran.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang senarai yuran buat masa sementara waktu.</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    senarai_yuran.length > 0 && senarai_yuran.map((data, index) => (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'20%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.yuran_name}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip text-center'>
                                                                <p className='font-normal text-gray-900'>{parseFloat(data.yuran_amount).toFixed(2)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip text-center'>
                                                                <p className='font-normal text-gray-900'>{data.yuran_type}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip text-center'>
                                                                <p className='font-normal text-gray-900'>{get_badge(data.status)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip text-center'>
                                                                <p className='font-normal text-gray-900'>{moment(data.created_date).format("DD MMM YYYY, hh:mm A")}</p>
                                                            </td>
                                                            <td width={'5%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                <button onClick={() => navigate("/yuran/detail", { state: data })} className='py-3 px-2'>
                                                                    <Icons icon={'heroicons-solid:pencil-square'} className={'bg-white text-yellow-500 text-lg'} />
                                                                </button>
                                                                {/* <button onClick={() => navigate("/khairat-kematian/maklumat-khairat-kematian", { state: data })} className='py-3 px-2'>
                                                                    <Icons icon={'heroicons-solid:trash'} className={'bg-white text-danger-500 text-xl'} />
                                                                </button> */}
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

export default SenaraiYuran;