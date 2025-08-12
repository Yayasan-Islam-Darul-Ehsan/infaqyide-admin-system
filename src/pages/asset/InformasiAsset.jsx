import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Modal from "@/components/ui/Modal";
import Icons from '@/components/ui/Icon';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Flatpickr from "react-flatpickr";
import moment from 'moment';
import Pagination from "@/components/ui/Pagination";
import { REKOD__PENYELENGGARAAN } from './rekod-penyelenggaraan';
import { openModal } from '../app/projects/store';

function InformasiAsset() {

    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()
    const state                                         = useLocation().state

    const [table_data, set_table_data]                  = useState(REKOD__PENYELENGGARAAN);

    const [unit_name, set_unit_name]                    = useState(null)
    const [unit_value, set_unit_value]                  = useState(null)
    const [unit_model, set_unit_model]                  = useState(null)
    const [unit_supplier, set_unit_supplier]            = useState(null)
    const [unit_number, set_unit_number]                = useState(null)
    const [unit_tag_number, set_unit_tag_number]        = useState(null)
    const [additional_info, set_additional_info]        = useState(null)
    const [asset_location, set_asset_location]          = useState(null)
    const [batal, set_batal]                            = useState(null)
    const [simpan, set_simpan]                          = useState(null)
    const [class_asset, set_class_asset]                = useState(null)
    const [asset_info, set_asset_info]                  = useState(null)
    const [service, set_service]                        = useState(null)
    const [condition_asset, set_condition_asset]        = useState(null)

    const [kekerapan, set_kekerapan]                    = useState(false)
    const [isOpen, setIsOpen]                           = useState(false);
    
    const [picker1, setPicker1]                         = useState(new Date());
    const [picker2, setPicker2]                         = useState(new Date());

    const [currentPage, setCurrentPage]                 = useState(1);
    const [totalPages, setTotalPages]                   = useState(5);

    const handleOpenModal = () => {
        setIsOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsOpen(false);
      };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    // You can add any other logic you need here, such as making an API call to fetch data for the new page
  };

    return (
        <div>
            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Aset</p>  
                        <p className={`text-sm text-gray-500`}>Berikut maklumat yang telah didaftar.</p>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className=' flex-row justify-between items-center gap-4'>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-sm'>Maklumat Asset No. XXXXXX</p>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-4'>
                                <div>
                                    <Textinput
                                        label={'Nama Unit'}
                                        placeholder='contoh: Meja'
                                        defaultValue={unit_name}
                                        onChange={e => set_unit_name(e.target.value)}
                                        type={'text'}
                                        readonly
                                    />
                                </div>
                                <div>
                                    <Textinput
                                        label={'Nilai Unit / per unit'}
                                        placeholder='contoh: RM10'
                                        defaultValue={unit_value}
                                        onChange={e => set_unit_value(e.target.value)}
                                        type={'number'}
                                        readonly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="default-picker1" className="form-label">
                                    Tarikh Beli
                                    </label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={picker1}
                                        onChange={(date) => setPicker1(date)}
                                        id="default-picker1"
                                        style={{ background: "white" }}
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-4'>
                                <div>
                                    <Textinput
                                        label={'Model / No.Siri'}
                                        placeholder='contoh: xxxxxxxxx'
                                        defaultValue={unit_model}
                                        onChange={e => set_unit_model(e.target.value)}
                                        type={'number'}
                                        readonly
                                    />
                                </div>
                                <div>
                                    <Textinput
                                        label={'Pengilang / Pembekal'}
                                        placeholder='contoh: Sen Heng'
                                        defaultValue={unit_supplier}
                                        onChange={e => set_unit_supplier(e.target.value)}
                                        type={'text'}
                                        readonly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="default-picker2" className="form-label">
                                    Tempoh Jaminan Berakhir
                                    </label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={picker2}
                                        onChange={(date) => setPicker2(date)}
                                        id="default-picker2"
                                        style={{ background: "white" }}
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-4'>
                                <div>
                                    <Textinput
                                        label={'Bilangan Unit'}
                                        placeholder='contoh: 12'
                                        defaultValue={unit_number}
                                        onChange={e => set_unit_number(e.target.value)}
                                        type={'number'}
                                        readonly
                                    />
                                </div>
                                <div>
                                    <Textinput
                                        label={'No.Tag Aset'}
                                        placeholder='contoh: xxxxxxxxx'
                                        defaultValue={unit_tag_number}
                                        onChange={e => set_unit_tag_number(e.target.value)}
                                        type={'number'}
                                        readonly
                                    />
                                </div>
                                <div className='items-center space-x-4'>
                                    <Select 
                                        label={'Lokasi Aset'} 
                                        placeholder='-- Sila Pilih Lokasi Aset --' 
                                        defaultValue={asset_location} 
                                        options={[
                                        { label: '-- Pilih Kelas Aset --', value: '' },
                                        { label: 'Pejabat', value: 'Pejabat' },
                                        { label: 'Hartanah', value: 'Online Banking' },
                                        { label: 'Peralatan Perabot', value: 'Peralatan Perabot'}
                                        ]}
                                        onChange={e => set_asset_location(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-4'>
                                <div>
                                    <Textarea
                                        label="Keterangan Tambahan"
                                        placeholder=" "
                                        defaultValue={additional_info}
                                        onChange={e => set_additional_info(e.target.value)}
                                        type="text"
                                        rows="4"
                                        readonly
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className='mt-6'>
                        <div>
                            <div className='flex flex-row justify-between items-center gap-4'>
                                <div>
                                    <p className={`font-semibold text-sm `}>Rekod Penyelenggaraan</p>
                                </div>
                                {/* <div className='flex flex-row justify-end'>
                                <Select 
                                    label={'bilangan paparan'} 
                                    placeholder='-- Paparan --' 
                                    defaultValue={class_asset} 
                                    options={[
                                    { label: '15', value: '' },
                                    { label: '30', value: '30' },
                                    { label: '60', value: '60' },
                                    { label: '90', value: '90'}
                                    ]}
                                    onChange={e => set_class_asset(e.target.value)}
                                />
                                </div> */}
                                <div className='flex flex-row gap-3'>
                                    <Button 
                                        className='border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm btn-success btn-sm py-3 px-2'
                                        onClick={() => navigate(`/aset/borang-penyelenggaraan-aset`)}
                                        >
                                        <Icons icon={'heroicons:plus'} className={'text-lg'}/> Tambah
                                    </Button>
                                </div> 
                            </div>
                            <div className='mt-6'>
                                <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Bil.</td>
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Tarikh Penyelenggaraan</td>
                                        <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Perkhidmatan Penyelenggaraan</td>
                                        <td width={'15%'}   className='p-3 font-semibold text-xs text-center'>Kos Penyelenggaraan (RM)</td>
                                        <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Tarikh Penyelenggaraan Seterusnya</td>
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Informasi</td>
                                    </thead>
                                    <tbody className='text-xs p-3'>
                                        {
                                            table_data.map((row, index) => (
                                                <tr className='border border-gray-100 p-3' key={index}>
                                                    <td width={'5%'} className='p-3 font-semibold text-xs text-center'>
                                                        {index +1}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.maintenance_date}
                                                    </td>
                                                    <td width={'15%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.maintenance_service}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.maintenance_cost}
                                                    </td>
                                                    <td width={'5%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.next_maintenance_date}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                        <Modal 
                                                            title='Informasi'
                                                            label={
                                                                <div className="flex items-center">
                                                                  <Icons icon={'heroicons-outline:eye'} className={'bg-white text-primary-600 text-xl'} />
                                                                </div>
                                                              }
                                                            labelClass="btn-outline-none"
                                                            uncontrol
                                                            centered
                                                            className="max-w-5xl"
                                                            themeClass="bg-primary-500"
                                                        >
                                                            <div class="text-base text-slate-600 dark:text-slate-300">
                                                                <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-4'>
                                                                    <div>
                                                                        <label htmlFor="default-picker1" className="form-label">
                                                                        Tarikh Penyelenggaraan
                                                                        </label>
                                                                        <Flatpickr
                                                                            className="form-control py-2"
                                                                            value={picker1}
                                                                            onChange={(date) => setPicker1(date)}
                                                                            id="default-picker1"
                                                                            style={{ background: "white" }}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="default-picker2" className="form-label">
                                                                        Tarikh Penyelenggaraan Seterusnya
                                                                        </label>
                                                                        <Flatpickr
                                                                            className="form-control py-2"
                                                                            value={picker2}
                                                                            onChange={(date) => setPicker2(date)}
                                                                            id="default-picker2"
                                                                            style={{ background: "white" }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-4'>
                                                                    <div>
                                                                        <Textinput
                                                                            label={'Kos Penyelenggaraan (RM)'}
                                                                            placeholder='contoh: RM10'
                                                                            defaultValue={unit_name}
                                                                            onChange={e => set_unit_name(e.target.value)}
                                                                            type={'number'}
                                                                            readonly
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Textinput
                                                                            label={'Perkhidmatan Penyelenggaraan'}
                                                                            placeholder='Baiki Kerusi'
                                                                            defaultValue={service}
                                                                            onChange={e => set_service(e.target.value)}
                                                                            type={'text'}
                                                                            readonly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Modal>
                                                    <button
                                                        className='py-3 px-2'
                                                        >
                                                        <Icons icon={'heroicons-outline:trash'} className={'bg-white text-danger-600 text-xl'} />
                                                    </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex flex-row justify-between items-center gap-4 mt-6'>
                                <div>
                                    <p className={`text-sm text-gray-500 `}>paparan 1 hingga 15 entri</p>
                                </div>
                                <div className='flex flex-row gap-3'>
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
                    <div className='mt-6 flex flex-row gap-3 justify-end'>
                        <Button 
                            className='border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm btn-danger'
                            onClick={() => set_batal(true)}>
                            Batal
                        </Button>
                        <Button 
                            className='border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm btn-primary'
                            onClick={() => set_simpan(true)}>
                            Simpan
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default InformasiAsset;