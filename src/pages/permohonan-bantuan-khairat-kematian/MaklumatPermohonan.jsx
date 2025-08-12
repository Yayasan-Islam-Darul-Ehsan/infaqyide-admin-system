import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Loading from '@/components/Loading';
import { API, API_FORM_DATA_STAGING } from '@/utils/api';
import Textinput from '@/components/ui/Textinput';
import moment from 'moment';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { toast } from 'react-toastify';
import Fileinput from '@/components/ui/Fileinput';

MaklumatPermohonan.propTypes = {
    
};

function MaklumatPermohonan(props) {

    const state                                 = useLocation().state
    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                            = useState(true)
    const [modal, set_modal]                                = useState(false)
    const [modal2, set_modal2]                              = useState(false)

    const [maklumat_permohonan, set_maklumat_permohonan]    = useState(null)

    const [status_permohonan, set_status_permohonan]    = useState("")
    const [status_pembayaran, set_status_pembayaran]    = useState("")
    const [sebab_status, set_sebab_status]              = useState("")

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const opt_status_borang = [
        { label: 'Dalam Proses', value: 'Dalam Proses' },
        { label: 'Permohonan Diterima', value: 'Permohonan Diterima' },
        { label: 'Permohonan Ditolak', value: 'Permohonan Ditolak' },
        { label: 'Dipadam', value: 'Dipadam' },
        { label: 'Lain-lain', value: 'Lain-lain' }
    ]

    const opt_status_pembayaran = [
        { label: 'Proses Pengesahan', value: 'Proses Pengesahan' },
        { label: 'Dalam Proses Pembayaran', value: 'Dalam Proses Pembayaran' },
        { label: 'Dibayar', value: 'Dibayar' },
        { label: 'Belum Dibayar', value: 'Belum Dibayar' },
        { label: 'Lain-lain', value: 'Lain-lain' }
    ]

    const open_modal_1  = () => set_modal(true)
    const close_modal_1 = () => set_modal(false)

    const open_modal_2  = () => set_modal2(true)
    const close_modal_2 = () => set_modal2(false)

    const GET__DATA = async() => {
        set_loading(true)
        let api = await API(`kariah/permohonan-bantuan-khairat/senarai-permohonan/${state.borang_id}`, {}, "GET")
        console.log("Log Get Maklumat Permohonan : ", api)

        if(api.status_code === 200) {
            set_maklumat_permohonan(api.data)
            set_status_permohonan(api.data.status_borang)
            set_status_pembayaran(api.data.status_terima_bayaran)
        }

        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }

    const KEMASKINI__STATUS = async() => {

        close_modal_1()
        close_modal_2()

        if(!status_permohonan) {
            toast.error("Maklumat status permohonan borang bantuan tidak lengkap. Sila pastikan semua maklumat telah lengkap.")
        }
        else if(!status_pembayaran) {
            toast.error("Maklumat status terima bayaran borang bantuan tidak lengkap. Sila pastikan semua maklumat telah lengkap.")
        }
        else if(!sebab_status) {
            toast.error("Maklumat sebab status borang bantuan tidak lengkap. Sila pastikan semua maklumat telah lengkap.")
        }
        else {
            set_loading(true)

            let upload_file = await UPLOAD__FILE()

            let json = {
                borang_id: state.borang_id,
                status: status_permohonan,
                sebab: sebab_status,
                status_pembayaran: status_pembayaran,
                resit_pembayaran: upload_file ?? null
            }

            let api = await API("kariah/permohonan-bantuan-khairat/kemaskini-permohonan", json)
            console.log("Log Function Update Status Permohonan : ", api)

            set_loading(false)

            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            } else {
                toast.error(api.message)
            }
        }
    }

    const UPLOAD__FILE = async () => {
        let result = null 

        if(selectedFile === null) {

            toast.error("Sila pastikan anda sertakan gambar atau dokumen sokongan sebagai bukti.")
            result = null

        } else {

            let form_data = [
                { title: 'file', value: selectedFile }
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
    }, [state])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            activeModal={modal}
            title='Kemaskini Status Permohonan Bantuan Khairat Kematian'
            themeClass='bg-teal-600 text-white'
            centered={true}
            onClose={close_modal_1}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal_1}>Tutup</Button>
                    <Button className='bg-teal-600 text-white' onClick={() => { close_modal_1(), open_modal_2()}}>Teruskan</Button>
                </div>
                </>
            )}
            >
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <Select 
                        label={"Status Permohonan"}
                        placeholder='Contoh: Sedang Diproses'
                        defaultValue={status_permohonan}
                        options={opt_status_borang}
                        onChange={e => set_status_permohonan(e.target.value)}
                        />
                    </div>
                    <div>
                        <Select 
                        label={"Status Terima Bayaran"}
                        placeholder='Contoh: Sedang Diproses'
                        defaultValue={status_pembayaran}
                        options={opt_status_pembayaran}
                        onChange={e => set_status_pembayaran(e.target.value)}
                        />
                    </div>
                    <div>
                        <Textarea 
                        label={"Sebab"}
                        placeholder={"Contoh: Pengesahan Sah"}
                        dvalue={sebab_status}
                        onChange={e => set_sebab_status(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="" className='form-label'>Muatnaik Resit Bayaran</label>
                        <Fileinput 
                        name={"Muatnaik Fail Resit"}
                        onChange={handleFileChange}
                        selectedFile={selectedFile}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
            activeModal={modal2}
            title='Pengesahan Kemaskini Status Permohonan Bantuan'
            themeClass='bg-teal-600 text-white'
            centered={true}
            onClose={close_modal_2}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={() => { close_modal_2(), open_modal_1() }}></Button>
                    <Button className='bg-teal-600 text-white' onClick={KEMASKINI__STATUS}>Teruskan</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-sm text-gray-500'>Anda pasti untuk mengemaskini status permohonan ini?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Permohonan Bantuan Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat terperinci permohonan bantuan khairat kematian.</p>  
                    </div>
                </div>
            </section> 

            {
                maklumat_permohonan !== null && (
                    <>
                    <section className='mt-6'>
                        <Card>
                            <div>
                                <p className='font-semibold text-lg text-gray-900'>Maklumat Ahli Kariah</p>
                                <p className='font-normal text-sm text-gray-500'>Berikut adalah maklumat kariah</p>
                            </div>
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <Textinput 
                                    label={"No. Ahli Kariah"}
                                    defaultValue={maklumat_permohonan.member_uuid}
                                    disabled={true}
                                />
                                <Textinput 
                                    label={"Nama Penuh Ahli Kariah"}
                                    defaultValue={maklumat_permohonan.full_name}
                                    disabled={true}
                                />
                                <Textinput 
                                    label={"No. Kad Pengenalan"}
                                    defaultValue={maklumat_permohonan.ic_number}
                                    disabled={true}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                />
                                <Textinput 
                                    label={"Jantina"}
                                    defaultValue={maklumat_permohonan.gender}
                                    disabled={true}
                                />
                                <Textinput 
                                    label={"Tarikh Lahir"}
                                    defaultValue={moment(maklumat_permohonan.date_of_birth).format("DD MMMM YYYY")}
                                    disabled={true}
                                />
                                <Textinput 
                                    label={"No. Telefon"}
                                    defaultValue={maklumat_permohonan.phone_number}
                                    disabled={true}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                />
                                <Textinput 
                                    label={"E-mel"}
                                    defaultValue={maklumat_permohonan.email_address}
                                    disabled={true}
                                />
                            </div>
                        </Card>
                    </section>
                    <section className='mt-6'>
                        <Card>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <p className='font-semibold text-lg text-gray-900'>Maklumat Permohonan Bantuan Khairat Kematian</p>
                                    <p className='font-normal text-sm text-gray-500'>Berikut adalah maklumat permohonan bantuan khairat kematian</p>
                                </div>
                                <div>
                                    <Button className='bg-teal-600 text-white' onClick={open_modal_1}>Kemaskini Status Permohonan</Button>
                                </div>
                            </div>
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <Textinput 
                                    label={"Jenis Tanggungan / Pasangan"}
                                    defaultValue={maklumat_permohonan.jenis_rujukan_arwah}
                                    disabled={true}
                                />
                                <Textinput 
                                    label={"Nama Penuh Tanggungan / Pasangan"}
                                    defaultValue={maklumat_permohonan.full_name}
                                    disabled={true}
                                />
                                <Textinput 
                                    label={"Tarikh Lahir"}
                                    defaultValue={moment(maklumat_permohonan.tarikh_lahir_rujukan_arwah).format("DD MMMM YYYY")}
                                    disabled={true}
                                />
                            </div>
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <Textinput 
                                    label={"Nama Permohonan"}
                                    defaultValue={maklumat_permohonan.nama_borang}
                                    disabled={true}
                                />
                            </div>
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <Textarea 
                                    label={"Nama Permohonan"}
                                    dvalue={maklumat_permohonan.keterangan_borang}
                                    disabled={true}
                                />
                            </div>
                            {
                                maklumat_permohonan.sijil_kematian_rujukan_arwah && (
                                    <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                        <label htmlFor="" className='form-label'>Dokumen Sokongan</label>
                                        <a href={maklumat_permohonan.sijil_kematian_rujukan_arwah} className='text-teal-600 underline'>{maklumat_permohonan.sijil_kematian_rujukan_arwah}</a>
                                    </div>
                                )
                            }
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <label htmlFor="" className='form-label'>Status Permohonan</label>
                                <div className='w-[200px] flex bg-primary-500 p-1 rounded text-white text-center justify-center items-center'>
                                    <p className='text-center text-sm'>{maklumat_permohonan.status_borang}</p>
                                </div>
                            </div>
                            <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <label htmlFor="" className='form-label'>Status Pembayaran</label>
                                <div className='w-[200px] flex bg-gray-600 p-1 rounded text-white text-center justify-center items-center'>
                                    <p className='text-center text-sm'>{maklumat_permohonan.status_terima_bayaran}</p>
                                </div>
                            </div>
                        </Card>
                    </section>
                    </>
                )
            }

            {/* <section className='mt-6'>
                <Card>
                    <pre>
                        {JSON.stringify(state, undefined, 4)}
                    </pre>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <pre>
                        {JSON.stringify(maklumat_permohonan, undefined, 4)}
                    </pre>
                </Card>
            </section> */}
        </div>
    );
}

export default MaklumatPermohonan;