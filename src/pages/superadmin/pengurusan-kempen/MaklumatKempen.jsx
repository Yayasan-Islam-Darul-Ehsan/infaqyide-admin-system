import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API, SYSADMIN_API } from '@/utils/api';
import { Dialog } from 'evergreen-ui';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
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
import moment from 'moment';
import Button from '@/components/ui/Button';
import Loading from '@/components/Loading';

MaklumatKempen.propTypes = {
    
};

function MaklumatKempen(props) {

    let base_url = process.env.NODE_ENV === "production" ? "https://infaqyide.com.my/" : "https://infaqyide.xyz/"

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

    const getKempen = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kempen/${kempen_id}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_maklumat_kempen(api.data)
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
        let api = await API("getTabungInstitusi", { org_id: o_id })
        console.log("Log Get Tabung Kempen : ", api)

        if((api.status === 200 || api.status_code === 200 ) && api.data.row.length > 0) {
            let data    = api.data.row
            let array   = []

            array.push({
                label: "-- Pilih Tabung --",
                value: ""
            })
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
        const hasInvalidPattern = invalidPatterns.some(pattern => url.includes(pattern));
        if (hasInvalidPattern) {
            toast.error("Permalink tidak boleh mengandungi 'http://', 'https://', atau '://' atau perkataan yang tidak dibernarkan.")
            return false
        }
        return true
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

            <section>
                <HomeBredCurbs title={`Maklumat Kempen - ${state.campaignTitle}`} />

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
                        opt_for_tabung.length > 0 && (
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
                                            defaultValue={maklumat_kempen.tabungId || ""}
                                            options={opt_for_tabung}
                                            onChange={e => set_maklumat_kempen({...maklumat_kempen, tabungId: e.target.value })}
                                            />
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
                                onChange={e => set_maklumat_kempen({...maklumat_kempen, campaignTitle: e.target.value })}
                                />
                            </div>
                            <div className='mt-6'>
                                <InputGroup 
                                label={"Permalink Kempen"}
                                prepend={`${base_url}${maklumat_kempen.organizationId}/kempen/`}
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