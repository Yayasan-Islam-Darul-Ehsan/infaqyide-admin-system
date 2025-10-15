import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API, SYSADMIN_API } from '@/utils/api';
import { Dialog, Spinner } from 'evergreen-ui';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import InputGroup from '@/components/ui/InputGroup';
import Select from "react-select";
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
import moment from 'moment';
import Button from '@/components/ui/Button';
import Loading from '@/components/Loading';
import { useDropzone } from 'react-dropzone';

import uploadSvgImage from "@/assets/images/svg/upload.svg";
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';

const styles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
    }),
};

MaklumatKempen.propTypes = {
    
};

function MaklumatKempen(props) {

    let base_url = process.env.NODE_ENV === "production" ? "https://infaqyide.com.my/kempen/" : "https://beta.infaqyide.com.my/kempen/"

    let navigate    = useNavigate()
    let { state }   = useLocation()

    const [loading, set_loading]                            = useState(true)
    const [loading2, set_loading2]                          = useState(true)

    const [kempen_id, set_kempen_id]                        = useState(state.campaignId || null)
    const [maklumat_kempen, set_maklumat_kempen]            = useState({})

    const [dialog, set_dialog]                              = useState(false)
    const open_dialog                                       = () => set_dialog(true)
    const close_dialog                                      = () => set_dialog(false)

    const [opt_for_tabung, set_opt_for_tabung]              = useState([])
    const [files, setFiles]                                 = useState([])

    const getKempen = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kempen/${kempen_id}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_maklumat_kempen({
                    ...api.data,
                    campaignDisplayDonor: api.data.campaignDisplayDonor == 1 ? true : false,
                    campaignFeatured: api.data.campaignFeatured == 1 ? true : false
                })
                GET__LIST__TABUNG__KEMPEN(api.data.organizationId)
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk melihat maklumat kempen.")
        } finally {
            set_loading(false)
        }
    }

    const updateKempen = async () => {
        close_dialog()
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kempen/${kempen_id}`, maklumat_kempen, "PATCH", true)
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate(-1)
                }, 500);
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk mengemaskini maklumat kempen.")
        } finally {
            set_loading(false)
        }
    }

    const GET__LIST__TABUNG__KEMPEN = async (o_id) => {
        set_loading2(true)
        try {
            let api = await API("getTabungInstitusi/kempen", { org_id: o_id })
            if(api.status_code === 200 && api.data.length > 0) {
                let data    = api.data
                let array   = []
                for (let i = 0; i < data.length; i++) {
                    array.push({label: data[i]["tabung_name"], value: data[i]["tabung_id"]})
                }
                set_opt_for_tabung(array)
            }
        } catch (error) {
            set_opt_for_tabung([])
        } finally {
            setTimeout(() => {
                set_loading2(false)
            }, 1000);
        }
    }

    function validateUrl(url) {
        const invalidPatterns = ["http://", "https://", "://", "//", "/", "?", "&", "."];
        const hasInvalidPattern = invalidPatterns.some(pattern => url.includes(pattern));
        if (hasInvalidPattern) {
            toast.error("Permalink tidak boleh mengandungi 'http://', 'https://', atau '://' atau perkataan yang tidak dibernarkan.")
            return false
        }
        return true
    }

    const { getRootProps, getInputProps, isDragAccept } = useDropzone({
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
            );
            await uploadFileToServer(acceptedFiles)
        },
    });

    const uploadFileToServer = async (fileInput) => {
        let file_url 	= ""
        const formdata 	= new FormData();
        formdata.append("file", fileInput[0]);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        await fetch("https://cp.infaqyide.xyz/admin/file-uploader", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            set_maklumat_kempen({
                ...maklumat_kempen, 
                campaignImage: result.data
            })
        })
        .catch((error) => {
            console.error(error)
        });
        return file_url
    }

    const [modal_loading, set_modal_loading] = useState(true)
    const [modal_comment, set_modal_comment] = useState(false)
    const [comment, set_comment] = useState({
        campaignId: "",
        organizationId: "",
        approvalTitle: "",
        approvalDescription: "",
        approvalStatus: ""
    })
    const createComment = async () => {
        let json = comment
        //close_modal()
        set_modal_loading(true)
        try {
            let api = await SYSADMIN_API("pengesahan/kempen", comment, "POST")
            close_modal()
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Harap maaf! Terdapat masalah teknikal untuk membuat komen pengesahan kempen anda.")
        } finally {
            set_modal_loading(false)
        }
    }

    const open_modal = (item) => {
        console.log("Log Item : ", item)
        set_comment({
            ...comment,
            campaignId: item.campaignId,
            organizationId: item.organizationId,
        })
        setTimeout(() => {
            set_modal_comment(true)
            set_modal_loading(false)
        }, 0);
    }

    const close_modal = () => {
        set_comment({
            campaignId: "",
            organizationId: "",
            approvalTitle: "",
            approvalDescription: "",
            approvalStatus: ""
        })
        set_modal_comment(false)
    }

    useEffect(() => {
        getKempen()
    }, [kempen_id])

    if(loading) return <Loading />

    return (
        <div>

            <Dialog
            isShown={dialog}
            title="Pengesahan Mengemaskini Maklumat Kempen"
            cancelLabel='Tutup'
            confirmLabel='Ya, Teruskan'
            onCloseComplete={close_dialog}
            onCancel={close_dialog}
            onConfirm={updateKempen}
            >
                <p className='font-normal text-sm text-slate-600'>Anda pasti untuk mengemaskini maklumat kempen ini?</p>
            </Dialog>

            <Modal
                title='Komplen Pengesahan Kempen'
                themeClass='bg-teal-600 text-white'
                activeModal={modal_comment}
                onClose={close_modal}
                footerContent={(
                    <>
                    <div className='flex justify-end items-center gap-3'>
                        <Button className='' onClick={close_modal}>Batal</Button>
                        <Button className='bg-teal-600 text-white' onClick={createComment}>Komen Pengesahan</Button>
                    </div>
                    </>
                )}
                >
                    <div>
                        {
                            modal_loading ? 
                            (
                                <>
                                <div className='flex justify-center items-center'>
                                    <Spinner />
                                </div>
                                </>
                            ) :
                            (
                                <>
                                <div className='p-0'>
                                    <Card 
                                        title={`Komplen Pengesahan Kempen`} 
                                        subtitle={`Sila isi ruangan komplen pengesahan kempen anda di bawah.`}
                                    >
                                        <div className='grid grid-col-1 md:grid-cols-2 gap-3'>
                                            <Textinput 
                                            label={"ID Kempen"}
                                            placeholder='Contoh: 1234'
                                            defaultValue={comment.campaignId}
                                            disabled={true}
                                            />
                                            <Textinput 
                                            label={"ID Institusi"}
                                            placeholder='Contoh: 12'
                                            defaultValue={comment.organizationId}
                                            disabled={true}
                                            />
                                        </div>
    
                                        <div className='mt-3 space-y-3'>
                                            <div>
                                            <label htmlFor="" className='form-label'>Jenis Komen</label>
                                            <Select 
                                            className='text-sm text-slate-600'
                                            classNamePrefix='select'
                                            styles={styles}
                                            label={"Jenis Komen"}
                                            placeholder='Contoh: Maklumat kempen tidak lengkap'
                                            defaultValue={comment.approvalTitle}
                                            options={[
                                                { label: 'Kempen Sah', value: 'Kempen Sah' },
                                                { label: 'Maklumat Tidak Lengkap', value: 'Maklumat Tidak Lengkap' },
                                                { label: 'Tiada Gambar Kempen', value: 'Tiada Gambar Kempen' },
                                                { label: 'Tidak Patuh Shariah', value: 'Tidak Patuh Shariah' },
                                                { label: 'Melebihi Had Dana Dikumpul', value: 'Melebihi Had Dana Dikumpul' },
                                                { label: 'Tidak Patuh Syarat Kempen', value: 'Tidak Patuh Syarat Kempen' },
                                                { label: 'Institusi Tidak Sah', value: 'Institusi Tidak Sah' },
                                                { label: 'Kempen Tidak Sah', value: 'Kempen Tidak Sah' },
                                                { label: 'Lain-lain', value: 'Lain-lain' },
                                            ]}
                                            onChange={e => set_comment({...comment, approvalTitle: e.value})}
                                            />
                                            </div>
    
                                            <Textarea 
                                            label={"Keterangan Komen"}
                                            placeholder={"Contoh: Kempen ini tidak mematuhi syarat yang telah ditetapkan oleh pihak pengurusan Yayasan Islam Darul Ehsan."}
                                            dvalue={comment.approvalDescription}
                                            onChange={e => set_comment({...comment, approvalDescription: e.target.value})}
                                            />
    
                                            <div>
                                            <label htmlFor="" className='form-label'>Status Kempen</label>
                                            <Select 
                                            className='text-sm text-slate-600'
                                            classNamePrefix='select'
                                            styles={styles}
                                            label={"Status Pengesahan"}
                                            placeholder='Contoh: Ditolak'
                                            defaultValue={comment.approvalStatus}
                                            options={[
                                                { label: 'Lulus Pengesahan', value: 'Approved' },
                                                { label: 'Pengesahan Ditolak', value: 'Rejected' },
                                                { label: 'Lain-lain', value: 'Others' },
                                            ]}
                                            onChange={e => set_comment({...comment, approvalStatus: e.value})}
                                            />
                                            </div>
    
                                        </div>
                                    </Card>
                                </div>
                                </>
                            )
                        }
                    </div>
            </Modal>

            <section>
                {/* <HomeBredCurbs title={`Maklumat Kempen - ${state.campaignTitle}`} /> */}
                <div className="flex justify-between flex-wrap items-center mb-6">
                    <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                        {`Maklumat Kempen - ${state.campaignTitle}`}
                    </p>
                    <Button 
                    text={"Kemaskini Status"}
                    onClick={() => open_modal({organizationId: maklumat_kempen.organizationId, campaignId: state.campaignId})}
                    />
                </div>

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

                <section>
                    <section className='mt-6'>
                        <Card>
                            <div>
                                <p className='font-semibold text-gray-900 text-lg'>Maklumat Institusi & Tabung Kempen</p>
                                <p className='font-normal text-gray-500 text-sm'>Sila pilih institusi & tabung yang diperlukan untuk daftar kempen baharu.</p>
                            </div>
                            <div className='flex flex-col mt-6 gap-3'>
                                {/* <div>
                                    <Select 
                                    label={"Institusi Kempen"}
                                    placeholder='-- Sila Pilih Institusi --'
                                    description={"Sila pilih institusi yang diperlukan untuk daftar kempen."}
                                    defaultValue={maklumat_kempen.organizationId || ""}
                                    options={opt_for_institusi}
                                    onChange={async (e) => {
                                        await fetchTabung(e.target.value)
                                        set_maklumat_kempen({...maklumat_kempen, organizationId: e.target.value})
                                    }}
                                    />
                                </div> */}
                                <div>
                                    {
                                        !loading2 ? (
                                            <>
                                            <label htmlFor=" hh" className="form-label ">Tabung Kempen</label>
                                            <Select 
                                            className='text-sm text-slate-600'
                                            classNamePrefix='select'
                                            label={"Tabung Kempen"}
                                            placeholder='-- Sila Pilih Tabung --'
                                            description={"Hanya tabung jenis kempen sahaja yang akan dipaparkan di sini."}
                                            defaultValue={() => {
                                                return opt_for_tabung.find(a => a.value === maklumat_kempen.tabungId)
                                            }}
                                            options={opt_for_tabung}
                                            onChange={e => set_maklumat_kempen({...maklumat_kempen, tabungId: e.value})}
                                            styles={styles}
                                            />
                                            </>
                                        ) : (
                                            <div className='flex justify-center items-center'>
                                                <Spinner />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </Card>
                    </section>
                </section>

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
                                defaultValue={maklumat_kempen.campaignTitle}
                                onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignTitle: e.target.value })}
                                />
                            </div>
                            <div className='mt-6'>
                                <InputGroup 
                                label={"Permalink Kempen"}
                                prepend={`${base_url}`}
                                defaultValue={maklumat_kempen.campaignCode ? maklumat_kempen.campaignCode : maklumat_kempen.campaignTitle.replaceAll(" ", "-").toLowerCase()}
                                onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignCode: e.target.value })}
                                />
                            </div>
                            <div className='mt-6'>
                                <Textinput 
                                label={"Sasaran Kempen (RM)"}
                                placeholder='Contoh: RM10,000.00'
                                defaultValue={maklumat_kempen.campaignTarget}
                                onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignTarget: e.target.value })}
                                isNumberOnly
                                />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                <div className='mt-6'>
                                    <label htmlFor="" className='form-label'>Tarikh Mula Kempen </label>
                                    <Flatpicker
                                        className="form-control py-2"
                                        style={{ backgroundColor: '#ffffff' }}
                                        value={moment(maklumat_kempen.campaignDateStart).format("YYYY-MM-DD")}
                                        onChange={(date) => {
                                            console.log("Log Start Date : ", date[0])
                                            console.log('Log Formatted Start Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                            //set_start_kempen(new Date(date[0]))
                                            set_maklumat_kempen({...maklumat_kempen, campaignDateStart: new Date(date[0]) })
                                        }}
                                        id="default-picker"
                                    />
                                </div>
                                <div className='mt-6'>
                                    <label htmlFor="" className='form-label'>Tarikh Tamat Kempen</label>
                                    <Flatpicker
                                        className="form-control py-2"
                                        style={{ backgroundColor: '#ffffff' }}
                                        value={moment(maklumat_kempen.campaignDeadline).format("YYYY-MM-DD")}
                                        onChange={(date) => {
                                            console.log("Log Start Date : ", date[0])
                                            console.log('Log Formatted Start Date : ', moment(date[0]).format("YYYY-MM-DD"))
                                            //set_start_kempen(new Date(date[0]))
                                            set_maklumat_kempen({...maklumat_kempen, campaignDeadline: new Date(date[0]) })
                                        }}
                                        id="default-picker"
                                    />
                                </div>
                            </div>
                            <div className='mt-6'>
                                <label htmlFor="" className='form-label'>Konfigurasi Tambahan</label>
                                <div className='space-y-1'>
                                    <Checkbox name={"Ketengahkan Kempen"} label={"Ketengahkan Kempen"} value={maklumat_kempen.campaignFeatured} onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignFeatured: e.target.checked})} />
                                    <Checkbox name={"Paparkan Nama Penyumbang"} label={"Paparkan Nama Penyumbang"} value={maklumat_kempen.campaignDisplayDonor} onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignDisplayDonor: e.target.checked})} />
                                </div>
                            </div>
                            <div className='mt-6'>
                                <label htmlFor="" className='form-label'>Status</label>
                                <Select 
                                className='text-sm text-slate-600 form-input'
                                classNamePrefix='select'
                                label={"Status"}
                                placeholder='-- Pilih Status Kempen --'
                                description={"* Kempen anda akan melalui suatu proses pengesahan oleh pihak admin YIDE. Sila pastikan semua maklumat telah lengkap dan benar."}
                                defaultValue={() => {
                                    let opt = [
                                        {label: 'Aktif', value: 'ACTIVE'},
                                        {label: 'Nyahaktif', value: 'INACTIVE'},
                                        {label: 'Dalam Proses', value: 'PENDING'},
                                    ]
                                    return opt.find(a => a.value === maklumat_kempen.campaignStatus)
                                }}
                                //defaultInputValue={maklumat_kempen.campaignStatus}
                                onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignStatus: e.value })}
                                options={[
                                    {label: 'Aktif', value: 'ACTIVE'},
                                    {label: 'Nyahaktif', value: 'INACTIVE'},
                                    {label: 'Dalam Proses', value: 'PENDING'},
                                ]}
                                styles={styles}
                                />
                            </div>
                        </div>
                    </Card>
                </section>

                <section className='mt-6'>
                    <Card title={"Gambar Kempen"} subtitle={"Klik pada ruangan di bawah untuk muatnaik gambar kempen."}>
                        <div>
                            <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center">
                                {files.length === 0 && (
                                    <div {...getRootProps({ className: "dropzone" })}>
                                        <input className="hidden" {...getInputProps()} />
                                        <img
                                            src={maklumat_kempen.campaignImage || uploadSvgImage}
                                            alt=""
                                            className="mx-auto mb-4"
                                        />
                                        {isDragAccept ? (
                                            <p className="text-sm text-slate-500 dark:text-slate-300 ">
                                                Drop the files here ...
                                            </p>
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-300 f">
                                                Drop files here or click to upload.
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="flex space-x-4">
                                    {files.map((file, i) => (
                                        <div key={i} className="mb-4 flex-none">
                                            <div className="h-[300px] w-[300px] mx-auto mt-6 rounded-md">
                                                <img
                                                    src={file.preview}
                                                    className=" object-contain h-full w-full block rounded-md"
                                                    onLoad={() => {
                                                        URL.revokeObjectURL(file.preview);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className='text-xs text-slate-600 italic'>{maklumat_kempen.campaignImage}</span>
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
                                initialData: maklumat_kempen.campaignContent ?? '<p>Tulis kandungan kempen anda di sini...</p>',
                            }}
                            data={maklumat_kempen.campaignContent}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                set_maklumat_kempen({...maklumat_kempen, campaignContent: data})
                            }}
                        />
                        </div>
                    </Card>
                </section>

                <section className='mt-3'>
                    <div className='flex justify-end items-center'>
                        <Button 
                        text={"Kemaskini Kempen"}
                        icon={"heroicons:inbox-arrow-down"}
                        onClick={open_dialog}
                        className='bg-teal-600 text-white'
                        />
                    </div>
                </section>
            </section>
        </div>
    );
}

export default MaklumatKempen;