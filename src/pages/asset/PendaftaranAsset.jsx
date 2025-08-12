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
import { toast } from 'react-toastify';

function PendaftaranAsset() {

    const navigate                                  = useNavigate()
    const { width, breakpoints }                    = useWidth()
    const state                                     = useLocation().state

    const [loading, set_loading]                    = useState(true)

    const [opt_for_category, set_opt_for_category]  = useState([])

    const [lokasi, set_lokasi]                  = useState("")
    const [kategori, set_kategori]              = useState("")
    const [jenis, set_jenis]                    = useState("")
    const [jana, set_jana]                      = useState(false)

    const [table_data, set_table_data]          = useState(SENARAI__ASET);

    const [class_asset, set_class_asset]        = useState("")
    const [unit_name, set_unit_name]            = useState("")
    const [unit_value, set_unit_value]          = useState("")
    const [unit_model, set_unit_model]          = useState("")
    const [unit_supplier, set_unit_supplier]    = useState("")
    const [unit_number, set_unit_number]        = useState("")
    const [unit_tag_number, set_unit_tag_number]= useState("")
    const [additional_info, set_additional_info]= useState("")
    
    const [picker1, setPicker1]                 = useState(new Date());
    const [picker2, setPicker2]                 = useState(new Date());

    const [modal, set_modal]                    = useState(false)
    const open_modal                            = () => set_modal(true)
    const close_modal                           = () => set_modal(false)

    const KATEGORI_ASET_ALIH = [
        { label: "Kenderaan (Kereta, Motorsikal, Lori, Bas)", value: "Kenderaan" },
        { label: "Peralatan Elektronik (Komputer, Telefon bimbit, Tablet, Mesin fotokopi)", value: "Peralatan Elektronik" },
        { label: "Perabot (Meja, Kerusi, Almari, Rak buku)", value: "Perabot" },
        { label: "Peralatan Pejabat (Mesin taip, Pencetak, Mesin pengimbas)", value: "Peralatan Pejabat" },
        { label: "Jentera (Jentolak, Traktor, Penggali)", value: "Jentera" },
        { label: "Inventori (Barang stok, Bahan mentah)", value: "Inventori" },
        { label: "Barang Perhiasan (Emas, Permata, Barang antik)", value: "Barang Perhiasan" }
    ];

    const KATEGORI_ASET_TIDAK_ALIH = [
        { label: "Tanah (Lot tanah pertanian, Lot tanah perumahan, Lot tanah komersial)", value: "Tanah" },
        { label: "Bangunan (Rumah kediaman, Pejabat, Kilang, Gudang)", value: "Bangunan" },
        { label: "Infrastruktur (Jalan raya, Jambatan, Stesen janakuasa)", value: "Infrastruktur" },
        { label: "Tanaman Kekal (Ladang kelapa sawit, Ladang getah)", value: "Tanaman Kekal" },
        { label: "Pembinaan (Pusat komersial, Bangunan kerajaan)", value: "Pembinaan" },
        { label: "Kawasan Pertanian Tetap (Ladang ternakan, Kebun sayur)", value: "Kawasan Pertanian Tetap" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newData = Array(unit_name).fill(0).map((_, index) => ({
          id: index + 1,
          unit_name,
        }));
        set_table_data(newData);
    };

    const GET__LIST__LOKASI = async () => {
        set_loading(true)
        let api = await API("lokasi-aset/senarai-lokasi?page=1&limit=100", {})
        console.log("Log Function Get List Lokasi : ", api)

        if(api.status_code === 200 && api.data.total > 0) {
            let data    = api.data.row
            let array   = []
            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: data[i]["lokasi_nama"],
                    value: data[i]["lokasi_id"]
                })
            }
            set_opt_for_category(array)
        }

        set_loading(false)
    }

    const CREATE__ASET = async () => {
        close_modal()

        let json = {
            nama_aset: unit_name,
            keterangan_aset: additional_info,
            kategori_aset: kategori,
            jenis_aset: jenis,
            kelas_aset: class_asset,
            nilai_unit: unit_value,
            model_aset: unit_model,
            pengilang_aset: unit_supplier,
            bilangan_aset: unit_number,
            tarikh_beli_aset: moment(picker1[0]).format("YYYY-MM-DD"),
            tarikh_tempoh_jaminan: moment(picker2[0]).format("YYYY-MM-DD"),
            notag_aset: unit_tag_number,
            lokasi_id: lokasi
        }

        let api = await API("aset/daftar-aset", json)
        console.log("Log Function Daftar Aset : ", api)

        if(api.status_code === 200) {
            toast.success(api.message)
            setTimeout(() => {
                navigate("/aset/inventori-aset")
            }, 1000);
        } else {
            toast.error(api.message)
        }
    }

    useEffect(() => {
        GET__LIST__LOKASI()
    }, [])

    const PREVIEW__LIST__ITEM = () => {

        let array = []

        for (let i = 1; i <= unit_number; i++) {
            array.push({
                item_no: unit_tag_number + i.toString().padStart(7, '0'),
                aset_name: unit_name,
                item_name: unit_tag_number + unit_name + "___" + i
            })
        }

        return array

    }

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Pendaftaran Aset Inventori'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            onClose={close_modal}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={CREATE__ASET}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-600'>Anda pasti untuk meneruskan pendaftaran aset inventori ini?</p>
            </Modal>

            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Pendaftaran Aset Inventori Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Lengkapkan maklumat aset inventori anda di bawah dan pastikan semua maklumat adalah tepat dan benar.</p>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                    {/* <div>
                        <p className='font-semibold text-lg text-gray-600'>Peringatan!</p>
                    </div> */}
                    <div className=''>
                        <ul className=''>
                            <li className='text-sm text-gray-600'>Semua medan dibawah adalah wajib diisi.</li>
                            {/* <li className='text-sm text-gray-600'>2. Sila pastikan semua maklumat yang diisi adalah tepat dan benar.</li> */}
                        </ul>
                    </div>
                </div>
            </section> 

            <section className='mt-6'>
                <div className=' flex-row justify-between items-center gap-4'>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-lg'>Borang Pendaftaran Aset</p>
                            <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan borang dibawah untuk membuat pendaftaran aset.</p>
                        </div>
                        <div className='mt-4'>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <div>
                                    <Select 
                                    
                                    label={"Kategori Aset"}
                                    placeholder='Contoh: Institusi'
                                    defaultValue={kategori}
                                    options={[
                                        { label: 'Institusi', value: 'Institusi' },
                                        { label: 'Waqaf', value: 'Wakaf' },
                                    ]}
                                    onChange={e => set_kategori(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Select 
                                    
                                    label={"Jenis Aset"}
                                    placeholder='Contoh: Alih'
                                    defaultValue={jenis}
                                    options={[
                                        { label: 'Boleh Alih', value: 'Boleh Alih' },
                                        { label: 'Tidak Boleh Alih', value: 'Tidak Boleh Alih' },
                                    ]}
                                    onChange={e => set_jenis(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Select 
                                    
                                    label={"Lokasi Aset"}
                                    placeholder='Contoh: Pejabat Institusi'
                                    defaultValue={lokasi}
                                    options={opt_for_category}
                                    onChange={e => set_lokasi(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-6'>
                                <div>
                                    <Select 
                                    
                                        label={'Kelas Aset'} 
                                        placeholder='-- Sila Pilih Kelas Aset --' 
                                        description={'Sila buat pilihan jenis aset di atas terlebih dahulu sebelum membuat pilihan kelas aset.'}
                                        defaultValue={class_asset} 
                                        options={jenis === "Boleh Alih" ? KATEGORI_ASET_ALIH : KATEGORI_ASET_TIDAK_ALIH}
                                        onChange={e => set_class_asset(e.target.value)}
                                        disabled={jenis === "" ? true : false}
                                    />
                                </div>
                            </div>
                            
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-6'>
                                <div>
                                    <Textinput
                                    
                                        label={'Nama Aset'}
                                        placeholder='contoh: Meja'
                                        defaultValue={unit_name}
                                        onChange={e => set_unit_name(e.target.value)}
                                        type={'text'}
                                    />
                                </div>
                                <div>
                                    <Textarea
                                    
                                        label="Maklumat Tambahan"
                                        placeholder="Meja ini diperlukan untuk letakkan barang-barang seperti buku, surah yassin dan sebagainya."
                                        dvalue={additional_info}
                                        onChange={e => set_additional_info(e.target.value)}
                                        type="text"
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 gap-6'>
                                <div>
                                    <Textinput
                                        label={'Nilai Unit / per unit'}
                                        placeholder='contoh: RM10'
                                        defaultValue={unit_value}
                                        onChange={e => set_unit_value(e.target.value)}
                                        type={"number"}
                                        pattern="^[0-9]{1,15}$" 
                                        inputMode="numeric" 
                                        maxLength={15} 
                                        max={15}
                                    />
                                </div>
                                <div>
                                    <Textinput
                                    
                                        label={'Model / No.Siri'}
                                        placeholder='contoh: xxxxxxxxx'
                                        defaultValue={unit_model}
                                        onChange={e => set_unit_model(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Textinput
                                    
                                        label={'Pengilang / Pembekal'}
                                        placeholder='contoh: Sen Heng'
                                        defaultValue={unit_supplier}
                                        onChange={e => set_unit_supplier(e.target.value)}
                                        type={'text'}
                                    />
                                </div>
                                <div>
                                    <Textinput
                                    
                                        label={'Bilangan Unit'}
                                        placeholder='contoh: 6'
                                        defaultValue={unit_number}
                                        onChange={e => set_unit_number(e.target.value)}
                                        type={"number"}
                                        pattern="^[0-9]{1,15}$" 
                                        inputMode="numeric" 
                                        maxLength={15} 
                                        max={15}
                                        
                                    />
                                </div>
                                <div>
                                    <Textinput
                                    
                                        label={'No.Tag Aset'}
                                        placeholder='contoh: xxxxxxxxx'
                                        defaultValue={unit_tag_number}
                                        onChange={e => set_unit_tag_number(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="default-picker2" className="form-label">
                                    Tempoh Jaminan Berakhir
                                    </label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={picker2}
                                        defaultValue={picker2}
                                        onChange={(date) => setPicker2(date)}
                                        id="default-picker2"
                                        
                                        style={{ background: "white" }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="default-picker1" className="form-label">Tarikh Beli</label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={picker1}
                                        defaultValue={picker1}
                                        onChange={(date) => setPicker1(date)}
                                        id="default-picker1"
                                        
                                        style={{ background: "white" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className='mt-6 flex flex-row items-center justify-end'>
                        <Button className='bg-teal-600 text-white' onClick={open_modal}>Daftar Maklumat Aset </Button>
                    </div>

                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Aset Item</p>
                        <p className='font-normal text-gray-500 text-sm'>Berikut adalah maklumat aset item invetori yang akan didaftarkan berdasarkan kuantiti aset dan nama aset anda di atas.</p>
                    </div>
                    {
                        ( unit_name == "" || unit_number == 0 || unit_tag_number == "" ) && (
                            <>
                            <div className='mt-6 flex justify-center items-center'>
                                <p className='font-normal text-red-600 text-sm'>Sila lengkapkan maklumat nama, bilangan dan nombor tag aset anda di atas.</p>
                            </div>
                            </>
                        )
                    }
                    {
                        unit_name && unit_number && unit_model && unit_tag_number && (
                            <>
                            <div className='mt-6'>
                                <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                        <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                        <td width={'20%'} className='p-3 font-semibold text-sm'>No. Inventori</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Aset</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Item Aset</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Harga Per Unit (RM)</td>
                                    </thead>
                                    <tbody className='text-sm p-3'>
                                        {
                                            PREVIEW__LIST__ITEM().map((item, index) => index < 10 && (
                                                <tr key={index} className='border border-gray-100 p-3 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                    <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{item.item_no}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{item.aset_name}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{item.item_name}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{parseFloat(unit_value).toFixed(2)}</p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            unit_number > 10 && (
                                                <tr className='border border-gray-100 p-3'>
                                                    <td colSpan={5} className='p-3 font-normal text-sm text-center'>...serta {unit_number - 10} item lagi.</td>
                                                </tr>
                                            )
                                        }
                                        {
                                            unit_number > 10 && PREVIEW__LIST__ITEM().map((item, index) => index + 1 == unit_number && (
                                                <tr key={index} className='border border-gray-100 p-3 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                    <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{item.item_no}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{item.aset_name}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{item.item_name}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{parseFloat(unit_value).toFixed(2)}</p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        <tr className='border border-gray-100 p-3'>
                                            <td colSpan={4} className='p-3 font-semibold text-lg'>Jumlah (RM)</td>
                                            <td colSpan={1} className='p-3 font-semibold text-lg'>{parseFloat(unit_number * unit_value).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </>
                        )
                    }
                </Card>
            </section>
        </div>
    );
}

export default PendaftaranAsset;