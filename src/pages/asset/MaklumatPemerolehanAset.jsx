import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textinput from '@/components/ui/Textinput';
import Flatpickr from "react-flatpickr";
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Loading from '@/components/Loading';
import { API, API_FORM_DATA_STAGING } from '@/utils/api';
import moment from 'moment';
import { toast } from 'react-toastify';
import Fileinput from '@/components/ui/Fileinput';
import { DISTRICT, NEGERI, POSTCODE } from './constant-senarai-negeri-dan-daerah';
import { EditIcon, Spinner, SquareIcon, TrashIcon } from 'evergreen-ui';

MaklumatPemerolehanAset.propTypes = {
    
};

function MaklumatPemerolehanAset(props) {

    const state                                         = useLocation().state
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading_page, set_loading_page]              = useState(true)

    const [requestor_date, set_requestor_date]          = useState(new Date());
    const [delivery_date, set_delivery_date]            = useState(new Date());

    const [requestor_number, set_requestor_number]      = useState("")
    const [requestor_name, set_requestor_name]          = useState("")
    const [requestor_email, set_requestor_email]        = useState("")
    const [requestor_phone, set_requestor_phone]        = useState("")
    const [email, set_email]                            = useState("")
    const [vendor, set_vendor]                          = useState("")
    const [telephone1, set_telephone1]                  = useState("")
    const [telephone2, set_telephone2]                  = useState("")
    const [address, set_address]                        = useState("")
    const [city, set_city]                              = useState("")
    const [negeri, set_state]                           = useState("")
    const [postcode, set_postcode]                      = useState("")
    const [fax, set_fax]                                = useState("")
    const [asset_name, set_asset_name]                  = useState("")
    const [asset_desc, set_asset_desc]                  = useState("")
    const [quantity, set_quantity]                      = useState("")
    const [price_unit, set_price_unit]                  = useState("")
    const [unit_measurement, set_unit_measurement]      = useState("")
    const [quotation, set_quotation]                    = useState("")
    const [purpose, set_purpose]                        = useState("")
    const [status_permohonan, set_status_permohonan]    = useState("Proses Pengesahan")
    const [gambar_rujukan, set_gambar_rujukan]          = useState("")

    const [file, set_file]                              = useState(null)
    const [select_file, set_select_file]                = useState(null)

    const [opt_for_negeri, set_opt_for_negeri]          = useState(NEGERI)
    const [opt_for_daerah, set_opt_for_daerah]          = useState([])
    const [opt_for_postcode, set_opt_for_postcode]      = useState([])

    const [loading_address, set_loading_address]        = useState(false)

    const [addressLine1, setAddressLine1]               = useState('');
    const [addressLine2, setAddressLine2]               = useState('');
    const [addressLine3, setAddressLine3]               = useState('');


    const [modal, set_modal]    = useState(false)
    const open_modal            = () => set_modal(true)
    const close_modal           = () => set_modal(false)

    const opt_for_status = [
        { label: 'Proses Pengesahan', value: 'Proses Pengesahan' },
        { label: 'Penghantaran Barang', value: 'Penghantaran Barang' },
        { label: 'Berjaya Diterima', value: 'Berjaya Diterima' },
        { label: 'Selesai', value: 'Selesai' },
        { label: 'Lewat Penghantaran', value: 'Lewat Penghantaran' },
        { label: 'Dibatalkan', value: 'Dibatalkan' },
        { label: 'Tidak Berjaya', value: 'Tidak Berjaya' },
    ]

    const GET__DATA = async () => {
        set_loading_page(true)
        let api = await API(`pemerolehan/senarai-pemerolehan-aset/${state.pemerolehan_id}`, {})
        console.log("Log Api Get Maklumat Pemerolehan : ", api)

        if(api.status_code === 200) {

            console.log("Log Response Data : ", api.data)

            set_requestor_date(new Date(moment(api.data.requestor_date)))
            set_delivery_date(new Date(moment(api.data.tarikh_penghantaran)))
            set_requestor_number(api.data.pemerolehan_ref_no)
            set_requestor_name(api.data.nama_pemohon)
            set_requestor_email(api.data.emel_pemohon)
            set_requestor_phone(api.data.telefon_pemohon)
            set_email(api.data.emel_pembekal)
            set_vendor(api.data.nama_pembekal)
            set_telephone1(api.data.telefon_1_pembekal)
            set_telephone2(api.data.telefon_2_pembekal)
            // set_address(api.data.alamat_pembekal)
            setAddressLine1(api.data.alamat_pembekal.split(',')[0] || '')
            setAddressLine2(api.data.alamat_pembekal.split(',')[1] || '')
            setAddressLine3(api.data.alamat_pembekal.split(',')[2] || '')
            set_city(api.data.city)
            set_state(api.data.state)
            set_postcode(api.data.postcode)
            set_fax(api.data.faks_pembekal)
            set_asset_name(api.data.nama_aset)
            set_asset_desc(api.data.keterangan_aset)
            set_quantity(api.data.kuantiti_aset )
            set_price_unit(api.data.harga_unit_aset)
            set_unit_measurement(api.data.ukuran_aset)
            set_quotation(api.data.sebut_harga_aset)
            set_purpose(api.data.tujuan_pembelian)
            set_status_permohonan(api.data.status_permohonan)
            set_gambar_rujukan(api.data.gambar_rujukan)

            if(api.data.city) {
                //set_opt_for_daerah(POSTCODE[data.org_state].name)
                
                let array_city      = []
                let array_postcode  = []

                let basic = POSTCODE.state.filter(item => item.name === api.data.state)[0].city

                for (let i = 0; i < basic.length; i++) {
                    array_city.push({
                        label: basic[i].name,
                        values: basic[i].name,
                    })

                    if(api.data.city === basic[i].name) {
                        let default_arr = basic.filter(item => item.name === api.data.city)
                        for (let j = 0; j < default_arr[0].postcode.length; j++) {
                            array_postcode.push(default_arr[0].postcode[j])                        
                        }
                    }
                }

                set_opt_for_daerah(array_city)
                set_opt_for_postcode(array_postcode)
            }
                        
        }

        setTimeout(() => {
            set_loading_page(false)
        }, 500);
    }

    const UPDATE__DATA = async () => {
        close_modal()

        if(file && select_file) {

            let upload_file = await UPLOAD__FILE()
            const full_address = `${addressLine1}, ${addressLine2}, ${addressLine3}`;
            let json = {
                pemerolehan_id: state.pemerolehan_id,
                pemerolehan_ref_no: requestor_number,
                nama_pemohon: requestor_name,
                emel_pemohon: requestor_email, 
                telefon_pemohon: requestor_phone, 
                nama_pembekal: vendor, 
                emel_pembekal: email, 
                telefon_1_pembekal: telephone1, 
                telefon_2_pembekal: telephone2, 
                faks_pembekal: fax, 
                alamat_pembekal: full_address,
                city: city,
                state: negeri,
                postcode: postcode,  
                nama_aset: asset_name, 
                keterangan_aset: asset_desc, 
                kuantiti_aset: quantity, 
                harga_unit_aset: price_unit, 
                ukuran_aset: unit_measurement || "",
                sebut_harga_aset: parseFloat(quotation), 
                tarikh_penghantaran: moment(delivery_date[0]).format("YYYY-MM-DD"), 
                tujuan_pembelian: purpose, 
                gambar_rujukan: upload_file, 
                status_permohonan: status_permohonan
            }
    
            let api = await API("pemerolehan/kemaskini-pemerolehan-aset", json)
            console.log("Log Api Kemaskini Pemerolehan Aset : ", api)
    
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate("/aset/senarai-pemerolehan-aset")
                }, 500);
            } else {
                toast.error(api.message)
            }

        } 
        else 
        {
            const full_address = `${addressLine1}, ${addressLine2}, ${addressLine3}`;
            let json = {
                pemerolehan_id: state.pemerolehan_id,
                pemerolehan_ref_no: requestor_number,
                nama_pemohon: requestor_name,
                emel_pemohon: requestor_email, 
                telefon_pemohon: requestor_phone, 
                nama_pembekal: vendor, 
                emel_pembekal: email, 
                telefon_1_pembekal: telephone1, 
                telefon_2_pembekal: telephone2, 
                faks_pembekal: fax, 
                alamat_pembekal: full_address, 
                city: city,
                state: negeri,
                postcode: postcode, 
                nama_aset: asset_name, 
                keterangan_aset: asset_desc, 
                kuantiti_aset: quantity, 
                harga_unit_aset: price_unit, 
                ukuran_aset: unit_measurement || "", 
                sebut_harga_aset: parseFloat(quotation), 
                tarikh_penghantaran: moment(delivery_date[0]).format("YYYY-MM-DD"), 
                tujuan_pembelian: purpose, 
                gambar_rujukan: null, 
                status_permohonan: status_permohonan
            }
    
            let api = await API("pemerolehan/kemaskini-pemerolehan-aset", json)
            console.log("Log Api Kemaskini Pemerolehan Aset : ", api)
    
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate("/aset/senarai-pemerolehan-aset")
                }, 500);
            } else {
                toast.error(api.message)
            }
        }
    }

    const UPLOAD__FILE = async () => {
        let result = null 

        if(file === null) {
            toast.error("Sila pastikan anda sertakan gambar atau dokumen sokongan sebagai bukti.")
            result = null
        } else {

            let form_data = [
                { title: 'file', value: file[0] }
            ]

            let api = await API_FORM_DATA_STAGING("file-uploader", form_data)
            console.log("Log Api Upload File : ", api)

            if(api.status_code === 200) {
                result = api.data
            } else {
                result = null
                toast.error(api.message)
            }
        }

        return result
    }

    useEffect(() => {
        GET__DATA()
    }, [])

    if(loading_page) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Kemaskini Maklumat Pemerolehan Aset'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={UPDATE__DATA}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-600'>Anda pasti untuk meneruskan kemaskini maklumat pemerolehan aset?</p>
            </Modal>

            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Pemerolehan Aset</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat pemerolehan aset.</p>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='flex-row justify-between items-center gap-4'>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-lg'>Maklumat Pemerolehan Aset</p>
                            <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan borang dibawah untuk membuat permohonan pemerolehan aset.</p>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-4'>
                            <div>
                                <Textinput
                                    label={'No. Permohonan'}
                                    placeholder='Contoh: AJ918293182178923'
                                    description={"Sila isi nombor rujukan permohonan pemerolehan aset anda untuk keperluan sistem Al-Jariyah."}
                                    defaultValue={requestor_number}
                                    onChange={e => set_requestor_number(e.target.value)}
                                    type={'text'}
                                />
                            </div>
                            <div>
                                <label htmlFor="default-picker1" className="form-label">
                                Tarikh Pemerolehan / Pembelian Aset <span className='text-red-700'>*</span>
                                </label>
                                <Flatpickr
                                    className="form-control py-2"
                                    value={requestor_date}
                                    onChange={(date) => set_requestor_date(date)}
                                    id="default-picker1"
                                    style={{ background: "white" }}
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'Nama Pemohon'}
                                    placeholder='Contoh: Mohd Afiq Bin Iskandar'
                                    defaultValue={requestor_name}
                                    onChange={e => set_requestor_name(e.target.value)}
                                    type={'text'}
                                    required
                                /> 
                            </div>
                            <div>
                                <Textinput
                                    label={'E-mel Pemohon'}
                                    placeholder='Contoh: mohd_afiq_iskandar@email.com'
                                    defaultValue={requestor_email}
                                    onChange={e => set_requestor_email(e.target.value)}
                                    type={'text'}
                                    required
                                /> 
                            </div>
                            <div>
                                <Textinput
                                    name={"Phone"}
                                    isMask={true}
                                    register={() => {}}
                                    label={'No. Telefon Pemohon'}
                                    placeholder='Contoh: 0123456789'
                                    defaultValue={requestor_phone}
                                    onChange={e => set_requestor_phone(e.target.value)}
                                    type={'number'}
                                    required
                                    maxLength={12}
                                    isNumberOnly
                                /> 
                            </div>
                            <div>
                                <Select 
                                label={"Status Permohonan"}
                                placeholder='Contoh: Proses Permohonan'
                                defaultValue={status_permohonan}
                                options={opt_for_status}
                                onChange={e => set_status_permohonan(e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>
                    <Card className='mt-6'>
                        <div>
                            <p className='font-semibold text-gray-900 text-lg'>Maklumat Vendor / Pembekal</p>
                            <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat vendor atau pembekal di bawah.</p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-1 gap-3 mt-4'>
                            <div>
                                <Textinput
                                    label={'Nama Vendor / Pembekal'}
                                    placeholder='Contoh: Kedai Sri Murni Sdn. Bhd.'
                                    defaultValue={vendor}
                                    onChange={e => set_vendor(e.target.value)}
                                    type={'text'}
                                    required
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-2 gap-3 mt-4'>
                            <div>
                                <Textinput
                                    label={'E-mel Vendor / Pembekal'}
                                    placeholder='Contoh: kedaisrimurni@email.com'
                                    defaultValue={email}
                                    onChange={e => set_email(e.target.value)}
                                    type={'text'}
                                    required
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'No. Telefon 1'}
                                    placeholder='Contoh: 0123456789'
                                    defaultValue={telephone1}
                                    onChange={e => set_telephone1(e.target.value)}
                                    type={'number'}
                                    required
                                    name={"Phone1"}
                                    isMask={true}
                                    isNumberOnly
                                    maxLength={12}
                                    register={() => {}}
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'No. Telefon 2'}
                                    placeholder='Contoh: 0123456789'
                                    defaultValue={telephone2}
                                    onChange={e => set_telephone2(e.target.value)}
                                    type={'number'}
                                    name={"Phone2"}
                                    isMask={true}
                                    isNumberOnly
                                    maxLength={12}
                                    register={() => {}}
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'Faks'}
                                    placeholder='Contoh: 60128377'
                                    defaultValue={fax}
                                    onChange={e => set_fax(e.target.value)}
                                    type={'number'}
                                    name={"Fax"}
                                    isMask={true}
                                    isNumberOnly
                                    maxLength={12}
                                    register={() => {}}
                                />
                            </div>
                        </div>
                        <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                            <Textinput
                                label={'Alamat 1'}
                                placeholder='Contoh: Jalan 11'
                                defaultValue={addressLine1}
                                //disabled={disabled_editing}
                                onChange={e => setAddressLine1(e.target.value)}
                                required
                            />
                            <Textinput
                                label={'Alamat 2'}
                                placeholder='Contoh: Datuk Panglima Garang'
                                defaultValue={addressLine2}
                                //disabled={disabled_editing}
                                onChange={e => setAddressLine2(e.target.value)}
                                
                            />
                            <Textinput
                                label={'Alamat 3'}
                                placeholder='Contoh: Hulu Selangor, 12345 Selangor, Malaysia'
                                defaultValue={addressLine3}
                                //disabled={disabled_editing}
                                onChange={e => setAddressLine3(e.target.value)}
                                
                            />
                        </div>

                        <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-3'>

                            {
                                loading_address && (
                                <>
                                    <div className='col-span-1 justify-center items-center'>
                                        <Spinner />
                                    </div>
                                </>
                                )
                            }

                            {
                                !loading_address && (
                                    <>
                                        <Select 
                                            label={'Poskod'}
                                            placeholder='-- Sila Pilih Poskod --'
                                            defaultValue={postcode}
                                            options={opt_for_postcode}
                                            onChange={e => set_postcode(e.target.value)}
                                            required
                                        />
                                        
                                        <Select 
                                            label={'Bandar'}
                                            placeholder='-- Sila Pilih Daerah --'
                                            defaultValue={city}
                                            options={opt_for_daerah}
                                            required
                                            onChange={e => {

                                                set_loading_address(true)

                                                let array_postcode  = []
                                                let city            = e.target.value

                                                set_city(city)
                                                set_postcode("")
                                                
                                                let basic       = POSTCODE.state.filter(item => item.name === negeri)[0].city
                                                let default_arr = basic.filter(item => item.name === city)
                                                console.log("Log Change City For Postcode : ", default_arr)
                                                
                                                array_postcode.push({
                                                    label: "-- Sila Pilih --",
                                                    value: ""
                                                })
                                                for (let j = 0; j < default_arr[0].postcode.length; j++) {
                                                    array_postcode.push(default_arr[0].postcode[j])                        
                                                }

                                                set_opt_for_postcode(array_postcode)

                                                setTimeout(() => {
                                                    set_loading_address(false)
                                                }, 500);
                                            }}
                                        />

                                        <Select 
                                            label={'Negeri'}
                                            placeholder='-- Sila Pilih Negeri --'
                                            defaultValue={negeri}
                                            options={opt_for_negeri}
                                            required
                                            onChange={e => {

                                                set_loading_address(true)

                                                set_state(e.target.value)
                                                set_city("")
                                                set_postcode("")

                                                let array = []
                                                let basic = POSTCODE.state.filter(item => item.name === e.target.value)[0]
                                                console.log("Log List Daerah : ", basic)

                                                array.push({
                                                    label: "-- Sila Pilih --",
                                                    value: ""
                                                })
                                                for (let i = 0; i < basic.city.length; i++) {
                                                    array.push({
                                                        label: basic.city[i].name,
                                                        value: basic.city[i].name
                                                    })
                                                    
                                                }
                                                set_opt_for_daerah(array)

                                                setTimeout(() => {
                                                    set_loading_address(false)
                                                }, 500);
                                            }}
                                        />
                                        
                                    </>
                                )
                            }
                        </div>
                    </Card>
                    <Card className='mt-6'>
                        <div className=''>
                            <p className='font-semibold text-gray-900 text-lg' >Maklumat Aset</p>
                            <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat aset yang ingin diperoleh di bawah. Sila pastikan semua maklumat adalah tepat dan benar.</p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-1 gap-3 mt-4'>
                            <div>
                                <Textinput
                                    label={'Nama Aset'}
                                    placeholder='Contoh: Perabot masjid, buku-buku yang berkaitan dengan kegunaan pejabat...'
                                    defaultValue={asset_name}
                                    onChange={e => set_asset_name(e.target.value)}
                                    type={'text'}
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
                                    label={'Keterangan Aset'}
                                    placeholder='Contoh: Perabot dan buku log masjid yang diperlukan untuk membuat kerja-kerja pengurusan masjid...'
                                    dvalue={asset_desc}
                                    onChange={e => set_asset_desc(e.target.value)}
                                    type={'text'}
                                    required
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
                            <div>
                                <Textinput
                                    label={'Kuantiti'}
                                    placeholder='Contoh: 10 unit'
                                    defaultValue={quantity}
                                    onChange={e => set_quantity(e.target.value)}
                                    type={'number'}
                                    required
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'Harga Unit (RM)'}
                                    placeholder='Contoh: RM10.00'
                                    defaultValue={price_unit}
                                    onChange={e => set_price_unit(e.target.value)}
                                    type={'number'}
                                    required
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'Unit Ukuran'}
                                    placeholder='Contoh: 12cm X 50cm'
                                    defaultValue={unit_measurement}
                                    onChange={e => set_unit_measurement(e.target.value)}
                                    type={'text'}
                                    
                                />
                            </div>
                            <div>
                                <Textinput
                                    label={'Jumlah Sebut Harga'}
                                    placeholder='Contoh: RM50.00'
                                    defaultValue={quotation}
                                    onChange={e => set_quotation(e.target.value)}
                                    type={'number'}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="default-picker1" className="form-label">Tarikh Penghantaran</label>
                                <Flatpickr
                                    className="form-control py-2"
                                    value={delivery_date}
                                    onChange={(date) => set_delivery_date(date)}
                                    id="default-picker1"
                                    style={{ background: "white" }}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-1 gap-3 mt-4'>
                            <div>
                                <Textarea
                                    label={'Tujuan Pembelian'}
                                    placeholder="Contoh: Tujuan pembelian aset ini adalah untuk kegunaan masjid serta kegunaan pejabat yang diperlukan untuk membantu kerja-kerja seharian pengurusan masjid."
                                    dvalue={purpose}
                                    onChange={e => set_purpose(e.target.value)}
                                    type="text"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>
                        {
                            gambar_rujukan && (
                                <div className='mt-6'>
                                    <label htmlFor="" className='form-label'>Gambar atau Dokumen Lama</label>
                                    <div>
                                        <a href={gambar_rujukan} target='blank' className='font-normal text-sm text-blue-600 underline'>{gambar_rujukan}</a>
                                    </div>
                                </div>
                            )
                        }
                        <div className='mt-6'>
                            <label htmlFor="" className='form-label'>Gambar atau Dokumen Sokongan</label>
                            <Fileinput 
                            name={'Click here to upload file'}
                            label='Click here to upload file'
                            placeholder='Contoh: gambar_perabot_rosak_2024.jpeg'
                            selectedFile={select_file}
                            onChange={e => {
                                set_file(e.target.files)
                                set_select_file(e.target.files[0])
                            }}
                            />
                        </div>
                    </Card>
                    
                    <div>
                        <div className='mt-6 flex flex-row items-center justify-end'>
                            <Button className='bg-teal-600 text-white' onClick={open_modal}>Kemaskini Maklumat Permerolehan Aset</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MaklumatPemerolehanAset;