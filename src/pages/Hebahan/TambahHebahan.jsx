import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import moment from 'moment';
import API_FORM_DATA, { API, API_FORM_DATA_STAGING } from '@/utils/api';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import { Alert, FileCard, FileUploader } from 'evergreen-ui';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
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
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import Textarea from '@/components/ui/Textarea';

TambahHebahan.propTypes = {

};

function TambahHebahan(props) {

    const { user }                                          = useSelector(user => user.auth)
    const navigate                                          = useNavigate()
    const { width, breakpoints }                            = useWidth()

    const [loading_page, set_loading_page]                  = useState(false)

    const [nama_kempen, set_nama_kempen]                    = useState("")
    const [keterangan_kempen, set_keterangan_kempen]        = useState("")
    const [content, set_content]                            = useState("")
    const [start_kempen, set_start_kempen]                  = useState(new Date(moment()))
    const [end_kempen, set_end_kempen]                      = useState(new Date(moment().add(1, 'month')))
    const [institusi, set_institusi]                        = useState(null)

    const [opt_for_tabung, set_opt_for_tabung]              = useState([])

    const [modal, set_modal]                                = useState(false)
    const open_modal                                        = () => set_modal(true)
    const close_modal                                       = () => set_modal(false)

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

    const update__logo = async () => {
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

    const CREATE__KEMPEN = async () => {
        close_modal()

        let upload = await update__logo()

        let json = {
            institutionId: user.user ? user.user.id : user.id,
            name: nama_kempen,
            description: keterangan_kempen,
            content: content,
            imageURL: upload,
            startDate: moment(start_kempen).format("YYYY-MM-DD"),
            endDate: moment(end_kempen).format("YYYY-MM-DD")
        }

        console.log("Log Data : ", json)

        let api = await API("insertHebahan", json)
        console.log("Log Create Kempen : ", api)

        if(api.status_code === 200 || api.status === 200) {
            toast.success("Maklumat hebahan baru telah berjaya disimpan.")
            setTimeout(() => {
                navigate(-1)
            }, 1000);
        } else {
            toast.error(api.message)
        }
    }


    const validateFields = () => {
        if (!nama_kempen) {
            toast.error("Sila masukkan nama hebahan atau aktiviti.");
            return false;
        }
        if (!keterangan_kempen) {
            toast.error("Sila masukkan keterangan ringkas.");
            return false;
        }
        if (!content) {
            toast.error("Sila masukkan kandungan hebahan atau aktiviti.");
            return false;
        }
        if (!files.length) {
            toast.error("Sila muat naik gambar hebahan atau aktiviti.");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateFields()) {
            open_modal();
        }
    };


    useEffect(() => {
        // GET__INSTITUSI()
    }, [])

    if(loading_page) return <Loading />

    return (
        <div>

            <Modal
            title='Pengesahan Menambah Hebahan Institusi'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-success-600 text-white' onClick={() => {
                        close_modal()
                        CREATE__KEMPEN()
                    }}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk memuatnaik hebahan/aktiviti?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Hebahan Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Lengkapkan maklumat hebahan/aktiviti di bawah untuk memuatnaik hebahan/aktiviti institusi baru anda.</p>  
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
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Hebahan atau Aktiviti</p>
                        <p className='font-normal text-gray-500 text-sm'>Informasi mengenai hebahan/aktiviti yang akan dimuatnaikkan.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Textinput 
                            label={<span>Nama Hebahan/Aktiviti</span>}
                            placeholder='Contoh: Kuliah Maghrib "Mencapai Insan Mutadayyin"'
                            defaultValue={nama_kempen}
                            onChange={e => set_nama_kempen(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textarea 
                            label={<span>Keterangan Ringkas Hebahan/Aktiviti </span>}
                            placeholder='Contoh: Kuliah Maghrib yang akan disampaikan oleh Ustaz Syahril Sulaiman'
                            defaultValue={keterangan_kempen}
                            onChange={e => set_keterangan_kempen(e.target.value)}
                            row={7}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className='mt-6'>
                                <label htmlFor="" className='form-label'>
                                    Tarikh Hebahan/Aktiviti 
                                </label>
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
                                <label htmlFor="" className='form-label'>
                                    Tarikh Tamat Hebahan/Aktiviti 
                                </label>
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
                        <p className='font-normal text-gray-500 text-sm'>
                            Kandungan yang akan dipaparkan di halaman hebahan/aktiviti.
                        </p>
                    </div>
                    <div className='mt-6'>
                        <CKEditor
                            editor={ClassicEditor}
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
                                initialData: '<p>Tulis kandungan hebahan atau aktiviti institusi anda di sini...</p>',
                            }}
                            data={content}
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
                        <p className='font-semibold text-gray-900 text-lg'>Gambar Hebahan atau Aktiviti </p>
                        <p className='font-normal text-gray-500 text-sm'>Sila muat naik gambar hebahan/aktiviti yang ingin dimuatnaikkan.</p>
                    </div>
                    <div className='mt-6'>
                        <p className='font-semibold text-gray-900 text-lg'>Muat Naik Gambar Hebahan/Aktiviti</p>
                        <FileUploader
                            acceptedMimeTypes={['image/png', 'image/jpg', 'image/jpeg', 'image/heic']}
                            // label="Muat Naik Gambar Hebahan/Aktiviti"
                            description="Anda hanya boleh muat naik 1 fail sahaja. Saiz fail yang dibenarkan adalah tidak melebihi 10MB."
                            maxSizeInBytes={2 * 1024 ** 2}
                            maxFiles={3}
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
                    <Button className='bg-teal-600 text-white' onClick={handleSubmit}>Muat Naik Hebahan Institusi</Button>
                </div>
            </section>

        </div>
    );
}

export default TambahHebahan;