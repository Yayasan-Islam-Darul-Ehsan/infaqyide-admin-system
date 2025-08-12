import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import moment from 'moment';
import API_FORM_DATA, { API, API_FORM_DATA_STAGING } from '@/utils/api';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import { Alert, FileCard, FileUploader } from 'evergreen-ui';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import Flatpicker from 'react-flatpickr'

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
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import Textarea from '@/components/ui/Textarea';

TambahHebahan.propTypes = {

};

function TambahHebahan(props) {

    const { user }                                          = useSelector(user => user.auth)
    const state                                             = useLocation().state
    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading_page, set_loading_page]                  = useState(false)

    const [nama_kempen, set_nama_kempen]                    = useState("")
    const [content, set_content]                            = useState("")
    const [hebahan_desc, set_hebahan_desc]                  = useState("")
    const [status_hebahan, set_status_hebahan]              = useState("")
    const [start_kempen, set_start_kempen]                  = useState(new Date(moment()))
    const [end_kempen, set_end_kempen]                      = useState(new Date(moment().add(1, 'month')))
    const [institusi, set_institusi]                        = useState(null)
    const [url_gambar_lama, set_url_gambar_lama]            = useState(null)

    const [disabled_editing, set_disable_editing]       = useState(true)

    const [opt_for_tabung, set_opt_for_tabung]              = useState([])

    const [modal, set_modal]                                = useState(false)
    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const [files, setFiles] = React.useState([])
    const [fileRejections, setFileRejections] = React.useState([])

    const handleChange      = React.useCallback((files) => setFiles(files), [])
    const handleRejected    = React.useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
    const handleRemove      = React.useCallback(() => {
        setFiles([])
        setFileRejections([])
    }, [])

    // const GET__INSTITUSI = async () => {
    //     set_loading_page(true)
    //     let api = await API(`getHebahanInstitusi?orgId=${user.user ? user.user.id : user.id}`, {}, "GET")
    //     console.log("Log Get Institusi : ", api)

    //     if(api.status === 200) {
    //         set_institusi(api.data[0])
    //     }
    // }

    const GET__HEBAHAN = async () => {
        set_loading_page(true)
        let api = await API(`getHebahanDetails?hebId=${state.HEB_ID}`, {}, "GET")
        console.log("Log Get Kempen Details : ", api)

        if(api.status === 200) {

            let data = api.data[0]

            set_nama_kempen(data.HEB_TITLE)
            set_content(data.HEB_CONTENT)
            set_hebahan_desc(data.HEB_DESCRIPTION)
            set_start_kempen(new Date(data.HEB_CREATED_DATE))
            set_end_kempen(new Date(data.HEB_END_DATE))
            set_status_hebahan(data.HEB_STATUS)
            set_url_gambar_lama(data.HEB_IMAGE)
        }

        set_loading_page(false)
    }

    

    // const UPDATE_HEBAHAN = async () => {

    //     close_modal()

    //     let json = {
    //         hebId: state.HEB_ID,
    //         //institutionId: user.id,
    //         name: nama_kempen,
    //         desc: hebahan_desc,
    //         content: content,
    //         imageURL: url_gambar_lama,
    //         startDate: start_kempen,
    //         endDate: end_kempen,
    //     }
    //     console.log("Payload sent to updateHebahan API: ", json);

    //     let api = await API(`updateHebahan`, json)
    //     console.log("Log Api Update Institusi : ", api)

    //     if(api.status_code === 200 || api.status === 200) {
    //         toast.success("Maklumat hebahan telah berjaya dikemasini.")
    //         setTimeout(() => {
    //             window.location.reload()
    //         }, 1000);
    //     } else {
    //         toast.error(api.message)
    //     }
    // }

    const upload__file = async () => {

        let result = null 

        if(files === null) {

            toast.error("Sila pastikan anda sertakan gambar atau dokumen sokongan sebagai bukti.")
            result = null

        } else {

            let form_data = [
                { title: 'file', value: files[0] }
            ]

            let api = await API_FORM_DATA_STAGING("file-uploader", form_data)

            if(api.status_code === 200) {
                result = api.data
            } else {
                result = null
                toast.error(api.message)
            }
        }

        return result
    }

    const UPDATE_HEBAHAN = async () => {

        close_modal();
        set_loading_page(true);
    
        let imageURL = url_gambar_lama;
    
        
        if (files.length > 0) {
            const uploadResult = await upload__file();
    
            
            if (uploadResult) {
                imageURL = uploadResult; 
            } else {
                
                toast.error("Terdapat masalah semasa muatnaik gambar. Sila cuba lagi.");
                set_loading_page(false);
                return;
            }
        }
    
        let json = {
            hebId: state.HEB_ID,
            name: nama_kempen,
            desc: hebahan_desc,
            content: content,
            imageURL: imageURL, 
            startDate: start_kempen,
            endDate: end_kempen,
        };    
        
        let api = await API(`updateHebahan`, json);
    
        console.log("Log Api Update Hebahan: ", api);
    
        if (api.status_code === 200 || api.status === 200) {
            toast.success("Maklumat hebahan telah berjaya dikemasini.");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            toast.error(api.message);
        }
    
        set_loading_page(false); 
    };
    
    
    
    

    useEffect(() => {
        //GET__INSTITUSI()
        GET__HEBAHAN()
    }, [])

    if(loading_page) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Mengemaskini Hebahan Institusi'
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
                        UPDATE_HEBAHAN()
                    }}>Kemaskini Maklumat Hebahan</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk mengemaskini maklumat hebahan di bawah? Jika sudah pasti, klik butang kemaskini di bawah.</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Hebahan Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Lengkapkan maklumat hebahan/aktiviti di bawah untuk memuatnaik hebahan/aktiviti institusi baru anda.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        {status_hebahan !== "Expired" && disabled_editing && (
                            <Button onClick={() => set_disable_editing(!disabled_editing)} className='bg-teal-600 font-medium text-sm text-white'>Aktifkan Kemaskini</Button>
                        )}
                        {
                            !disabled_editing && (
                                <Button onClick={() => set_disable_editing(!disabled_editing)} className='bg-white text-gray-600 font-medium text-sm'>Nyahaktif Kemaskini</Button>
                            )
                        }
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

            {status_hebahan === "Expired" && (
                <section className='mt-6'>
                    <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                        <div>
                            <ul>
                                <li className='text-sm text-gray-600'>Maklumat hebahan yang telah tamat tempoh tidak boleh dikemaskini lagi.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Hebahan atau Aktiviti</p>
                        <p className='font-normal text-gray-500 text-sm'>Informasi mengenai hebahan/aktiviti yang akan dimuatnaikkan.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Textinput 
                            label={'Nama Hebahan/Aktiviti'}
                            placeholder='Contoh: Kuliah Maghrib "Mencapai Insan Mutadayyin"'
                            defaultValue={nama_kempen}
                            disabled={disabled_editing}
                            onChange={e => set_nama_kempen(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textarea 
                            label={'Keterangan Ringkas Hebahan/Aktiviti'}
                            placeholder='Contoh: Kuliah Maghrib yang akan disampaikan oleh Ustaz Syahril Sulaiman'
                            dvalue={hebahan_desc}
                            disabled={disabled_editing}
                            onChange={e => set_hebahan_desc(e.target.value)}
                            row={7}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className='mt-6'>
                                <label htmlFor="" className='form-label'>
                                    Tarikh Hebahan/Aktiviti
                                </label>
                                <Flatpicker
                                    className="form-control py-2 bg-white"
                                    value={start_kempen}
                                    disabled={disabled_editing}
                                    onChange={(date) => {
                                        console.log("Log Start Date : ", date[0])
                                        console.log('Log Formatted Start Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                        set_start_kempen(new Date(date[0]))
                                    }}
                                    id="default-picker"
                                />
                            </div>
                            <div className='mt-6'>
                                <label htmlFor="" className='form-label'>
                                    Tarikh Tamat Hebahan/Aktiviti
                                </label>
                                <Flatpicker
                                    className="form-control py-2 bg-white"
                                    value={end_kempen}
                                    disabled={disabled_editing}
                                    onChange={(date) => {
                                        console.log("Log End Date : ", date[0])
                                        console.log('Log Formatted End Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                        set_end_kempen(new Date(date[0]))
                                    }}
                                    id="default-picker"
                                />
                            </div>
                        </div>
                        
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>
                            Kandungan Penuh Hebahan atau Aktiviti 
                        </p>
                        <p className='font-normal text-gray-500 text-sm'>Kandungan yang akan dipaparkan di halaman hebahan/aktiviti.</p>
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
                            initialData: content ?? '<p>Tulis kandungan kempen anda di sini...</p>',
                        }}
                        data={content}
                        disabled={disabled_editing}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            set_content(data);
                        }}
                    />
                    </div>
                </Card>
            </section>

            

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Gambar Hebahan atau Aktiviti</p>
                        <p className='font-normal text-gray-500 text-sm'>Sila muat naik gambar hebahan yang ingin didaftarkan.</p>
                    </div>
                    <div className='mt-6'>
                        <label htmlFor="" className='form-label'>Gambar Lama</label>
                        <p className='text-gray-900 text-sm underline'>{url_gambar_lama}</p>
                        <div className='mt-3'>
                            <img src={url_gambar_lama} alt="" className='mx-auto object-cover rounded-md shadow-md'  />
                        </div>
                    </div>
                    <div className='mt-6'>
                        <FileUploader
                            acceptedMimeTypes={['image/png', 'image/jpg', 'image/jpeg', 'image/heic']}
                            label="Muatnaik Gambar Baru Hebahan"
                            description="Anda hanya boleh muatnaik 1 fail sahaja. Saiz fail yang dibenarkan adalah tidak melebihi 10MB."
                            maxSizeInBytes={5 * 1024 ** 2}
                            maxFiles={1}
                            onChange={handleChange}
                            onRejected={handleRejected}
                            disabled={disabled_editing}
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

            {
                !disabled_editing && (
                    <>
                    <section className='mt-6'>
                        <div className='flex justify-end items-center'>
                            <Button className='bg-teal-600 text-white' onClick={open_modal}>Kemaskini Maklumat Hebahan</Button>
                        </div>
                    </section>
                    </>
                )
            }

        </div>
    );
}

export default TambahHebahan;