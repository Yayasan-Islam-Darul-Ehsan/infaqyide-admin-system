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

const styles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: "12px"
    }),
};

function DaftarKempen(props) {

    let base_url = process.env.NODE_ENV === "production" ? "https://infaqyide.com.my/kempen/" : "https://beta.infaqyide.com.my/kempen/"

    let navigate    = useNavigate()

    const [loading, set_loading]                            = useState(false)
    const [loading2, set_loading2]                          = useState(false)

    const [maklumat_kempen, set_maklumat_kempen]            = useState({
        campaignTitle: "",
        campaignCode: "",
        campaignDateStart: moment().format("YYYY-MM-DD"),
        campaignDeadline: moment().add(1, 'year').format("YYYY-MM-DD"),
        campaignFeatured: false,
        campaignDisplayDonor: true,
        campaignContent: "",
        campaignTarget: "",
        campaignStatus: "ACTIVE",
        campaignImage: "",
        organizationId: "",
        tabungId: ""
    })

    const [dialog, set_dialog]                              = useState(false)
    const open_dialog                                       = () => set_dialog(true)
    const close_dialog                                      = () => set_dialog(false)

    const [opt_for_institusi, set_opt_for_institusi]        = useState([])
    const [opt_for_tabung, set_opt_for_tabung]              = useState([])

    const [files, setFiles]                                 = useState([])

    const createKempen = async () => {
        close_dialog()
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kempen`, maklumat_kempen, "POST", true)
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

    const fetchInstitusi = async () => {
        set_loading(true)
        try {
            let ngo = await SYSADMIN_API("pengurusan/institusi?limit=1000", {}, "GET")
            if(ngo.status_code === 200) {
                if(ngo.data.row.length > 0) {
                    let data    = ngo.data.row
                    let arr     = []
                    for (let i = 0; i < data.length; i++) {
                        arr.push({
                            label: data[i]["organizationName"],
                            value: data[i]["organizationId"]
                        })
                    }
                    set_opt_for_institusi(arr)
                }
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi sistem pentadbir anda.")
        } finally {
            set_loading(false)
        }
    }

    const fetchTabung = async (o_id) => {
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
            set_loading2(false)
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

    useEffect(() => {
        fetchInstitusi()
    }, [])

    if(loading) return <Loading />

    return (
        <div>
            <Dialog
            isShown={dialog}
            intent='success'
            title="Pengesahan Mengemaskini Maklumat Kempen"
            cancelLabel='Tutup'
            confirmLabel='Ya, Teruskan'
            onCloseComplete={close_dialog}
            onCancel={close_dialog}
            onConfirm={createKempen}
            >
                <p className='font-normal text-sm text-slate-600'>Anda pasti untuk daftar kempen ini?</p>
            </Dialog>

            <section>
                <HomeBredCurbs title={`Daftar Kempen Baru`} />

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
                    {
                        (
                            <section className='mt-6'>
                                <Card>
                                    <div>
                                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Institusi & Tabung Kempen</p>
                                        <p className='font-normal text-gray-500 text-sm'>Sila pilih institusi & tabung yang diperlukan untuk daftar kempen baharu.</p>
                                    </div>
                                    <div className='flex flex-col mt-6 gap-3'>
                                        <div>
                                            <label htmlFor=" hh" className="form-label ">Institusi Kempen</label>
                                            <Select 
                                            className='text-sm text-slate-600'
                                            classNamePrefix='select'
                                            label={"Institusi Kempen"}
                                            placeholder='-- Sila Pilih Institusi --'
                                            description={"Sila pilih institusi yang diperlukan untuk daftar kempen."}
                                            defaultValue={maklumat_kempen.organizationId || ""}
                                            options={opt_for_institusi}
                                            onChange={async ({label, value}) => {
                                                console.log("Log Val : ", value)
                                                await fetchTabung(value)
                                                set_maklumat_kempen({...maklumat_kempen, organizationId: value})
                                            }}
                                            styles={styles}
                                            />
                                        </div>
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
                                                    defaultValue={maklumat_kempen.tabungId || ""}
                                                    options={opt_for_tabung}
                                                    onChange={({label, value}) => set_maklumat_kempen({
                                                        ...maklumat_kempen, 
                                                        tabungId: value
                                                    })}
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
                        )
                    }
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
                                onChange={e => {
                                    set_maklumat_kempen({
                                        ...maklumat_kempen, 
                                        campaignTitle: e.target.value,
                                        campaignCode: e.target.value.replaceAll(" ", "-")
                                    })
                                }}
                                disabled={(!maklumat_kempen.organizationId || !maklumat_kempen.tabungId)}
                                description={(!maklumat_kempen.organizationId || !maklumat_kempen.tabungId) && "Sila buat pemilihan intitusi dan tabung untuk kempen ini."}
                                />
                            </div>
                            <div className='mt-6'>
                                <InputGroup 
                                label={"Permalink Kempen"}
                                prepend={`${base_url}`}
                                defaultValue={maklumat_kempen.campaignCode}
                                onChange={e => set_maklumat_kempen({
                                    ...maklumat_kempen, 
                                    campaignCode: e.target.value.replaceAll(" ", "-")
                                })}
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
                                <Select 
                                label={"Status"}
                                placeholder='-- Pilih Status Kempen --'
                                description={"* Kempen anda akan melalui suatu proses pengesahan oleh pihak admin YIDE. Sila pastikan semua maklumat telah lengkap dan benar."}
                                defaultValue={maklumat_kempen.campaignStatus}
                                onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignStatus: e.target.value })}
                                options={[
                                    {label: 'Aktif', value: 'ACTIVE'},
                                    {label: 'Nyahaktif', value: 'INACTIVE'},
                                    {label: 'Dalam Proses', value: 'PENDING'},
                                ]}
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
                                            src={uploadSvgImage}
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
                        text={"Daftar Kempen"}
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

export default DaftarKempen;