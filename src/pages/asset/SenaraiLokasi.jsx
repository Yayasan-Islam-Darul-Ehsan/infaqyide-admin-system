import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import Pagination from "@/components/ui/Pagination";
import Icons from '@/components/ui/Icon';
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { SENARAI__LOKASI } from './senarai-lokasi';
import { API } from '@/utils/api';
import { Spinner } from 'evergreen-ui';
import InputGroup from '@/components/ui/InputGroup';
import moment from 'moment';
import { toast } from 'react-toastify';
import Badge from '@/components/ui/Badge';


function SenaraiLokasi() {

    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()
    const state                                         = useLocation().state

    const [table_data, set_table_data]                  = useState(SENARAI__LOKASI);
    const [table_data1, set_table_data1]                = useState(SENARAI__LOKASI);

    const [display, set_display]                        = useState(null)

    const [list_data, set_list_data]                    = useState([])
    const [root_data, set_root_date]                    = useState([])

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);
    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                  = useState(0)

    const [loading_data, set_loading_data]              = useState(true)
    const [nama_lokasi, set_nama_lokasi]                = useState("")
    const [selected_id, set_selected_id]                = useState(null)

    const [modal_1, set_modal_1]                        = useState(false)
    const [modal_2, set_modal_2]                        = useState(false)
    const [modal_3, set_modal_3]                        = useState(false)

    const open_modal_1                                  = () => set_modal_1(true)
    const open_modal_2                                  = () => set_modal_2(true)
    const open_modal_3                                  = () => set_modal_3(true) 

    const close_modal_1                                 = () => set_modal_1(false)
    const close_modal_2                                 = () => set_modal_2(false)
    const close_modal_3                                 = () => { 
        set_selected_id(null), 
        set_modal_3(false) 
    }

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.lokasi_nama.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_list_data(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_list_data(root_data)
        }
        
    }

    const GET__LIST__DATA = async () => {
        set_loading_data(true)
        let api = await API(`lokasi-aset/senarai-lokasi?limit=${rowsPerPage}&page=${currentPage}`, {}, "GET")
        console.log("Log Get Senarai Lokasi Aset : ", api)

        if(api.status_code === 200) {
            set_list_data(api.data.row)
            set_root_date(api.data.row)
            setTotalRows(api.data.total)
        }

        set_loading_data(false)
    }

    const CREATE__DATA = async () => {

        close_modal_1()
        close_modal_2()

        set_loading_data(false)
        let api = await API("lokasi-aset/daftar-lokasi", { nama_lokasi: nama_lokasi })
        console.log("Log Function Tambah Lokasi : ", api)

        if(api.status_code === 200 ) {
            toast.success(api.message)
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } else {
            toast.error(api.message)
        }
    }

    const DELETE__DATA = async () => {
        close_modal_3()
        let api = await API("lokasi-aset/padam-lokasi", { id_lokasi: selected_id })
        console.log("Log Padam Lokasi : ", api)

        if(api.status_code === 200) {
            toast.success(api.message)
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } else {
            toast.error(api.message)
        }
    }


    useEffect(() => {
        GET__LIST__DATA()
    }, [currentPage, totalRows])

    return (
        <div>

            <Modal
            title='Borang Pendaftaran Maklumat Lokasi Aset'
            themeClass='bg-teal-600'
            activeModal={modal_1}
            onClose={close_modal_1}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end items-center'>
                <Button className='' onClick={close_modal_1}>Tidak</Button>
                <Button className='bg-teal-600 text-white' onClick={open_modal_2}>Ya</Button>
                </div>
                </>
            )}
            >
                <div>
                    <Textinput 
                    label={'Nama Lokasi'}
                    placeholder='Contoh: Pusat Simpanan Surau'
                    defaultValue={nama_lokasi}
                    onChange={e => set_nama_lokasi(e.target.value)}
                    />
                </div>
            </Modal>

            <Modal
            title='Pengesahan Pendaftaran Maklumat Lokasi Baru'
            themeClass='bg-teal-600 text-white'
            activeModal={modal_2}
            onClose={close_modal_2}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end items-center'>
                    <Button className='' onClick={close_modal_2}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={CREATE__DATA}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk menambah maklumat lokasi aset baharu?</p>
            </Modal>

            <Modal
            title='Pengesahan Memadam Maklumat Lokasi'
            themeClass='bg-danger-600 text-white'
            activeModal={modal_3}
            onClose={close_modal_3}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end items-center'>
                    <Button className='' onClick={close_modal_3}>Tidak</Button>
                    <Button className='bg-danger-600 text-white' onClick={DELETE__DATA}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk memadam lokasi aset ini?</p>
            </Modal>

            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Lokasi Aset Inventori</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai lokasi untuk kedudukan aset inventori anda.</p>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button className='bg-teal-600 text-white' onClick={open_modal_1}>Tambah Maklumat Lokasi Baru</Button>
                    </div>
                </div>
            </section>

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
                                    onChange={e => SEARCH__DATA(e.target.value)}
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
                                                        <td width={'30%'} className='p-3 font-semibold text-sm'>Nama Lokasi</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Daftar</td>
                                                        <td width={'5%'} className='p-3 font-semibold text-sm text-center'>Status</td>
                                                        <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                                    </thead>
                                                    <tbody className='text-sm p-3'>
                                                        {
                                                            list_data.length < 1 && (
                                                                <tr className='border border-gray-100 p-3'>
                                                                    <td colSpan={5} className='p-3 text-center'>Anda tidak mempunyai senarai lokasi aset buat masa sekarang.</td>
                                                                </tr>
                                                            )
                                                        }
                                                        {
                                                            list_data.length > 0 && list_data.map((data, index) => (
                                                                <tr key={index} className='border border-gray-100 p-3'>
                                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                    <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>Lokasi - {data.lokasi_nama}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{moment(data.lokasi_created_date).format("DD MMM, YYYY")}</p>
                                                                    </td>
                                                                    {/* <td width={'5%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{data.lokasi_status ?? '-- tiada maklumat --'}</p>
                                                                    </td> */}
                                                                    <td width={'5%'} className='p-3 font-normal text-sm text-clip text-center'>
                                                                        {
                                                                            data.lokasi_status === "Aktif" && (
                                                                                <Badge className=' justify-center items-center bg-emerald-600 text-white'>{data.lokasi_status}</Badge>
                                                                            )
                                                                        }

                                                                        {
                                                                            data.lokasi_status === "Dipadam" && (
                                                                                <Badge className=' justify-center items-center bg-red-600 text-white'>{data.lokasi_status}</Badge>
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                        <button className='' 
                                                                                onClick={() => {
                                                                                    set_selected_id(data.lokasi_id)
                                                                                    open_modal_3()
                                                                                }}>
                                                                            <Icons className={"text-lg text-red-500"} icon={"heroicons:trash"} />
                                                                        </button>
                                                                        {/* <div className=''>
                                                                            <Button 
                                                                                className='btn btn-sm text-sm bg-danger-600 text-white' 
                                                                                onClick={() => {
                                                                                    set_selected_id(data.lokasi_id)
                                                                                    open_modal_3()
                                                                                }}
                                                                            >
                                                                                    Padam Lokasi
                                                                                </Button>
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

export default SenaraiLokasi;