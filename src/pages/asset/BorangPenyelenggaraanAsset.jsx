import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Flatpickr from "react-flatpickr";
import Radio from '@/components/ui/Radio';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Modal from "@/components/ui/Modal";
import { SENARAI__ASET } from './senarai-aset';



function BorangPenyelenggaraanAsset() {

    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()
    const state                                         = useLocation().state

    const [picker1, setPicker1]                         = useState(new Date());
    const [picker2, setPicker2]                         = useState(new Date());

    const [unit_name, set_unit_name]                    = useState(null)
    const [service, set_service]                        = useState(null)
    const [condition_asset, set_condition_asset]        = useState(null)
    const [verification, set_verification]              = useState(null)

    const [table_data, set_table_data]                  = useState(SENARAI__ASET)

    const [kekerapan, set_kekerapan]                    = useState(false)
    const [simpan, set_simpan]                          = useState(false)
    
    return (
        <div>
            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Borang Penyelenggaraan Aset</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah borang untuk membuat permohonan penyelenggaraan aset.</p>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='flex-row justify-between items-center gap-4'>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-sm'>Rekod Penyelenggaraan Aset No.</p>
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
                                    />
                                </div>
                                <div>
                                    <Textinput
                                        label={'Perkhidmatan Penyelenggaraan'}
                                        placeholder='Baiki Kerusi'
                                        defaultValue={service}
                                        onChange={e => set_service(e.target.value)}
                                        type={'text'}
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'>
                                <div className='flex items-center space-x-4'>
                                    <p className='text-sm'>Kekerapan Penyelenggaraan</p>
                                    <Radio  
                                    label={'Bulanan'}
                                    checked={kekerapan}
                                    onChange={val => {
                                        console.log(val.target.checked)
                                        set_kekerapan(val.target.checked)
                                    }}
                                    name='kekerapan'
                                    />
                                    <Radio
                                    label={'Tahunan'}
                                    checked={!kekerapan}
                                    onChange={val => {
                                        console.log(val.target.checked)
                                        set_kekerapan(!val.target.checked)
                                    }}
                                    name='kekerapan'
                                    />
                                </div>
                                <div className='items-center space-x-4'>
                                    <Select 
                                        label={'Kondisi Aset'} 
                                        placeholder='-- Sila Pilih Kelas Aset --' 
                                        defaultValue={condition_asset} 
                                        options={[
                                        { label: '-- Pilih Kelas Aset --', value: '' },
                                        { label: 'Kenderaan', value: 'Kenderaan' },
                                        { label: 'Hartanah', value: 'Hartanah' },
                                        { label: 'Peralatan Perabot', value: 'Peralatan Perabot'}
                                        ]}
                                        onChange={e => set_condition_asset(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className='mt-6'>
                        <div>
                            <div className='flex flex-row justify-between items-center gap-4'>
                                <p className='font-semibold text-gray-900 text-sm'>Muat Naik Dokumen/Gambar</p>
                                <Button 
                                    className='border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm btn-success btn-sm'
                                    // onClick={() => navigate(`/aset/informasi-asset`)}
                                    >
                                    <Icons icon={'heroicons:plus'} className={'text-lg'}/> Tambah
                                </Button>
                            </div>
                            <div className='mt-6'>
                                <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className='bg-slate-100 dark:bg-slate-700 p-3 rounded-md'>
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Bil.</td>
                                        <td width={'70%'}   className='p-3 font-semibold text-xs text-center'>Dokumen/Gambar</td>
                                        <td width={'25%'}   className='p-3 font-semibold text-xs text-center'>Muat Naik</td>
                                    </thead>
                                    <tbody className='text-xs p-3'>
                                        {
                                            table_data.map((row, index) => (
                                                <tr className='border border-gray-100 p-3' key={index}>
                                                    <td width={'5%'} className='p-3 font-normal text-xs'>
                                                        {index +1}
                                                    </td>
                                                    <td width={'70%'} className='p-3 font-semibold text-xs text-center'>
                                                        <img src="https://www.ikea.com/my/en/images/products/oerfjaell-swivel-chair-black-vissle-black__0715478_pe730483_s5.jpg?f=xu" 
                                                            alt="Perabot" 
                                                            className="mx-auto" 
                                                        />
                                                    </td>
                                                    <td width={'25%'} className='p-3 font-normal text-xs text-center'>
                                                        <input type="file" onChange={(e) => handleFileUpload(e, row.id)} />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                    <div className='mt-6 flex flex-row items-center justify-end'>
                        <Modal
                            title="Pengesahan"
                            label="Simpan"
                            labelClass="border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm btn-primary"
                            uncontrol
                            centered
                            footerContent={
                            <Button
                                text="Hantar"
                                className="border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm btn-primary btn-sm"
                                onClick={() => {
                                alert("use Control Modal");
                                }}
                            />
                            }
                        >
                            <div>
                                <Textinput
                                    label="Serta Sebab"
                                    placeholder=" "
                                    defaultValue={verification}
                                    onChange={e => set_verification(e.target.value)}
                                    type="text"
                                    rows="4"
                                />
                            </div>
                        </Modal>
                        {/* <Button onClick={() => set_simpan(true)}>
                            Simpan
                        </Button> */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BorangPenyelenggaraanAsset;