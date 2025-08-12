import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
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

SenaraiAsnaf.propTypes = {
    
};

function SenaraiAsnaf(props) {

    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading, set_loading]                        = useState(true)
    const [senarai_asnaf, set_senarai_asnaf]            = useState([])
    const [root_data, set_root_data]            = useState([])

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);

    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);

    const fetch_asnaf = async (offset, limit) => {
        set_loading(true)
        let api = await API(`kariah/asnaf/list?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET", true)

        if(api.status_code === 200) {
            set_senarai_asnaf(api.data.row)
            set_root_data(api.data.row)
            setTotalRows(api.data.total)
        }
        set_loading(false)
    }

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.name.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_senarai_asnaf(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_senarai_asnaf(root_data)
        }
        
    }

    useEffect(() => {
        fetch_asnaf(currentPage, rowsPerPage)
    }, [currentPage, rowsPerPage])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Maklumat Asnaf</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai asnaf yang telah didaftarkan di bawah pengurusan kariah anda. Klik pada senarai asnaf di bawah untuk keterangan lebih lanjut.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button onClick={() => navigate("/asnaf/create")} className='bg-teal-600 font-medium text-sm text-white'>Tambah Maklumat Asnaf</Button>
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
                        placeholder='Carian nama asnaf.....'
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
                                            <p className='text-gray-500 text-sm'>Papar {senarai_asnaf.length} per {rowsPerPage} rekod.</p>
                                        </div>
                                        <div>
                                            <Pagination
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                handlePageChange={(e) => {
                                                    setCurrentPage(e)
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
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Asnaf</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori Asnaf</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Jantina</td>
                                                {/* <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td> */}
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Daftar</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Tindakan</td>
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    senarai_asnaf.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai asnaf buat masa sementara waktu.</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    senarai_asnaf.length > 0 && senarai_asnaf.map((data, index) => (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.name}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.category_name}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.gender}</p>
                                                            </td>
                                                            {/* <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.status}</p>
                                                            </td> */}
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{moment(data.created_date).format("DD MMM YYYY, hh:mm A")}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                <button onClick={() => navigate("/asnaf/detail", { state: data })} className='py-3 px-2'>
                                                                    <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-500 text-xl'} />
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

export default SenaraiAsnaf;