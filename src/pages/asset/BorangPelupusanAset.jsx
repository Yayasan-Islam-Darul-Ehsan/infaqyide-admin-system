import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Loading from '@/components/Loading';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import API_FORM_DATA, { API, API_FORM_DATA_STAGING } from '@/utils/api';
import { toast } from 'react-toastify';
import Textinput from '@/components/ui/Textinput';
import Flatpickr from "react-flatpickr";
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Fileinput from '@/components/ui/Fileinput';
import InputGroup from '@/components/ui/InputGroup';
import Icons from '@/components/ui/Icon';
import Pagination from '@/components/ui/Pagination';
import { Badge, Spinner } from 'evergreen-ui';
import Checkbox from '@/components/ui/Checkbox';

BorangPelupusanAset.propTypes = {
    
};

function BorangPelupusanAset(props) {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()
    const state                                 = useLocation().state


    const [no_rujukan, set_no_rujukan]                                  = useState("")
    const [tarikh_cadangan_pelupusan, set_tarikh_cadangan_pelupusan]    = useState(new Date())
    const [nama_pemohon, set_nama_pemohon]                              = useState("")
    const [phone_pemohon, set_phone_pemohon]                            = useState("")
    const [email_pemohon, set_email_pemohon]                            = useState("")

    const [id_aset, set_id_aset]                                        = useState("")
    const [nama_aset, set_nama_aset]                                    = useState("")
    const [jenis_aset, set_jenis_aset]                                  = useState("")
    const [kategori_aset, set_kategori_aset]                            = useState("")
    const [kelas_aset, set_kelas_aset]                                  = useState("")
    const [lokasi_aset, set_lokasi_aset]                                = useState("")

    const [keadaan_semasa_aset, set_keadaan_semasa_aset]                = useState("")
    const [sebab_untuk_dihapus, set_sebab_untuk_dihapus]                = useState("")
    const [kaedah_penghapusan, set_kaedah_penghapusan]                  = useState("")

    const [file, set_file]                                              = useState(null)
    const [select_file, set_select_file]                                = useState(null)

    const [loading_page, set_loading_page]                              = useState(true)
    const [modal, set_modal]                                            = useState(false)
    const [modal2, set_modal2]                                          = useState(false)

    const [currentPage, setCurrentPage]             = useState(1);
    const [rowsPerPage, setRowsPerPage]             = useState(10);
    const [totalRows, setTotalRows]                 = useState(0) 
    
    const [total_data, set_total_data]              = useState(0)
    const totalPages                                = Math.ceil(totalRows / rowsPerPage);

    const [senarai_item, set_senarai_item]          = useState([])
    const [root_item, set_root_item]                = useState([])
    const [searchValue, setSearchValue]             = useState('');

    const [loading_item, set_loading_item]          = useState(true)

    const [isCheckAll, setIsCheckAll]               = useState(false)
    const [checkID, setCheckID]                     = useState([])

    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const open_modal2   = () => set_modal2(true)
    const close_modal2  = () => set_modal2(false)

    const CREATE__PELUPUSAN__ASET = async () => {

        close_modal()

        let upload_file = await UPLOAD__FILE()

        if(upload_file !== null ) {

            let json = {
                pelupusan_ref_no: no_rujukan,
                tarikh_cadangan_pelupusan: moment(tarikh_cadangan_pelupusan[0]).format("YYYY-MM-DD"),
                sebab_dilupuskan: sebab_untuk_dihapus,
                keadaan_aset: keadaan_semasa_aset,
                tarikh_beli: moment(state.aset_tarikh_beli).format("YYYY-MM-DD HH:mm:ss"),
                nama_pemohon: nama_pemohon,
                no_pemohon: phone_pemohon,
                email_pemohon: email_pemohon,
                penerangan_aset: state.aset_keterangan,
                aset_unit_no: state.aset_model,
                aset_nilai_belian: state.aset_nilai,
                kaedah_dilupuskan: kaedah_penghapusan,
                gambar_rujukan: upload_file,
                ...state,
            }
    
            let api = await API("pelupusan/daftar-pelupusan-aset", json)
            console.log("Log Daftar Pelupusan Aset", api)
    
            if(api.status_code === 200) {
                toast.success(api.message)
                console.log(moment(tarikh_cadangan_pelupusan).format("YYYY-MM-DD"));
                setTimeout(() => {
                    navigate("/aset/senarai-pelupusan-aset")
                }, 1000);
            } else {
                toast.error(api.message)
            }
        }

    }

    const CREATE__PELUPUSAN__ASET__TERPILIH = async () => {
        
        close_modal2()

        let upload_file = await UPLOAD__FILE()

        if(upload_file !== null ) {

            let json = {
                pelupusan_ref_no: no_rujukan,
                tarikh_cadangan_pelupusan: moment(tarikh_cadangan_pelupusan).format("YYYY-MM-DD"),
                sebab_dilupuskan: sebab_untuk_dihapus,
                keadaan_aset: keadaan_semasa_aset,
                tarikh_beli: moment(state.aset_tarikh_beli).format("YYYY-MM-DD"),
                nama_pemohon: nama_pemohon,
                no_pemohon: phone_pemohon,
                email_pemohon: email_pemohon,
                penerangan_aset: state.aset_keterangan,
                aset_unit_no: state.aset_model,
                aset_nilai_belian: state.aset_nilai,
                kaedah_dilupuskan: kaedah_penghapusan,
                gambar_rujukan: upload_file,
                jenis_pelupusan: "Terpilih",
                aset_item: checkID,
                ...state,
            }
    
            let api = await API("pelupusan/daftar-pelupusan-aset", json)
            console.log("Log Daftar Pelupusan Aset", api)
    
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate("/aset/senarai-pelupusan-aset")
                }, 1000);
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

    const GET__SENARAI_ITEM_ASET = async () => {

        set_loading_item(true)

        let api = await API(`item-aset/senarai-item/${state.aset_id}?page=${currentPage}&limit=${rowsPerPage}&status=Active`, {}, "GET")
        //let api = await API(`item-aset/senarai-item/${state.aset_id}?page=1&limit=20`, {}, "GET")
        console.log("Log Get Senarai Item : ", api)

        if(api.status_code === 200) {
            set_senarai_item(api.data.row)
            set_total_data(api.data.total)
            setTotalRows(api.data.total)
        }

        setTimeout(() => {
            set_loading_item(false)    
        }, 1000);
        
    }

    const CARI_ITEM_ASET = async () => {

        set_loading_item(true)

        let api = await API(`item-aset/cari-item?page=${currentPage}&limit=${rowsPerPage}`, { aset_id: state.aset_id, string: searchValue }, "POST")
        console.log("Log Cari Senarai Item : ", api)

        if(api.status_code === 200) {
            set_senarai_item(api.data.row)
            set_total_data(api.data.total)
            setTotalRows(api.data.total)
        }

        set_loading_item(false)         
    }

    const _onCheckBox = (item_id) => {

        console.log("Log Item ID : ", item_id)

        let currentArr  = checkID
        let newArr      = []
        if(checkID.length === 0) {
            newArr.push(item_id)
            setCheckID(newArr)
        } else {

            let find = checkID.find(e => e === item_id)
            console.log("Find Item : ", find)

            if(find) {
                setCheckID(checkID.filter(e => e !== item_id))
            } else {
                //currentArr.push(item_id)
                setCheckID([...checkID, item_id])
            }
        }
    }

    const _checkItemId = (item_id) => {
        if(checkID.find(e => e === item_id)) return true
        else return false
    }

    useEffect(() => {
        set_loading_page(true)

        set_id_aset(state.aset_id)
        set_nama_aset(state.aset_nama)
        set_jenis_aset(state.aset_jenis)
        set_kategori_aset(state.aset_kategori)
        set_kelas_aset(state.aset_kelas)
        set_lokasi_aset(state.lokasi_id)

        setTimeout(() => {
            set_loading_page(false)
        }, 1000);
    }, [])

    useEffect(() => {
        GET__SENARAI_ITEM_ASET()
    }, [currentPage, rowsPerPage])

    if(loading_page) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Permohonan Pelupusan Aset'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            onClose={close_modal}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={CREATE__PELUPUSAN__ASET}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm tetx-gray-600'>Anda pasti untuk membuat permohonan pelupusan aset?</p>
            </Modal>

            <Modal
            title='Pengesahan Permohonan Pelupusan Aset Dengan Item Terpilih'
            themeClass='bg-teal-600 text-white'
            activeModal={modal2}
            onClose={close_modal2}
            centered={true}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal2}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={CREATE__PELUPUSAN__ASET__TERPILIH}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm tetx-gray-600'>Anda pasti untuk membuat permohonan pelupusan aset dengan item yang dipilih?</p>
            </Modal>

            <section className='mt-6'>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Borang Maklumat Pelupusan Aset</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat borang pelupusan aset di bawah untuk membuat permohonan pelupusan aset baharu.</p>
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
                <Card>
                    <div>
                        <div>
                            <p className='font-semibold text-lg text-gray-900'>Maklumat Permohonan Pelupusan Aset</p>
                            <p className='font-normal text-sm text-gray-600'>Lengkapkan maklumat permohonan pelupusan aset di bawah.</p>
                        </div>
                        <div className='mt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                <div>
                                    <Textinput 
                                    label={"No. Rujukuan"}
                                    placeholder='Contoh: RJ01920391029830192'
                                    description={"Nombor rujukan akan dibuat oleh komputer sewaktu mendaftar permohonan pelupusan aset anda."}
                                    defaultValue={no_rujukan}
                                    onChange={e => set_no_rujukan(e.target.value)}
                                    disabled={true}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="default-picker2" className="form-label">Cadangan Tarikh Pelupusan</label>
                                    {/* <Flatpickr
                                        className="form-control py-2"
                                        value={tarikh_cadangan_pelupusan}
                                        defaultValue={tarikh_cadangan_pelupusan}
                                        onChange={(date) => set_tarikh_cadangan_pelupusan(date)}
                                        id="default-picker2"
                                        style={{ background: "white" }}
                                    /> */}
                                    <Flatpickr
                                        className="form-control py-2"
                                        style={{ backgroundColor: '#ffffff' }}
                                        value={tarikh_cadangan_pelupusan}
                                        onChange={(date) => {
                                            console.log("Log Start Date : ", date[0])
                                            console.log('Log Formatted Start Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                            set_tarikh_cadangan_pelupusan(new Date(date[0]))
                                        }}
                                        id="default-picker"
                                    />
                                </div>
                                <div>
                                    <Textarea 
                                        label={"Sebab Untuk Dihapuskan"}
                                        placeholder={"Contoh: Barang-barang ini telah rosak dan tidak boleh digunakan lagi"}
                                        dvalue={sebab_untuk_dihapus}
                                        onChange={e => set_sebab_untuk_dihapus(e.target.value)}
                                        
                                    />
                                </div>
                                <div>
                                    <Textarea 
                                        label={"Keadaan Semasa Aset"}
                                        placeholder={"Contoh: Meja telah memiliki patah dan tidak boleh digunakan lagi..."}
                                        dvalue={keadaan_semasa_aset}
                                        onChange={e => set_keadaan_semasa_aset(e.target.value)}
                                        
                                    />
                                </div>
                            </div>
                            <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <div>
                                    <Select 
                                    label={"Kaedah Penghapusan Aset"}
                                    placeholder='Contoh: Waqaf atau derma'
                                    defaultValue={kaedah_penghapusan}
                                    options={[
                                        {label: "Dibakar", value: "Dibakar"},
                                        {label: "Waqaf", value: "Wakaf"},
                                        {label: "Dijual kepada umum", value: "Dijual kepada umum"},
                                        {label: "Lain-lain", value: "Lain-lain"},
                                    ]}
                                    onChange={e => set_kaedah_penghapusan(e.target.value)}
                                    
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <div>
                            <p className='font-semibold text-lg text-gray-900'>Maklumat Pemohon</p>
                            <p className='font-normal text-sm text-gray-600'>Lengkapkan maklumat pemohon di bawah.</p>
                        </div>
                        <div className='mt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                <div>
                                    <Textinput 
                                    label={"Nama Pemohon"}
                                    placeholder='Contoh: Muhd Akmar Bin Khilmie'
                                    defaultValue={nama_pemohon}
                                    onChange={e => set_nama_pemohon(e.target.value)}
                                    
                                    />
                                </div>
                                <div>
                                    <Textinput 
                                    label={"E-mel Pemohon"}
                                    placeholder='Contoh: akmar@email.com'
                                    defaultValue={email_pemohon}
                                    onChange={e => set_email_pemohon(e.target.value)}
                                    
                                    />
                                </div>
                                <div>
                                    {/* <Textinput
                                        label={'No. Telefon Pemohon'}
                                        placeholder='Contoh: 0123456789'
                                        defaultValue={phone_pemohon}
                                        onChange={e => set_phone_pemohon(e.target.value)}
                                        type={'number'}
                                        required
                                    /> */}
                                    <Textinput 
                                        name={"No. Phone"}
                                        isMask={true}
                                        register={() => {}}
                                        label={'No. Telefon'}
                                        placeholder='Contoh: 60123456789'
                                        defaultValue={phone_pemohon}
                                        onChange={e => {
                                            set_phone_pemohon(e.target.value)
                                        }}
                                        type={"number"}
                                        pattern="^[0-9]{1,12}$" 
                                        inputMode="numeric" 
                                        maxLength={12} 
                                        max={12}
                                        isNumberOnly
                                    />
                                    {/* <Textinput 
                                    name={"No. Phone"}
                                    isMask={true}
                                    register={() => {}}
                                    label={"No. Telefon Pemohon"}
                                    placeholder='Contoh: 0123456789'
                                    defaultValue={phone_pemohon}
                                    onChange={e => {

                                        let val = e.target.value

                                        if(isNaN(val)) {
                                            e.preventDefault()
                                        } else {
                                            set_phone_pemohon(val)
                                        }
                                    }}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                    maxLength={15}
                                    required
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-lg text-gray-900'>Gambar atau Dokumen Sokongan</p>
                        <p className='font-normal text-sm text-gray-600'>Sila sertakan gambar atau dokumen sokongan untuk membuat pelupusan aset anda sebagai bukti.</p>
                    </div>
                    <div className='mt-6'>
                        <label htmlFor="" className='form-label'>Gambar atau Dokumen Sokongan </label>
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
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-lg text-gray-900'>Maklumat Aset</p>
                        <p className='font-normal text-sm text-gray-600'>Berikut adalah maklumat aset yang ingin dihapuskan.</p>
                    </div>
                    <div className='mt-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div>
                                <Textinput 
                                label={"Nama Aset"}
                                defaultValue={state.aset_nama}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Kategori Aset"}
                                defaultValue={state.aset_kategori}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Jenis Aset"}
                                defaultValue={state.aset_jenis}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Kelas Aset"}
                                defaultValue={state.aset_kelas}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Lokasi Aset"}
                                defaultValue={state.lokasi_nama}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Model Aset"}
                                defaultValue={state.aset_model}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Nilai Aset (RM)"}
                                defaultValue={"RM " + parseFloat(state.aset_nilai).toFixed(2)}
                                disabled={true}
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Bilangan Aset"}
                                defaultValue={state.aset_bilangan}
                                disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Aset Item</p>
                        <p className='font-normal text-gray-500 text-sm'>Berikut adalah maklumat aset item invetori yang akan didaftarkan berdasarkan kuantiti aset dan nama aset anda di atas.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                CARI_ITEM_ASET()
                            }}>
                            <InputGroup
                                name={"Search"}
                                className='bg-gray-100 w-full md:w-[300px]'
                                type="text"
                                prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                                placeholder='Carian.....'
                                merged
                                register={() => {}}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            </form>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-500 text-sm'>Papar {senarai_item.length} per {total_data} rekod.</p>
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
                    </div>
                    <div>
                        <div className='mt-6'>
                            <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                    <td>
                                        <p className='py-3 pl-3'>
                                        {/* <Checkbox 
                                            value={isCheckAll} 
                                            onChange={(e) => {
                                                console.log(e.target.checked)
                                                setIsCheckAll(e.target.checked === true ? true : false)
                                            }} 
                                        /> */}
                                        </p>
                                    </td>
                                    <td className='p-3 font-semibold text-sm'>Bil.</td>
                                    <td className='p-3 font-semibold text-sm'>No. Inventori</td>
                                    <td className='p-3 font-semibold text-sm'>Nama Aset</td>
                                    <td className='p-3 font-semibold text-sm'>Nama Item Aset</td>
                                    <td className='p-3 font-semibold text-sm text-center'>Harga Per Unit (RM)</td>
                                    <td className='p-3 font-semibold text-sm'>Status</td>
                                </thead>
                                <tbody className='text-sm p-3'>
                                    {
                                        loading_item && (
                                            <tr>
                                                <td colSpan={5} className='flex justify-center items-center'><Spinner /></td>
                                            </tr>
                                        )
                                    }
                                    {
                                        !loading_item && senarai_item.length < 1 && (
                                            <tr>
                                                <td colSpan={5} className='font-normal text-gray-900'>-- tiada item aset dijumpai --</td>
                                            </tr>
                                        )
                                    }
                                    {
                                        !loading_item && senarai_item.length > 0 && senarai_item.map((item, index) => (
                                            <tr key={index} className='border border-gray-100 p-3 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                                <td className='text-center'>
                                                    <p className='py-3 pl-3 text-center'>
                                                        <Checkbox 
                                                            value={_checkItemId(item.item_id)} 
                                                            onChange={() => _onCheckBox(item.item_id)}
                                                        />
                                                    </p>
                                                </td>
                                                <td className='p-3 font-normal text-sm'>{(currentPage - 1) * rowsPerPage + index + 1}.</td>
                                                <td className='p-3 font-normal text-sm text-clip'>
                                                    <p className='font-normal text-gray-900'>{item.item_code}</p>
                                                </td>
                                                <td className='p-3 font-normal text-sm text-clip'>
                                                    <p className='font-normal text-gray-900'>{state.aset_nama}</p>
                                                </td>
                                                <td className='p-3 font-normal text-sm text-clip'>
                                                    <p className='font-normal text-gray-900'>{item.item_name}</p>
                                                </td>
                                                <td className='p-3 font-normal text-sm text-center'>
                                                    <p className='font-normal text-gray-900'>{parseFloat(state.aset_nilai).toFixed(2)}</p>
                                                </td>
                                                <td className='p-3 font-normal text-sm text-clip'>
                                                    {
                                                        item.item_status === "Active" && <Badge color="green">Aktif</Badge>
                                                    }
                                                    {
                                                        item.item_status === "Delete" && <Badge intent="red">Tidak Aktif</Badge>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {/* {
                                        !loading_item && (
                                            <tr className='border border-gray-100 p-3'>
                                                <td colSpan={4} className='p-3 font-semibold text-lg'>Jumlah (RM)</td>
                                                <td colSpan={1} className='p-3 font-semibold text-lg'>RM {parseFloat(unit_number * unit_value).toFixed(2)}</td>
                                            </tr>
                                        )
                                    } */}
                                </tbody>
                            </table>
                            {/* <div>
                                <p>
                                    <pre>
                                        {JSON.stringify(checkID, undefined, 4)}
                                    </pre>
                                </p>
                            </div> */}
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='bg-teal-600 text-white' onClick={open_modal2}>Mohon Pelupusan Aset Terpilih</Button>
                    <Button className='bg-teal-600 text-white' onClick={open_modal}>Mohon Pelupusan Semua Aset</Button>
                </div>
            </section>

        </div>
    );
}

export default BorangPelupusanAset;