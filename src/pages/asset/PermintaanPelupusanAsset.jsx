import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Icons from '@/components/ui/Icon';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import { Spinner } from 'evergreen-ui';
import moment from 'moment';

function PermintaanPelupusanAsset() {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()
    const state                                 = useLocation().state

    const [loading_page, set_loading_page]      = useState(true)

    const [class_asset, set_class_asset]        = useState(null)
    const [location_asset, set_location_asset]  = useState(null)
    const [file, setFile]                       = useState(null)

    const [lokasi, set_lokasi]                  = useState("")
    const [kategori, set_kategori]              = useState("")
    const [jenis, set_jenis]                    = useState("")
    const [kelas, set_kelas]                    = useState("")

    const [loading_data, set_loading_data]      = useState(false)
    const [data, set_data]                      = useState([])

    const [opt_for_lokasi, set_opt_for_lokasi]  = useState([])

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

    const LIST__LOKASI = async () => {
        set_loading_page(true)
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
            set_opt_for_lokasi(array)
        }
        set_loading_page(false)
    }

    const CARI__ASET = async () => {
        set_loading_data(true)
        let json = {
            kategori: kategori,
            jenis: jenis,
            kelas: kelas,
            lokasi: lokasi
        }
        let api = await API("aset/cari-aset", json)
        console.log("Log Cari Aset Lokasi : ", api)

        if(api.status_code === 200) {
            set_data(api.data)
        }

        setTimeout(() => {
            set_loading_data(false)
        }, 1000);
    }

    useEffect(() => {
        LIST__LOKASI()
    }, [])

    if(loading_page) return <Loading />

    return (
        <div>
            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Permohonan Pelupusan Aset Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah borang permohonan pelupusan aset.</p>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='flex-row justify-between items-center gap-4'>
                    <Card>
                        <div> 
                            <div>
                                <p className='font-semibold text-lg text-gray-900'>Carian Aset Untuk Pelupusan</p>
                                <p className='font-normal text-sm text-gray-600'>Sila buat carian aset anda dengan melengkapkan maklumat aset anda di bawah.</p>
                            </div>
                        </div>
                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 '>
                                <div className=''>
                                    <Select 
                                    label={"Kategori Aset"}
                                    placeholder='Contoh: Institusi, Waqaf...'
                                    defaultValue={kategori}
                                    options={[
                                        {label: 'Institusi', value: 'Institusi'},
                                        {label: 'Waqaf', value: 'Wakaf'},
                                    ]}
                                    onChange={e => set_kategori(e.target.value)}
                                    // required
                                    />
                                </div>
                                <div className=''>
                                    <Select 
                                    label={"Jenis Aset"}
                                    placeholder='Contoh: Barang Tidak Alih'
                                    defaultValue={jenis}
                                    options={[
                                        { label: 'Boleh Alih', value: 'Boleh Alih' },
                                        { label: 'Tidak Boleh Alih', value: 'Tidak Boleh Alih' },
                                    ]}
                                    onChange={e => set_jenis(e.target.value)}
                                    // required
                                    />
                                </div>
                                <div className=''>
                                    <Select 
                                        label={"Kelas Aset"}
                                        placeholder='Contoh: Perabot'
                                        defaultValue={kelas}
                                        options={jenis === "Boleh Alih" ? KATEGORI_ASET_ALIH : KATEGORI_ASET_TIDAK_ALIH}
                                        onChange={e => set_kelas(e.target.value)}
                                        disabled={jenis === "" ? true : false}
                                        // required
                                    />
                                </div>
                                <div className=''>
                                    <Select 
                                        label={'Lokasi Aset'} 
                                        placeholder='-- Sila Pilih Lokasi Aset --' 
                                        defaultValue={lokasi} 
                                        options={opt_for_lokasi}
                                        onChange={e => set_lokasi(e.target.value)}
                                        // required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-6 flex flex-row items-center justify-center'>
                            <Button className='bg-teal-600 text-white flex gap-1 items-center' onClick={CARI__ASET}>
                                <Icons icon={"heroicons:magnifying-glass"} width={20} />
                                <p>Cari Aset Anda</p>
                            </Button>
                        </div>
                    </Card>
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
                        !loading_data && data.length < 1 && (
                            <>
                            <div className='flex justify-center items-center'>
                                <p className='text-gray-600 text-sm'>Sila buat carian aset anda terlebih dahulu atau anda tidak mempunyai sebarang aset buat masa sekarang.</p>
                            </div>
                            </>
                        )
                    }

                    {
                        !loading_data && data.length > 0 && (
                            <>
                            <div className=''>
                                <p className='text-gray-600 text-sm'>
                                    <div>
                                        <p className='font-semibold text-lg text-gray-900'>Senarai Aset</p>
                                        <p className='font-normal text-sm text-gray-600'>Klik pada senarai aset untuk membuat permohonan pelupusan aset.</p>
                                    </div>
                                    <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                        <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                            <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Aset Inventori</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Kategori</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Kelas</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Bilangan Unit</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Lokasi</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Daftar</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                            <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                data.length > 0 && data.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.aset_nama}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.aset_kategori ?? '-- tiada maklumat --'}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.aset_jenis ?? '-- tiada maklumat --'}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.aset_kelas ?? '-- tiada maklumat --'}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.aset_bilangan ?? '-- tiada maklumat --'}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.lokasi_nama ?? '-- tiada maklumat --'}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{moment(data.created_date).format("DD MMM, YYYY")}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.status ?? '-- tiada maklumat --'}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                            <div className=''>
                                                                <Button 
                                                                className='btn btn-sm text-sm bg-danger-600 text-white' 
                                                                onClick={() => {
                                                                    navigate("/aset/borang-pelupusan-aset", { state: data })
                                                                }}>
                                                                    Mohon Pelupusan
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </p>
                            </div>
                            </>
                        )
                    }
                </Card>
            </section>

            {/* <section className='mt-6'>
                <div className='flex-row justify-between items-center gap-4'>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-sm'>Borang Permohonan Pelupusan Aset</p>
                            <p className='font-normal text-gray-600 text-xs'>Sila lengkapkan borang dibawah untuk membuat permintaan pelupusan aset.</p>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'>
                            <div>
                                <label htmlFor="default-picker1" className="form-label">
                                Tarikh Beli
                                </label>
                                <Flatpickr
                                    className="form-control py-2"
                                    value={request_date}
                                    onChange={(date) => set_request_date(date)}
                                    id="default-picker1"
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'No. Permohonan'}
                                    placeholder=''
                                    defaultValue={request_number}
                                    onChange={e => set_request_number(e.target.value)}
                                    type={'text'}
                                    readonly
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'>
                            <div>
                                <Textinput
                                    label={'Nama Pemohon'}
                                    placeholder=''
                                    defaultValue={request_name}
                                    onChange={e => set_request_name(e.target.value)}
                                    type={'text'}
                                    readonly
                                /> 
                            </div>
                            <div>
                                <label htmlFor="default-picker2" className="form-label">
                                    Tarikh Cadangan Pelupusan
                                </label>
                                <Flatpickr
                                    className="form-control py-2"
                                    value={disposal_date}
                                    onChange={(date) => set_disposal_date(date)}
                                    id="default-picker2"
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'>
                            <div>
                                <Textarea
                                    label="Penerangan Aset"
                                    placeholder=" "
                                    defaultValue={aset_explanation}
                                    onChange={e => set_aset_explanation(e.target.value)}
                                    type="text"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <Textarea
                                    label="Keadaan Aset"
                                    placeholder=" "
                                    defaultValue={aset_condition}
                                    onChange={e => set_aset_condition(e.target.value)}
                                    type="text"
                                    rows="4"
                                />
                            </div>
                        </div>
                        <div className='mt-6'>
                            <div className='flex grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'>
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
                                        label={'Model / No.Siri'}
                                        placeholder='contoh: xxxxxxxxx'
                                        defaultValue={unit_model}
                                        onChange={e => set_unit_model(e.target.value)}
                                        type={'number'}
                                        readonly
                                    />
                                </div>
                            </div>
                            <div className='flex grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'>
                                <div>
                                    <Textinput
                                        label={'Nilai Belian Aset'}
                                        placeholder='contoh: RM10'
                                        defaultValue={aset_value}
                                        onChange={e => set_aset_value(e.target.value)}
                                        type={'number'}
                                    />
                                </div>
                                <div>
                                    <Textinput
                                        label={'Nilai Semasa Aset'}
                                        placeholder='contoh: RM10'
                                        defaultValue={aset_current_value}
                                        onChange={e => set_aset_current_value(e.target.value)}
                                        type={'number'}
                                    />
                                </div>
                            </div>
                            <div className='flex grid grid-cols-2 md:grid-cols-2 gap-3 mt-6'> 
                                <div>
                                    <label htmlFor="default-picker3" className="form-label">
                                    Tarikh Pembelian Aset
                                    </label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={aset_purchase_date}
                                        onChange={(date) => set_aset_purchase_date(date)}
                                        id="default-picker3"
                                    />
                                </div>
                            </div>
                            <div className='mt-8'>
                                <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Pilih</td>
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Bil.</td>
                                        <td width={'20%'}   className='p-3 font-semibold text-xs text-center'>No. Tag Aset</td>
                                        <td width={'20%'}   className='p-3 font-semibold text-xs text-center'>Model/No.Siri</td>
                                        <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Nama Unit</td>
                                        <td width={'10%'}   className='p-3 font-semibold text-xs text-center'>Lokasi</td>
                                    </thead>
                                    <tbody className='text-xs p-3'>
                                        {
                                            table_data.map((row, index) => (
                                                <tr className='border border-gray-100 p-3' key={index}>
                                                    <td width={'5%'} className='p-3 font-normal text-xs text-center'>
                                                        <input type="checkbox" onChange={(e) => handleCheckboxChange(e)} />
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-semibold text-xs text-center'>
                                                        {row.id}
                                                    </td>
                                                    <td width={'20%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_tag_number}
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_model}
                                                    </td>
                                                    <td width={'20%'} className='p-3 font-normal text-xs text-center'>
                                                        {row.unit_name}
                                                    </td>
                                                    <td width={'5%'} className='p-3 font-normal text-xs text-center'>
                                                    <select
                                                        value={row.unit_lokasi}
                                                        onChange={(e) => handleLokasiChange(e, row)}
                                                        className='w-full p-2 text-xs text-center'
                                                    >
                                                        <option value="">Select Lokasi</option>
                                                        <option value="Lokasi 1">Pejabat</option>
                                                        <option value="Lokasi 2">Dewan</option>
                                                        <option value="Lokasi 3">Bilik Mesyuarat</option>
                                                    </select>
                                                </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex grid grid-cols-2 md:grid-cols-2 gap-3 mt-8'>
                                <div>
                                <p className='text-gray-900 text-sm'>Sebab untuk dilupuskan</p>
                                    <Radio  
                                        label={'Dinaik taraf kepada versi terkini/baharu'}
                                        checked={sebab === 'naiktaraf'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_sebab('naiktaraf')
                                        }}
                                        name='sebab'
                                    />
                                    <Radio  
                                        label={'Rosak tidak boleh diperbaiki'}
                                        checked={sebab === 'rosak'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_sebab('rosak')
                                        }}
                                        name='sebab'
                                    />
                                    <Radio  
                                        label={'Usang'}
                                        checked={sebab === 'usang'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_sebab('usang')
                                        }}
                                        name='sebab'
                                    />
                                    <Radio  
                                        label={'Dicuri'}
                                        checked={sebab === 'dicuri'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_sebab('dicuri')
                                        }}
                                        name='sebab'
                                    />
                                    <Radio  
                                        label={'Hilang'}
                                        checked={sebab === 'hilang'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_sebab('hilang')
                                        }}
                                        name='sebab'
                                    />
                                    <Radio  
                                        label={'Lain, sila nyatakan'}
                                        checked={sebab === 'lain'}
                                        onChange={val => {
                                            console.log(val.target.checked)
                                            set_sebab('lain')
                                            set_laintext(true)
                                    }}
                                    name='sebab'
                                    color="primary"
                                    />
                                    {sebab === 'lain' && (
                                    <Textarea
                                        className='mt-4'
                                        value={laintext}
                                        onChange={(e) => set_laintext(e.target.value)}
                                        placeholder="Sila nyatakan"
                                    />
                                    )}
                                </div>
                                <div>
                                    <p className='text-gray-900 text-sm'>Kaedah pelupusan</p>
                                    <Radio  
                                        label={'Derma'}
                                        checked={kaedah === 'derma'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_kaedah('derma')
                                        }}
                                        name='kaedah'
                                    />
                                    <Radio  
                                        label={'Dibuang'}
                                        checked={kaedah === 'dibuang'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_kaedah('dibuang')
                                        }}
                                        name='kaedah'
                                    />
                                    <Radio  
                                        label={'Dipadam dari rekod'}
                                        checked={kaedah === 'dipadam'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_kaedah('dipadam')
                                        }}
                                        name='kaedah'
                                    />
                                    <Radio  
                                        label={'Dijual'}
                                        checked={kaedah === 'dijual'}
                                        onChange={val => {
                                        console.log(val.target.checked)
                                        set_kaedah('dijual')
                                        }}
                                        name='kaedah'
                                    />
                                    <Radio  
                                        label={'Lain, sila nyatakan'}
                                        checked={kaedah === 'lain-lain'}
                                        onChange={val => {
                                            console.log(val.target.checked)
                                            set_kaedah('lain-lain')
                                            set_laintext1(true)
                                        }}
                                        name='alasan'
                                        color="secondary"
                                    />
                                        {kaedah === 'lain-lain' && (
                                        <Textarea
                                            className='mt-10'
                                            value={laintext1}
                                            onChange={(e) => set_laintext1(e.target.value)}
                                            placeholder="Sila nyatakan"
                                            rows={7}
                                    />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className='mt-6'>
                        <div>
                        <p className='font-semibold text-gray-900 text-sm'>Muat Naik Dokumen/Gambar</p>
                            <div className='mt-6'>
                                <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                        <td width={'5%'}    className='p-3 font-semibold text-xs text-center'>Bil.</td>
                                        <td width={'70%'}   className='p-3 font-semibold text-xs text-center'>Dokumen/Gambar</td>
                                        <td width={'25%'}   className='p-3 font-semibold text-xs text-center'>Muat Naik</td>
                                    </thead>
                                    <tbody className='text-xs text-center p-3'>
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
                                                        <input type="file" onChange={handleFileChange} />
                                                        {error && <div style={{ color: 'red' }}>{error}</div>}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <p className='text-gray-500 text-sm mt-3'>Saiz fail mestilah tidak melebihi 6MB</p>
                        </div>      
                    </Card>
                    <div className='mt-6 flex flex-row items-center justify-end'>
                        <Button onClick={() => set_hantar(true)}>
                            Hantar
                        </Button>
                    </div>
                </div>
            </section> */}
        </div>
    );
}

export default PermintaanPelupusanAsset;