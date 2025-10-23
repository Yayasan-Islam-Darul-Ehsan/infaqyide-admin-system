import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

SenaraiTabung.propTypes = {
    
};

function SenaraiTabung(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading, set_loading]                        = useState(true)
    const [list_tabung, set_list_tabung]                = useState([])
    const [root_list_tabung, set_root_list_tabung]      = useState([])

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);
    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                  = useState(0)

    const [modal,set_modal]         = useState(false)
    const [modal_id, set_modal_id]  = useState(null)

    const open_modal = (id) => {
        set_modal_id(id)
        set_modal(true)
    }

    const close_modal = () => {
        set_modal_id(null)
        set_modal(false)
    }

    const GET__LIST__TABUNG = async () => {
        set_loading(true)
        let api = await API(`getTabungInstitusi?page=${currentPage}&limit=${rowsPerPage}`, { org_id: user.user ? user.user.id : user.id })
        console.log("Log Get List Tabung : ", api)

        if(api.status_code === 200) {
            set_list_tabung(api.data.row)
            set_root_list_tabung(api.data.row)
            set_total_data(api.data.total)
            setTotalRows(api.data.total)
        }

        set_loading(false)
    }

    const SEARCH__DATA = (search_string = "") => {

        if(root_list_tabung.length > 0) {

            let filtered_data = root_list_tabung.filter(item => item.tabung_name.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_list_tabung(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_list_tabung(root_list_tabung)
        }
        
    }

    const DELETE__TABUNG = async () => {

        set_modal(false)
        set_loading(true)

        let json = { tabung_id: modal_id }
        let api = await API("deleteTabung", json)
        console.log("Log Function Delete Tabung : ", api)

        set_loading(false)

        if(api.status_code === 200) {
            toast.success(api.message)
            setTimeout(() => {
                navigate(0)
            }, 500);
        } else {
            toast.error(api.message)
        }

    }

    useEffect(() => {
        GET__LIST__TABUNG()
    }, [currentPage, rowsPerPage])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Memadam Maklumat Tabung'
            activeModal={modal}
            centered={true}
            themeClass='bg-red-600 text-white'
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-red-600 text-white' onClick={DELETE__TABUNG}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-500'>Anda pasti untuk padam maklumat tabung ini?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Senarai Tabung Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai senarai tabung institusi anda.</p>  
                    </div>
                    <div>
                        <Button className='bg-teal-600 text-white' onClick={() => navigate("/tabung/tambah-tabung")}>Tambah Tabung Institusi</Button>
                    </div>
                </div>
            </section>

            {/* <section className='mt-6'>
            <Card>
                <div>
                    {JSON.stringify(list_tabung)}
                </div>
            </Card>
            </section> */}

            {/* <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>

                    <Button className='h-[250px] w-full rounded-lg shadow-sm bg-white flex flex-col justify-center items-center'>
                        <div><Icons icon={'heroicons:plus-circle'} className={'mr-3'} width={24} /></div>
                        <div><p>Tambah Tabung</p></div>
                    </Button>

                    {
                        list_tabung.length > 0 && list_tabung.map((data, index) => (
                            <Button key={index} className='h-[250px] w-full flex rounded-lg shadow-sm bg-white border border-teal-600'>
                                <div className=''>
                                    <p>{data.tabung_name}</p>
                                </div>
                            </Button>
                        ))
                    }
                </div>
            </section> */}

            <section className='mt-6'>
                <div>
                    <Card>
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
                                                <p className='text-gray-500 text-sm'>Papar {list_tabung.length} per {totalRows} rekod.</p>
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
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Tabung</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Keterangan Tabung</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Baki Terkini Tabung (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Koleksi Tabung (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis Tabung</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                                <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    list_tabung.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={6} className='p-3 text-center'>Anda tidak mempunyai senarai tabung buat masa sekarang.</td>
                                                        </tr>
                                                    )
                                                }
                                                {
                                                    list_tabung.length > 0 && list_tabung.map((data, index) => (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.tabung_name}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.tabung_desc ?? '-- tiada maklumat --'}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{Intl.NumberFormat('ms-MY', {style: 'currency', currency: 'MYR'}).format(data.tabung_balance)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{Intl.NumberFormat('ms-MY', {style: 'currency', currency: 'MYR'}).format(data.collection_amount)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.tabung_type}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                <p className={`font-semibold ${data.tabung_status == 1 ? 'text-emerald-600' : 'text-red-600'}`}>{data.tabung_status == 1 ? 'Aktif' : 'Tidak Aktif'}</p>
                                                            </td>
                                                            <td width={'10%'} className='w-full p-3 font-normal flex flex-row gap-6 justify-center items-center'>
                                                                <button className='' onClick={() => navigate("/tabung/maklumat-tabung", { state: data })}>
                                                                    <Icons className={"text-lg text-yellow-500"} icon={"heroicons:pencil-square"} />
                                                                </button>
                                                                {/* <button className='' onClick={() => navigate("/tabung/tambah-nilai", { state: data })}>
                                                                    <Icons className={"text-lg text-teal-600"} icon={"heroicons:plus-circle"} />
                                                                </button> */}
                                                                <button className='' onClick={() => open_modal(data.tabung_id)}>
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
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default SenaraiTabung;