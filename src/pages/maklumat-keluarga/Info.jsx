import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useWidth from '@/hooks/useWidth';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { Alert, toaster } from 'evergreen-ui';
import { toast } from 'react-toastify';

InfoMaklumatKeluargaKariah.propTypes = {
    
};

function InfoMaklumatKeluargaKariah(props) {

    const { width, breakpoints }        = useWidth();


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages]   = useState(6);
    const [tanggungan, set_tanggungan]  = useState(sessionStorage.getItem("tanggungan") ? JSON.parse(sessionStorage.getItem("tanggungan")) : [])
    const [modal, set_modal]            = useState(false)

    const [nama_tanggungan, set_nama_tanggungan]            = useState("")
    const [hubungan_tanggungan, set_hubungan_tanggungan]    = useState("")
    const [umur_tanggungan, set_umur_tanggungan]            = useState("")
    const [status_tanggungan, set_status_tanggungan]        = useState("")

    const [alert, set_alert]                                = useState(false)

    const add_hubungan = () => {

        if(nama_tanggungan === "" || hubungan_tanggungan === "" || umur_tanggungan === "") {
            set_alert(true)
            setTimeout(() => {
                set_alert(false)
            }, 3000);
        } else {

            set_alert(false)

            let array = tanggungan
            array.push({
                nama_penuh: nama_tanggungan,
                hubungan: hubungan_tanggungan,
                umur: umur_tanggungan,
                status: 'Aktif'
            })

            sessionStorage.setItem("tanggungan", JSON.stringify(array))

            set_hubungan_tanggungan(array)

            set_nama_tanggungan("")
            set_hubungan_tanggungan("")
            set_umur_tanggungan("")
            set_status_tanggungan("")

            set_modal(false)
        }
    }

    return (
        <div>

            <Modal
            activeModal={modal}
            title='Borang Tambah Tanggungan'
            uncontrol={false}
            onClose={() => set_modal(false)}
            footerContent={(
                <Button 
                    onClick={add_hubungan} 
                    className='bg-teal-500 text-white text-xs'
                >
                    Tambah Tanggungan
                </Button>
            )}
            >
                <div>
                    {
                        alert && (
                            <Alert 
                            className='mb-3'
                            title='Maklumat Tidak Lengkap'
                            intent='danger'
                            >
                                Ralat! Sila pastikan maklumat tanggungan anda telah lengkap.
                            </Alert>
                        )
                    }

                    <div>
                        <Textinput 
                        label={'Nama Penuh Tanggungan'}
                        placeholder='Contoh: Firdaus Fazil'
                        onChange={e => set_nama_tanggungan(e.target.value)}
                        />
                    </div>
                    <div className='mt-3'>
                        <Textinput 
                        label={'Hubungan Tanggungan'}
                        placeholder='Contoh: Anak Kandung'
                        onChange={e => set_hubungan_tanggungan(e.target.value)}
                        />
                    </div>
                    <div className='mt-3'>
                        <Textinput 
                        label={'Umur Tanggungan'}
                        placeholder='Contoh: 21 Tahun'
                        type={'number'}
                        onChange={e => set_umur_tanggungan(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Keluarga</p>  
                        <p className={`text-xs text-gray-500`}>Berikut adalah senarai maklumat tanggungan keluarga anda. Anda boleh menyemak dan menamhbah tanggungan mengikut keperluan.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button className='bg-white items-center gap-2'><Icons icon={'heroicons:folder-arrow-down'} /> Export</Button>
                        <Button className='bg-white items-center gap-2'><Icons icon={'heroicons:printer'} /> Print</Button>
                        <Button className='bg-teal-500 text-white items-center gap-2' onClick={() => set_modal(true)}><Icons icon={'heroicons:plus-circle'} /> Tambah Tanggungan</Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className=''>
                    <Card className='flex'>
                        {/* <Textinput 
                            hasicon={true}
                            icon={'heroicons:magnifying-glass'}
                            className='bg-gray-100 w-full md:w-[300px]'
                            placeholder='Carian.....'
                        /> */}
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
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-500 text-xs'>Papar {currentPage} per {totalPages} rekod.</p>
                            </div>
                            <div>
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                />
                            </div>
                            <div>
                                <Select 
                                placeholder='-- Jumlah Rekod --'
                                options={[
                                    { label: 10, value: 10},
                                    { label: 20, value: 20},
                                    { label: 50, value: 50},
                                    { label: 100, value: 100},
                                    { label: 'Semua', value: 'All'}
                                ]}
                                />
                            </div>
                        </div>

                        <div className='mt-3'>
                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                    <td width={'5%'} className='p-3 font-semibold text-xs'>Bil.</td>
                                    <td width={'40%'} className='p-3 font-semibold text-xs'>Nama Penuh</td>
                                    <td width={'20%'} className='p-3 font-semibold text-xs'>Hubungan</td>
                                    <td width={'10%'} className='p-3 font-semibold text-xs'>Umur</td>
                                    <td width={'10%'} className='p-3 font-semibold text-xs'>Status</td>
                                    <td width={'10%'} className='p-3 font-semibold text-xs'>Tindakan</td>
                                </thead>
                                <tbody className='text-xs p-3'>
                                    {
                                        tanggungan.length < 1 && (
                                            <tr className='border border-gray-100 p-3'>
                                                <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai tanggungan buat masa ini.</td>
                                            </tr>
                                        )
                                    }

                                    {
                                        tanggungan.length > 0 && tanggungan.map((data, index) => (
                                            <tr key={index} className='border border-gray-100 p-3'>
                                                <td width={'5%'} className='p-3 font-normal text-xs'>{index + 1}</td>
                                                <td width={'40%'} className='p-3 font-semibold text-xs'>{data.nama_penuh}</td>
                                                <td width={'20%'} className='p-3 font-normal text-xs'>{data.hubungan}</td>
                                                <td width={'10%'} className='p-3 font-normal text-xs'>{data.umur}</td>
                                                <td width={'10%'} className='p-3 font-normal text-xs'>{data.status}</td>
                                                <td width={'10%'} className='p-3 font-normal text-xs'>
                                                    -- tiada --
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
        </div>
    );
}

export default InfoMaklumatKeluargaKariah;