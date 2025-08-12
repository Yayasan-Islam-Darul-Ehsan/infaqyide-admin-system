import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Modal from "@/components/ui/Modal";
import Icons from '@/components/ui/Icon';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import Flatpickr from "react-flatpickr";
import { SENARAI__ASET } from './senarai-aset';

function SenaraiAsset() {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()
    const state                                 = useLocation().state

    const [kategori, set_kategori]              = useState(false)
    const [jenis, set_jenis]                    = useState(false)
    const [daftar, set_daftar]                  = useState(false)

    const [table_data, set_table_data]          = useState(SENARAI__ASET);

    const [class_asset, set_class_asset]        = useState(null)
    const [unit_name, set_unit_name]            = useState(null)
    const [unit_value, set_unit_value]          = useState(null)
    const [unit_model, set_unit_model]          = useState(null)
    const [unit_supplier, set_unit_supplier]    = useState(null)
    const [unit_number, set_unit_number]        = useState(null)
    const [unit_tag_number, set_unit_tag_number]= useState(null)
    const [additional_info, set_additional_info]= useState(null)
    
    const [picker1, setPicker1]                 = useState(new Date());
    const [picker2, setPicker2]                 = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        const newData = Array(unit_name).fill(0).map((_, index) => ({
          id: index + 1,
          unit_name,
        }));
        set_table_data(newData);
      };

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Aset</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai aset yang telah didaftar.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-sm'>Senarai Aset</p>
                    </div>
                    <div className='mt-6'>
                        <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Bil.</td>
                                <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Status</td>
                                <td width={'20%'}   className='p-3 font-semibold text-xs text-center'>No. Tag Aset</td>
                                <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Nama Unit</td>
                                <td width={'20%'}   className='p-3 font-semibold text-xs text-center'>Model/No.Siri</td>
                                <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Lokasi</td>
                            </thead>
                            <tbody className='text-xs p-3'>
                                {
                                    table_data.map((row, index) => (
                                        <tr className='border border-gray-100 p-3' key={index}>
                                            <td width={'5%'} className='p-3 font-normal text-xs'>
                                                {row.id}
                                            </td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs text-center'>
                                                {row.status}
                                            </td>
                                            <td width={'20%'} className='p-3 font-normal text-xs text-center'>
                                                {row.unit_tag_number}
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                                {row.unit_name}
                                            </td>
                                            <td width={'20%'} className='p-3 font-normal text-xs text-center'>
                                                {row.unit_model}
                                            </td>
                                            <td width={'5%'} className='p-3 font-normal text-xs text-center'>
                                                {row.unit_lokasi}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Card>
                <div className='mt-6 flex flex-row items-center justify-end'>
                    <Button onClick={() => set_daftar(true)}>
                        Daftar
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default SenaraiAsset;