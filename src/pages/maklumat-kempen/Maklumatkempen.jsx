import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import moment from 'moment';
import API_FORM_DATA, { API, API_FORM_DATA_STAGING } from '@/utils/api';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Alert, FileCard, FileUploader } from 'evergreen-ui';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import InputGroup from '@/components/ui/InputGroup';

import Flatpicker from 'react-flatpickr'
import Checkbox from '@/components/ui/Checkbox';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { toast } from 'react-toastify';

Maklumatkempen.propTypes = {
    
};

function Maklumatkempen(props) {

    let base_url = process.env.NODE_ENV === "production" ? "https://al-jariyah.com/institusi/" : "https://demo.al-jariyah.com/institusi/"

    const state                                             = useLocation().state
    const { user }                                          = useSelector(user => user.auth)
    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading_page, set_loading_page]                  = useState(true)

    const [nama_kempen, set_nama_kempen]                    = useState("")
    const [keterangan_kempen, set_keterangan_kempen]        = useState("")
    const [tabung_kempen, set_tabung_kempen]                = useState("")
    const [permalink_kempen, set_permalink_kempen]          = useState("")
    const [target_kempen, set_target_kempen]                = useState("")
    const [start_kempen, set_start_kempen]                  = useState(new Date(moment()))
    const [end_kempen, set_end_kempen]                      = useState(new Date(moment().add(1, 'month')))
    const [featuring_kempen, set_featuring_kempen]          = useState(false)
    const [display_donor_kempen, set_display_donor_kempen]  = useState(false)
    const [status_kempen, set_status_kempen]                = useState("PENDING")
    const [institusi, set_institusi]                        = useState(null)
    const [url_gambar_lama, set_url_gambar_lama]            = useState(null)

    const [opt_for_tabung, set_opt_for_tabung]              = useState([])

    const [modal, set_modal]                                = useState(false)
    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const [files, setFiles] = React.useState([])
    const [fileRejections, setFileRejections] = React.useState([])
    const handleChange = React.useCallback((files) => setFiles([files[0]]), [])
    const handleRejected = React.useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
    const handleRemove = React.useCallback(() => {
        setFiles([])
        setFileRejections([])
    }, [])

    const GET__INSTITUSI = async () => {

        let api = await API(`getKempenInstitusi?orgId=${user.user ? user.user.id : user.id}`, {}, "GET")
        console.log("Log Get Institusi : ", api)

        if(api.status === 200) {
            set_institusi(api.data[0])
        }

    }

    const GET__KEMPEN = async () => {

        let api = await API(`getKempenDetails?campaignId=${state.campaignId}`, {}, "GET")
        console.log("Log Get Kempen Details : ", api)

        if(api.status === 200) {
            let { 
                campaignCode, 
                campaignContent, 
                campaignDateStart, 
                campaignDeadline,
                campaignDisplayDonor,
                campaignFeatured,
                campaignId,
                campaignImage,
                campaignStatus,
                campaignTarget,
                campaignTitle,
                item,
                organizationCode,
                organizationId,
                organizationName,
                tabung,
                tabungId,
                tabungName
            } = api.data

            set_nama_kempen(campaignTitle)
            set_keterangan_kempen(campaignContent)
            set_tabung_kempen(tabungId)
            set_permalink_kempen(campaignCode)
            set_target_kempen(parseFloat(campaignTarget))
            set_start_kempen(new Date(campaignDateStart))
            set_end_kempen(new Date(campaignDeadline))
            set_featuring_kempen(campaignFeatured === 0 ? false : true)
            set_display_donor_kempen(campaignDisplayDonor === 0 ? false : true)
            set_status_kempen(campaignStatus)
            set_institusi({
                organizationId,
                organizationName,
                organizationCode
            })
            set_url_gambar_lama(campaignImage)
        }
    }

    const GET__LIST__TABUNG__KEMPEN = async () => {
        
        let api = await API("getTabungInstitusi/kempen", { org_id: user.user ? user.user.id : user.id })
        console.log("Log Get Tabung Kempen : ", api)

        if((api.status === 200 || api.status_code === 200 ) && api.data.length > 0) {
            let data    = api.data
            let array   = []

            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: data[i]["tabung_name"],
                    value: data[i]["tabung_id"]
                })
            }

            set_opt_for_tabung(array)
        }
    }

    function validateUrl(url) {
        const invalidPatterns = ["http://", "https://", "://", "//", "/", "?", "&", "."];
        
        // Check if the URL contains any invalid pattern
        const hasInvalidPattern = invalidPatterns.some(pattern => url.includes(pattern));
      
        if (hasInvalidPattern) {
            toast.error("Permalink tidak boleh mengandungi 'http://', 'https://', atau '://' atau perkataan yang tidak dibernarkan.")
            return false
        }
        
        return true
    }

    const UPDATE__KEMPEN = async () => {
        close_modal()

        if(validateUrl(permalink_kempen)) {
            set_loading_page(true)
            if(files.length > 0) {

                let upload_file = await UPLOAD__FILE()

                let dataa = [
                    { title: 'kempen_id', value: state.campaignId },
                    { title: 'kempen_name', value: nama_kempen },
                    { title: 'kempen_description', value: keterangan_kempen },
                    { title: 'kempen_tabung', value: tabung_kempen },
                    { title: 'kempen_target', value: target_kempen },
                    { title: 'kempen_start_date', value: moment(start_kempen).format("YYYY-MM-DD") },
                    { title: 'kempen_end_date', value: moment(end_kempen).format("YYYY-MM-DD") },
                    { title: 'kempen_featuring', value: featuring_kempen },
                    { title: 'kempen_display_donor', value: display_donor_kempen },
                    { title: 'kempen_permalink', value: permalink_kempen },
                    { title: 'kempen_image', value: upload_file }
                ]

                let jsonData = dataa.reduce((obj, item) => {
                    obj[item.title] = item.value;
                    return obj;
                }, {});
        
                let api = await API("kempen/update-kempen", jsonData)
                console.log("Log Create Kempen : ", api)
                set_loading_page(false)
                
                if(api.status_code === 200 || api.status_code === 200) {
                    toast.success("Maklumat kempen baru telah berjaya disimpan.")
                    setTimeout(() => {
                        navigate(0)
                    }, 1000);
                } else {
                    toast.error(api.message)
                }

            } else {

                let dataa = [
                    { title: 'kempen_id', value: state.campaignId },
                    { title: 'kempen_name', value: nama_kempen },
                    { title: 'kempen_description', value: keterangan_kempen },
                    { title: 'kempen_tabung', value: tabung_kempen },
                    { title: 'kempen_target', value: target_kempen },
                    { title: 'kempen_start_date', value: moment(start_kempen).format("YYYY-MM-DD") },
                    { title: 'kempen_end_date', value: moment(end_kempen).format("YYYY-MM-DD") },
                    { title: 'kempen_featuring', value: featuring_kempen },
                    { title: 'kempen_display_donor', value: display_donor_kempen },
                    { title: 'kempen_permalink', value: permalink_kempen },
                    { title: 'kempen_image', value: url_gambar_lama }
                ]

                let jsonData = dataa.reduce((obj, item) => {
                    obj[item.title] = item.value;
                    return obj;
                }, {});
        
                let api = await API("kempen/update-kempen", jsonData)
                console.log("Log Create Kempen : ", api)
                set_loading_page(false)
                
                if(api.status_code === 200 || api.status_code === 200) {
                    toast.success("Maklumat kempen baru telah berjaya disimpan.")
                    setTimeout(() => {
                        navigate(0)
                    }, 1000);
                } else {
                    toast.error(api.message)
                }

            }
        }
    }

    const UPLOAD__FILE = async () => {
        let result = null 
        if(files.length === 0) {

            toast.error("Sila pastikan anda sertakan gambar atau dokumen sokongan sebagai bukti.")
            result = null

        } else {

            let form_data = [
                { title: 'file', value: files[0] }
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
        set_loading_page(true)
        GET__LIST__TABUNG__KEMPEN()
        GET__INSTITUSI()
        set_loading_page(false)
    }, [])

    useEffect(() => {
        GET__KEMPEN()
    }, [opt_for_tabung])

    if(loading_page || institusi === null ) return <Loading />

    return (
        <div>
            <Modal
            title='Pengesahan Tambah Rekod Kempen Institusi'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div>
                    <Button className='' onClick={close_modal}>Tutup</Button>
                    <Button className='bg-success-600 text-white' onClick={() => {
                        close_modal()
                        UPDATE__KEMPEN()
                    }}>Kemaskini Kempen</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk mengemaskini kempen dengan maklumat di bawah? Jika sudah pasti, klik butang teruskan di bawah.</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Kemaskini Maklumat Kempen</p>  
                        <p className={`text-sm text-gray-500`}>Lengkapkan maklumat kempen di bawah untuk mengemaskini kempen institusi anda.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                    <div>
                        <p className='font-semibold text-lg text-gray-600'>Peringatan!</p>
                    </div>
                    <div className=''>
                        <ul className=''>
                            <li className='text-sm text-gray-600'>1. Sila pastikan tabung jenis kempen didaftarkan terlebih dahulu sebelum mendaftar kempen. Jika tabung jenis kempen belum didaftarkan, sila daftar terlebih dahulu di sini.</li>
                            <li className='text-sm text-gray-600'>2. Pakej untuk kempen ini boleh ditambah pada halaman maklumat kempen selepas kempen ini telah didaftarkan.</li>
                            <li className='text-sm text-gray-600'>3. Semua medan dibawah adalah wajib diisi.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {
                tabung_kempen && opt_for_tabung.length > 0 && (
                    <section className='mt-6'>
                        <Card>
                            <div>
                                <p className='font-semibold text-gray-900 text-lg'>Maklumat Tabung Kempen</p>
                                <p className='font-normal text-gray-500 text-sm'>Sila pilih tabung kempen yang ingin didaftarkan.</p>
                            </div>
                            <div className='mt-6'>
                                <div>
                                    <Select 
                                    
                                    label={"Nama Tabung"}
                                    placeholder='-- Sila Pilih Tabung --'
                                    description={"Hanya tabung jenis kempen sahaja yang akan dipaparkan di sini."}
                                    defaultValue={tabung_kempen}
                                    options={opt_for_tabung}
                                    onChange={e => set_tabung_kempen(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </section>
                )
            }

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Kempen</p>
                        <p className='font-normal text-gray-500 text-sm'>Informasi mengenai kempen yang akan didaftarkan.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Textinput 
                            
                            label={"Nama Kempen"}
                            placeholder='Contoh: Kempen Tabung Pembinaan Rumah Anak Yatim Widad 2025'
                            defaultValue={nama_kempen}
                            onChange={e => set_nama_kempen(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <InputGroup 
                            
                            label={"Permalink Kempen"}
                            prepend={`${base_url}${institusi.organizationCode}/kempen/`}
                            defaultValue={permalink_kempen}
                            onChange={e => set_permalink_kempen(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                            
                            label={"Sasaran Kempen (RM)"}
                            placeholder='Contoh: RM10,000.00'
                            defaultValue={target_kempen}
                            onChange={e => set_target_kempen(e.target.value)}
                            type={'number'}
                            />
                        </div>
                        <div className='mt-6'>
                            <label htmlFor="" className='form-label'>Tarikh Mula Kempen </label>
                            <Flatpicker
                                className="form-control py-2"
                                style={{ backgroundColor: '#ffffff' }}
                                value={start_kempen}
                                onChange={(date) => {
                                    console.log("Log Start Date : ", date[0])
                                    console.log('Log Formatted Start Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                    set_start_kempen(new Date(date[0]))
                                }}
                                id="default-picker"
                            />
                        </div>
                        <div className='mt-6'>
                            <label htmlFor="" className='form-label'>Tarikh Tamat Kempen</label>
                            <Flatpicker
                                className="form-control py-2"
                                style={{ backgroundColor: '#ffffff' }}
                                value={end_kempen}
                                onChange={(date) => {
                                    console.log("Log End Date : ", date[0])
                                    console.log('Log Formatted End Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                    set_end_kempen(new Date(date[0]))
                                }}
                                id="default-picker"
                            />
                        </div>
                        <div className='mt-6'>
                            <label htmlFor="" className='form-label'>Konfigurasi Tambahan</label>
                            <Checkbox name={"Ketengahkan Kempen"} label={"Ketengahkan Kempen"} value={featuring_kempen} onChange={e => set_featuring_kempen(e.target.checked)} />
                            <Checkbox name={"Paparkan Nama Penyumbang"} label={"Paparkan Nama Penyumbang"} value={display_donor_kempen} onChange={e => set_display_donor_kempen(e.target.checked)} />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                            label={"Status"}
                            placeholder='-- Pilih Status Kempen --'
                            description={"* Kempen anda akan melalui suatu proses pengesahan oleh pihak admin Al-Jariyah. Sila pastikan semua maklumat telah lengkap dan benar."}
                            defaultValue={status_kempen}
                            onChange={e => set_status_kempen(e.target.value)}
                            disabled={true}
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Kandungan Halaman Kempen</p>
                        <p className='font-normal text-gray-500 text-sm'>Kandungan yang akan dipaparkan di halaman kempen.</p>
                    </div>
                    <div className='mt-6'>
                    <CKEditor
                        editor={ ClassicEditor }
                        config={{
                            toolbar: [
                                'undo', 'redo', '|',
                                'heading', '|', 'bold', 'italic', '|',
                                'link', 'insertTable', 'mediaEmbed', '|',
                                'bulletedList', 'numberedList', 'indent', 'outdent'
                            ],
                            plugins: [
                                Bold,
                                Essentials,
                                Heading,
                                Indent,
                                IndentBlock,
                                Italic,
                                Link,
                                List,
                                MediaEmbed,
                                Paragraph,
                                Table,
                                Undo
                            ],
                            initialData: keterangan_kempen ?? '<p>Tulis kandungan kempen anda di sini...</p>',
                        }}
                        data={keterangan_kempen}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            set_keterangan_kempen(data);
                        }}
                    />
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Gambar Kempen Baharu</p>
                        <p className='font-normal text-gray-500 text-sm'>Sila muat naik gambar kempen baharu yang ingin didaftarkan.</p>
                    </div>
                    {/* <div className='mt-6'>
                        <label htmlFor="" className='form-label'>Gambar Lama</label>
                        <p className='text-gray-900 text-sm underline'>{url_gambar_lama}</p>
                        <div className='mt-3'>
                            <img src={url_gambar_lama} alt="" className='mx-auto object-cover rounded-md shadow-md'  />
                        </div>
                    </div> */}
                    <div className='mt-6'>
                        <FileUploader
                            isRequired
                            acceptedMimeTypes={['image/png', 'image/jpg', 'image/jpeg', 'image/heic']}
                            label="Muatnaik Gambar Baru Kempen"
                            description="Anda hanya boleh muatnaik 1 fail sahaja. Saiz fail yang dibenarkan adalah tidak melebihi 10MB."
                            maxSizeInBytes={5 * 1024 ** 2}
                            maxFiles={1}
                            onChange={handleChange}
                            onRejected={handleRejected}
                            renderFile={(file) => {
                            const { name, size, type } = file
                            const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
                            const { message } = fileRejection || {}
                            return (
                                <FileCard
                                    key={name}
                                    isInvalid={fileRejection != null}
                                    name={name}
                                    onRemove={handleRemove}
                                    sizeInBytes={size}
                                    type={type}
                                    validationMessage={message}
                                />
                            )
                            }}
                            values={files}
                        />
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <div className='flex justify-end items-center'>
                    <Button className='bg-teal-600 text-white' onClick={open_modal}>Tambah Rekod Kempen Institusi</Button>
                </div>
            </section>
        </div>
    );
}

export default Maklumatkempen;