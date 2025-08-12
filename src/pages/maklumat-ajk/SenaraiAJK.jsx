import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { API } from '@/utils/api';
import { Spinner } from 'evergreen-ui';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Icons from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

SenaraiAJK.propTypes = {
    
};

function SenaraiAJK(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading, set_loading]                        = useState(true)
    const [list_data, set_list_data]                    = useState([])
    const [root_list_tabung, set_root_list_tabung]      = useState([])
    

    const [currentPage, setCurrentPage]                                       = useState(1);
    const [rowsPerPage, setRowsPerPage]                                       = useState(10);
    const [totalRows, setTotalRows]                                           = useState(0) 
    const [total_data, set_total_data]                                        = useState(0)
    const totalPages                                                          = Math.ceil(total_data / rowsPerPage);
    

    const [delete_id, set_delete_id]                    = useState(null)
    const [modal_delete, set_modal_delete]              = useState(false)



    const [opt_for_title, set_opt_for_title]            = useState([])

    const GET__LIST__DATA = async () => {
        set_loading(true);
        let api = await API(`getSubUsersByOrganization?orgId=${user.user ? user.user.id : user.id}`, {}, "GET");
        console.log("Log Get List Data : ", api);
    
        if (api.status === 200) {
            const activeData = api.data.filter(item => item.AjkStatus === "Active");
            
            set_list_data(activeData);
            set_root_list_tabung(activeData);
            set_total_data(activeData.length)
        }
    
        set_loading(false);
    };
    

    const SEARCH__DATA = (search_string = "") => {

        if(root_list_tabung.length > 0) {

            let filtered_data = root_list_tabung.filter(item => item.username.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_list_data(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_list_data(root_list_tabung)
        }
        
    }

    const DELETE_AJK = async () => {
        set_modal_delete(false)
        set_loading(true)

        let api = await API("deleteAJK", { subUserId: delete_id }, "POST", true)
        if(api.status_code === 200 || api.status === 200) {
            toast.success("Maklumat hebahan telah berjaya dikemasini.")
            setTimeout(() => {
                navigate(0)
            }, 1000);
        }
        else {
            toast.error(api.message)
            navigate(0)
        }
        set_loading(false)

    }

    const handleDataTableOnChange = (page, rows) => {
        setCurrentPage(page);
        setRowsPerPage(rows);
        const startIndex = (page - 1) * rows;
        const endIndex = startIndex + rows;
        set_list_data(root_list_tabung.slice(startIndex, endIndex));
    };
    
    useEffect(() => {
        GET__LIST__DATA()
    }, [])

    //if(loading) return <Loading />

    return (
        <div>
            <Modal
            labelClass={'bg-danger-600'}
            themeClass='bg-danger-600'
            activeModal={modal_delete}
            uncontrol={false}
            title='Pengesahan Memadam AJK'
            centered={true}
            onClose={() => {
                set_delete_id(null)
                set_modal_delete(false)
            }}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={() => set_modal_delete(false)}>Tutup</Button>
                    <Button onClick={DELETE_AJK} className='bg-danger-600 text-white flex flex-row items-center justify-between gap-1'>
                        <p>Teruskan</p>
                    </Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-900'>Anda pasti untuk memadam maklumat AJK ini? Anda tidak boleh mengundur setelah klik pada butang teruskan di bawah.</p>
            </Modal>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Senarai Ahli Jawatankuasa Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai senarai ahli jawatankuasa untuk institusi anda.</p>  
                    </div>
                    <div>
                        <Button className='bg-teal-600 text-white' onClick={() => navigate("/ajk/tambah-ajk")}>Tambah Senarai AJK Institusi</Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    {
                        loading && (
                            <>
                            <div className='flex justify-center items-center'>
                                <Spinner width={24} size={24} />
                            </div>
                            </>
                        )
                    }

                    {
                        !loading && (
                            <>
                                <InputGroup
                                    className='bg-gray-100 w-full md:w-[300px]'
                                    type="text"
                                    prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                                    placeholder='Carian.....'
                                    merged
                                    onChange={e => SEARCH__DATA(e.target.value)}
                                />
                                <div className='mt-3'>
                                    {
                                        loading === false && (
                                            <>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <p className='text-gray-500 text-sm'>
                                                            Papar {Math.min(list_data.length, rowsPerPage * currentPage)} per {total_data} rekod.
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Pagination
                                                            totalPages={totalPages}
                                                            currentPage={currentPage}
                                                            handlePageChange={(val) => {
                                                                setCurrentPage(val)
                                                                handleDataTableOnChange(val, rowsPerPage)
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
                                                            const newRowsPerPage = e.target.value;
                                                            setRowsPerPage(newRowsPerPage);
                                                            handleDataTableOnChange(currentPage, newRowsPerPage);
                                                        }}
                                                        />
                                                    </div>
                                                </div>
                                                <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                        <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Ahli Jawatankuasa</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Jawatan</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Daftar</td>
                                                        <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                                    </thead>
                                                    <tbody className='text-sm p-3'>
                                                        {
                                                            list_data.length < 1 && (
                                                                <tr className='border border-gray-100 p-3'>
                                                                    <td colSpan={6} className='p-3 text-center'>Anda tidak mempunyai senarai ahli AJK buat masa sekarang.</td>
                                                                </tr>
                                                            )
                                                        }
                                                        {
                                                            list_data.length > 0 && list_data
                                                            .filter(data => data.AjkStatus === 'Active') 
                                                            .map((data, index) => index < rowsPerPage && (
                                                                <tr key={index} className='border border-gray-100 p-3'>
                                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.username}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.role ?? '-- tiada maklumat --'}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{moment(data.createdDate).format("DD MMM, YYYY")}</p>
                                                                    </td>
                                                                    {/* <td width={'10%'} className='p-3 font-normal text-center'>
                                                                        <div className='grid grid-cols-2 gap-3'>
                                                                            <Button className='btn btn-sm text-sm bg-yellow-500 text-white' onClick={() => navigate("/ajk/maklumat-ajk", { state: data })}>Lihat Butiran</Button>
                                                                                <Button 
                                                                                    className='btn btn-sm text-sm bg-danger-600 text-white' 
                                                                                    onClick={() => {
                                                                                        set_delete_id(data.subUserId);
                                                                                        set_modal_delete(true);
                                                                                    }}>
                                                                                    Padam AJK
                                                                                </Button>
                                                                            </div>
                                                                        
                                                                    </td> */}
                                                                    <td width={'10%'} className='w-full p-3 font-normal flex flex-row gap-6 justify-center items-center'>
                                                                        <button className='' onClick={() => navigate("/ajk/maklumat-ajk", { state: data })}>
                                                                            <Icons className={"text-lg text-yellow-500"} icon={"heroicons:pencil-square"} />
                                                                        </button>
                                                                        <button className='' 
                                                                                onClick={() => {
                                                                                    set_delete_id(data.subUserId);
                                                                                    set_modal_delete(true);
                                                                                }}>
                                                                            <Icons className={"text-lg text-red-500"} icon={"heroicons:trash"} />
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
                            </>
                        )
                    }
                </Card>
            </section>
        </div>
    );
}

export default SenaraiAJK;