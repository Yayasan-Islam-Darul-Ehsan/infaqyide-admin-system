import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import { Alert, Pane, Spinner } from 'evergreen-ui';
import Modal from '@/components/ui/Modal';
import { useModal } from '@/components/ui/SuperModal';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import { top_menu } from './kariah-constant';
import Textarea from '@/components/ui/Textarea';
import moment from 'moment';
import { toast } from 'react-toastify';

import Flatpickr from "react-flatpickr";

data_personal.propTypes = {
    
};

function data_personal(props) {

    const navigate = useNavigate()
    const state = useLocation().state
    const { width, breakpoints } = useWidth()

    const [main_menu, set_main_menu]                        = useState(top_menu)
    const [current_active_menu, set_current_active_menu]    = useState(top_menu[0].title)
    const [active_menu_value, set_active_menu_value]        = useState(top_menu[0].value)

    const [modal_reject, set_modal_reject]                  = useState(false)
    const [modal_approve, set_modal_approve]                = useState(false)
    const [loading, set_loading]                            = useState(true)

    const [loading_personal, set_loading_personal]          = useState(true)
    const [loading_family, set_loading_family]              = useState(true)
    const [loading_child, set_loading_child]                = useState(true)
    const [loading_bank, set_loading_bank]                  = useState(true)
    const [loading_subscription, set_loading_subscription]  = useState(true)
    const [loading_waris, set_loading_waris]                = useState(true)

    const [data_personal, set_data_personal]                = useState(null)
    const [data_family, set_data_family]                    = useState([])
    const [data_child, set_data_child]                      = useState([])
    const [data_bank, set_data_bank]                        = useState([])
    const [data_subscription, set_data_subscription]        = useState(null)
    const [data_waris, set_data_waris]                      = useState([])

    const [loading_page, set_loading_page]                  = useState(false)
    const { showModal, hideModal }                          = useModal()

    const [loading_kematian, set_loading_kematian]          = useState(false)
    const [modal_kematian, set_modal_kematian]              = useState(false)
    const [modal_form_kematian, set_modal_form_kematian]    = useState(false)

    const [kematian_id, set_kematian_id]                    = useState(null)
    const [keterangan_kematian, set_keterangan_kematian]    = useState("")
    const [lokasi_kematian, set_lokasi_kematian]            = useState("")
    const [tarikh_kematian, set_tarikh_kematian]            = useState(new Date())
    const [masa_kematian, set_masa_kematian]                = useState(moment(new Date).format("hh:mm"))
    const [nama_pemaklum, set_nama_pemaklum]                = useState("")
    const [emel_pemaklum, set_emel_pemaklum]                = useState("")
    const [phone_pemaklum, set_phone_pemaklum]              = useState("")

    const _onApprove = async () => {
        set_modal_approve(false);
        set_modal_reject(false);
        set_loading_page(true);
    
        let api = await API("kariah/ahli/update-status-kariah", { kariah_id: state.member_id, status: "Accept" }, "POST", true);
        set_loading_page(false);
    
        setTimeout(() => {
            if (api.status_code === 200) {
                showModal(
                    <div>
                        <p className='font-medium text-gray-900 text-sm text-center'>
                            Pengesahan kariah di bawah institusi anda telah berjaya.
                        </p>
                    </div>,
                    {
                        title: 'Pengesahan Berjaya Diterima',
                        themeClass: 'bg-success-600',
                        centered: true,
                        footerContent: (
                            <div className='flex gap-3 justify-center'>
                                <Button
                                    onClick={() => navigate(-1)}
                                    className='bg-success-600 text-white text-sm py-2 px-4 rounded'
                                >
                                    Tutup
                                </Button>
                            </div>
                        ),
                        onClose: () => navigate(-1),
                    }
                );
            } else {
                showModal(
                    <div>
                        <p className='font-medium text-gray-900 text-sm text-center'>
                            {api.message}
                        </p>
                    </div>,
                    {
                        title: 'Pengesahan Gagal',
                        themeClass: 'bg-danger-600',
                        centered: true,
                        footerContent: (
                            <div className='flex gap-3 justify-center'>
                                <Button
                                    onClick={hideModal}
                                    className='bg-danger-600 text-white text-sm py-2 px-4 rounded'
                                >
                                    Tutup
                                </Button>
                            </div>
                        ),
                        onClose: hideModal,
                    }
                );
            }
        }, 0);
    };
    
    

    const _onReject = async () => {

        set_modal_approve(false)
        set_modal_reject(false)
        set_loading_page(true)

        let api = await API("kariah/ahli/update-status-kariah", { kariah_id: state.member_id, status: "Reject" }, "POST", true)
        set_loading_page(false)
        
        setTimeout(() => {
            if(api.status_code === 200) {
                showModal(
                <div className='font-medium text-sm text-gray-900 text-center'>
                    Penolakan kariah di bawah institusi anda telah berjaya.
                </div>, 
                {
                    title: 'Penolakan Berjaya Diterima',
                    themeClass: 'bg-success-600',
                    centered: true,
                    onClose: () => {
                        navigate(-1)
                    }
                })
            } else {
                showModal(
                    <div className='font-medium text-sm text-gray-900 text-center'>
                        {api.message}
                    </div>, 
                    {
                        title: 'Penolakan Kariah Gagal',
                        themeClass: 'bg-danger-600',
                        centered: true,
                        onClose: () => {
                            hideModal()
                        }
                    })
            }
        }, 1000);
    }

    const fetch__data = async () => {

        set_loading(true)
        set_loading_bank(true)
        set_loading_child(true)
        set_loading_family(true)
        set_loading_personal(true)
        set_loading_subscription(true)
        set_loading_waris(true)
        set_loading_kematian(true)

        let api = await API("kariah/ahli/maklumat-peribadi-ahli", { 
            member_id: state.member_id, 
            type: active_menu_value 
        }, "POST", true)

        if(api.status_code === 200 && active_menu_value === "Personal") {
            set_data_personal(api.data)
        }

        if(api.status_code === 200 && active_menu_value === "Family") {
            set_data_family(api.data)
        }

        if(api.status_code === 200 && active_menu_value === "Child") {
            set_data_child(api.data)
        }

        if(api.status_code === 200 && active_menu_value === "Bank") {
            set_data_bank(api.data)
        }

        if(api.status_code === 200 && active_menu_value === "Subscription") {
            set_data_subscription(api.data)
        }

        if(api.status_code === 200 && active_menu_value === "Waris") {
            set_data_waris(api.data)
        }

        if(api.status_code === 200 && active_menu_value === "Kematian") {

            if(api.data) {
                set_kematian_id(api.data.kematian_id)
                set_keterangan_kematian(api.data.kematian_description)
                set_lokasi_kematian(api.data.kematian_location)
                set_tarikh_kematian(new Date(api.data.kematian_date))
                set_masa_kematian(moment(moment().format("YYYY-MM-DD") + " " + api.data.kematian_time).format("hh:mm"))
                set_nama_pemaklum(api.data.informant_name)
                set_emel_pemaklum(api.data.informant_email)
                set_phone_pemaklum(api.data.informant_phone)
            }

        }

        setTimeout(() => {
            set_loading(false)
            set_loading_bank(false)
            set_loading_child(false)
            set_loading_family(false)
            set_loading_personal(false)
            set_loading_subscription(false)
            set_loading_waris(false)
            set_loading_kematian(false)
        }, 1000);
    }

    const create_rekod_kematian = async () => {

        set_modal_kematian(false)
        set_modal_form_kematian(false)

        if(!keterangan_kematian) {
            toast.error("Harap maaf! Maklumat maklumat keterangan kematian ahli kariah tidak lengkap.")
        }
        else if(!lokasi_kematian) {
            toast.error("Harap maaf! Maklumat maklumat lokasi kematian ahli kariah tidak lengkap.")
        }
        else if(!tarikh_kematian) {
            toast.error("Harap maaf! Maklumat tarikh kematian ahli kariah tidak lengkap.")
        }
        else if(!masa_kematian) {
            toast.error("Harap maaf! Maklumat masa kematian ahli kariah tidak lengkap.")
        }
        else if(!nama_pemaklum) {
            toast.error("Harap maaf! Maklumat nama pemaklum kematian ahli kariah tidak lengkap.")
        }
        else {

            set_loading_kematian(true)

            let json = {
                member_id: state.member_id,
                kematian_description: keterangan_kematian,
                kematian_location: lokasi_kematian,
                kematian_date: moment(new Date(tarikh_kematian)).format("YYYY-MM-DD"),
                kematian_time: moment(new Date(masa_kematian)).format("hh:mm"),
                informant_name: nama_pemaklum,
                informant_email: emel_pemaklum,
                informant_phone: phone_pemaklum
            }

            let api = await API("kariah/ahli/tambah-rekod-kematian-ahli", json, "POST", true)
            console.log("Log Create Rekod Kematian : ", api)
            
            set_loading_kematian(false)

            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
            else {
                toast.error(api.message)
            }

        }
    }

    useEffect(() => {
        fetch__data()
    }, [current_active_menu, active_menu_value])

    if(loading_page) return <Loading />

    return (
        <div>

            <Modal
            title='Sahkan Permohonan Ahli Kariah'
            uncontrol={false}
            activeModal={modal_approve}
            labelClass="btn-outline-success"
            themeClass="bg-success-600"
            centered={true}
            onClose={() => {
                set_modal_approve(false)
            }}
            footerContent={
                <div className='flex gap-3'>
                    <Button onClick={() => set_modal_approve(false)} className='bg-white text-gray-900 text-sm'>Tidak</Button>
                    <Button onClick={_onApprove} className='bg-success-600 text-white text-sm'>Ya</Button>
                </div>
            }
            >
                <div>
                    <p className='font-medium text-gray-900 text-sm'>Anda pasti untuk menerima permohonan kariah ini sebagai ahli kariah untuk institusi anda?</p>
                </div>
            </Modal>

            <Modal
            title='Menolak Permohonan Ahli Kariah'
            uncontrol={false}
            activeModal={modal_reject}
            labelClass="btn-outline-danger"
            themeClass="bg-danger-600"
            centered={true}
            onClose={() => {
                set_modal_reject(false)
            }}
            footerContent={
                <div className='flex gap-3'>
                    <Button onClick={() => set_modal_reject(false)} className='bg-white text-gray-900 text-sm'>Tidak</Button>
                    <Button onClick={_onReject} className='bg-danger-600 text-white text-sm'>Ya</Button>
                </div>
            }
            >
                <div>
                    <p className='font-medium text-gray-900 text-sm'>Anda pasti untuk menolak permohonan kariah ini sebagai ahli kariah untuk institusi anda?</p>
                </div>
            </Modal>

            <Modal
            className='max-w-6xl'
            themeClass='bg-teal-600 text-white'
            title='Kemaskini Maklumat Kematian Ahli Kariah'
            activeModal={modal_form_kematian}
            centered={true}
            onClose={() => set_modal_form_kematian(false)}
            footerContent={(
                <>
                <div>
                    <Button className='' onClick={() => set_modal_form_kematian(false)}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={() => {
                            set_modal_form_kematian(false)
                            set_modal_kematian(true)
                        }}>Ya</Button>
                </div>
                </>
            )}
            >
                <div>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Borang Kemaskini Maklumat Kematian Ahli Kariah</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat di bawah dan pastikan semua maklumat adalah benar dan sah.</p>
                    </div>
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
                    <div className='mt-6'>
                        <div className='grid grid-cols-1 gap-3'>
                            <Textarea 
                                label={'Keterangan Kematian'}
                                placeholder={'Contoh: Ahli kariah ini disahkan meninggal dunia akibat sakit tenat dan mempunya 2 penyakit kronik iaitu kegagal buah pinggang dan kegagalan jantung untuk berfungsi.'}
                                dvalue={keterangan_kematian}
                                onChange={e => set_keterangan_kematian(e.target.value)}
                                
                            />
                            <Textarea 
                                label={'Lokasi Kematian'}
                                placeholder={'Contoh: 24 D Kampung Bukit Larut, Mukim Ulu Melaka, 07000 Langkawi, Kedah.'}
                                dvalue={lokasi_kematian}
                                onChange={e => set_lokasi_kematian(e.target.value)}
                                
                            />

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label htmlFor="" className='form-label'>Tarikh Kematian</label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={tarikh_kematian}
                                        onChange={(date) => set_tarikh_kematian(date)}
                                        id="default-picker"
                                        options={{
                                            maxDate: new Date()
                                        }}
                                        style={{ background: "white" }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="" className="form-label">Masa Kematian</label>
                                    <Flatpickr
                                        className="form-control py-2"
                                        value={masa_kematian}
                                        id="timepicker"
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true,
                                            //maxTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Provides a valid string
                                        }}
                                        onChange={(date) => set_masa_kematian(date)}
                                        style={{ background: "white" }}
                                    />
                                </div>

                            </div>

                            <div>
                                <Textinput 
                                    label={'Nama Pemaklum Kematian'}
                                    placeholder={'Contoh: Muhd Aqmar Bin Khilmie.'}
                                    defaultValue={nama_pemaklum}
                                    onChange={e => set_nama_pemaklum(e.target.value)}
                                    
                                />
                            </div>
                            <div>
                                <Textinput 
                                    label={'E-mel Pemaklum Kematian'}
                                    placeholder={'Contoh: akmar@email.com.'}
                                    defaultValue={emel_pemaklum}
                                    onChange={e => set_emel_pemaklum(e.target.value)}
                                    
                                />
                            </div>
                            <div>
                                <Textinput 
                                    name={"NoPhonePemaklum"}
                                    label={'No. Telefon Pemaklum Kematian'}
                                    placeholder={'Contoh: 0123456789'}
                                    defaultValue={phone_pemaklum}
                                    onChange={e => set_phone_pemaklum(e.target.value)}
                                    isNumberOnly
                                    maxLength={15}
                                    register={() => {}}
                                    
                                />
                            </div>
                        </div>
                    </div>
                </div>                
            </Modal>

            <Modal
            themeClass='bg-teal-600 text-white'
            title='Pengesahan Maklumat Kematian Ahli Kariah'
            activeModal={modal_kematian}
            centered={true}
            onClose={() => set_modal_kematian(false)}
            footerContent={(
                <>
                <div>
                    <Button 
                        className='' 
                        onClick={() => {
                            set_modal_kematian(false)
                            set_modal_form_kematian(true)
                        }}>Tutup</Button>
                    <Button 
                        className='bg-teal-600 text-white' 
                        onClick={() => {
                            set_modal_kematian(false)
                            set_modal_form_kematian(false)
                            create_rekod_kematian() 
                        }}>Teruskan Kemaskini</Button>
                </div>
                </>
            )}
            >
                <div>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Pengesahan Kemaskini Maklumat Kematian Ahli Kariah</p>
                        <p className='mt-3 font-normal text-gray-600 text-sm'>Anda pasti semua maklumat kematian adalah tepat dan benar? Jika anda teruskan ini, maka pengguna ini tidak akan boleh log masuk ke dalam sistem ahli kariah.</p>
                    </div>
                </div>                
            </Modal>


            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Kariah - {state.full_name}</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat ahli kariah yang berdaftar di bawah institusi anda. Klik pada senarai kariah di bawah untuk melihat maklumat lanjut.</p>  
                    </div>
                    {
                        loading_personal === false && ( data_personal.is_verified === "Pending" || data_personal.is_verified === "Reject" ) && (
                            <div className='flex flex-row gap-3'>
                                <Button onClick={() => set_modal_approve(true)} className='bg-success-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                                    <Icons icon={'heroicons:check'} className={'text-lg'}/>Terima Permohonan
                                </Button>
                                <Button onClick={() => set_modal_reject(true)} className='bg-danger-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                                    <Icons icon={'heroicons:x-mark'} className={'text-lg'}/>Tolak Permohonan
                                </Button>
                            </div>
                        )
                    }
                    {
                        loading_personal === false && ( data_personal.is_verified === "Suspended" || data_personal.is_verified === "Others") && (
                            <div className='flex flex-row gap-3'>
                                <Button onClick={() => set_modal_approve(true)} className='bg-success-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                                    <Icons icon={'heroicons:check'} className={'text-lg'}/>Aktifkan Akaun Kariah
                                </Button>
                            </div>
                        )
                    }
                </div>
            </section> 

            {
                loading_personal === false && data_personal.is_verified === "Pending" && (
                    <section className='mt-6'>
                    <Alert title="Pengesahan Ahli Kariah Sah" intent='warning'>
                        Sila buat pengesahan untuk ahli kariah ini dengan klik pada butang menerima atau menolak permohonan kariah di atas.
                    </Alert>
                    </section>
                )
            }

            {
                loading_personal === false && data_personal.is_verified === "Suspended" && (
                    <section className='mt-6'>
                    <Alert title="Akaun Dibeku" intent='warning'>
                        Anda telah membuat pembekuan akaun ahli kariah kepada pengguna ini. Klik butang di atas untuk membuat pengaktifan akaun pengguna ini.
                    </Alert>
                    </section>
                )
            }

            {
                loading_personal === false && data_personal.is_verified === "Verified" && (
                    <section className='mt-6'>
                    <Alert title="Ahli Kariah Sah" intent='success'>
                        Maklumat kariah ini adalah merupakan ahli kariah yang telah berdaftar di bawah institusi anda dan sah.
                    </Alert>
                    </section>
                )
            }

            {
                loading_personal === false && data_personal.is_verified === "Reject" && (
                    <section className='mt-6'>
                    <Alert title="Permohonan Ditolak" intent='danger'>
                        Anda telah menolak permohonan ahli kariah untuk pengguna ini. Sila buat semakan terlebih dahulu untuk membuat penerimaan permohonan akaun ahli kariah.
                    </Alert>
                    </section>
                )
            }

            {
                loading_personal === false && data_personal.is_verified === "Deceased" && (
                    <section className='mt-6'>
                    <Alert title="Ahli Kariah Meninggal Dunia" intent='danger'>
                        Ahli kariah ini telah mempunyai rekod kematian. Anda tidak boleh membuat kemaskini akaun ahli kariah ini.
                    </Alert>
                    </section>
                )
            }

            <section className='mt-6'>
                <div className='flex flex-wrap gap-3'>
                {
                    main_menu.map((data, index) => (
                        <Button 
                            key={index} 
                            onClick={() => {
                                set_loading(true)
                                set_loading_bank(true)
                                set_loading_child(true)
                                set_loading_family(true)
                                set_loading_personal(true)
                                set_loading_subscription(true)
                                set_loading_kematian(true)
                                set_current_active_menu(data.title)
                                set_active_menu_value(data.value)
                            }}
                            className={`${data.title === current_active_menu ? 'bg-primary-600 text-white text-sm' : 'bg-white border border-gray-200 text-gray-600'} uppercase text-clip`}>
                            <p className='text-sm'>{data.title}</p>
                        </Button>
                    ))
                }
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    {
                        (loading || loading_bank || loading_child || loading_family || loading_personal || loading_subscription || loading_kematian ) && (
                            <Pane className='flex items-center justify-center'>
                                <Spinner size={24} className='text-gray-600' />
                            </Pane>
                        )
                    }

                    {
                        loading_personal === false && loading === false && active_menu_value === "Personal" && (
                            <>
                            <div className='flex flex-col gap-3'>

                                <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-5'>
                                    <div className=''>
                                        <Textinput 
                                        type={'text'}
                                        label={'Nama Penuh Ahli Kariah'}
                                        placeholder='Contoh: Muhammad Firdaus Bin Mohd Fazil'
                                        defaultValue={data_personal.full_name}
                                        disabled={true}
                                        />
                                    </div>
                                    <div className=''>
                                        <Textinput 
                                        type={'number'}
                                        label={'No. Kad Pengenalan'}
                                        placeholder='Contoh: XXXXXXXXXX'
                                        defaultValue={data_personal.ic_number}
                                        disabled={true}
                                        />
                                    </div>
                                    <div className=''>
                                        <Textinput 
                                        label={'Tarikh Lahir'}
                                        defaultValue={moment(data_personal.date_of_birth).format("DD MMMM YYYY")}
                                        disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <Textinput 
                                            label={'Status Perkahwinan'}
                                            defaultValue={data_personal.marital_status}
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <Textinput 
                                            label={'Status Pekerjaan'}
                                            defaultValue={data_personal.employment_status}
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <Textinput 
                                            label={'Pendapatan Bulanan'}
                                            defaultValue={data_personal.range_salary}
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <Textinput 
                                            label={'Tahap Pendidikan'}
                                            defaultValue={data_personal.education_status}
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <Textinput 
                                            label={'Jantina'}
                                            defaultValue={data_personal.gender}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className=''>
                                        <Textinput 
                                            label={'E-mel'}
                                            defaultValue={data_personal.email_address}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className=''>
                                        <Textinput 
                                            label={'No. Telefon'}
                                            defaultValue={data_personal.phone_number}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <hr className='mt-12' />
                                <div className='mt-6'>
                                    <p className='mt-3 font-semibold text-gray-900'>Alamat Surat-menyurat</p>
                                    <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                        <Textinput 
                                            label={"Alamat 1"}
                                            placeholder='Contoh: Alamat 1 - No 44, Lorong TSR 2 Taman Sedia Raja'
                                            defaultValue={data_personal.address_1}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Alamat 2"}
                                            placeholder='Contoh: Alamat 2 - tidak wajib'
                                            defaultValue={data_personal.address_2}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Alamat 3"}
                                            placeholder='Contoh: Alamat 3 - tidak wajib'
                                            defaultValue={data_personal.address_3}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                        <Textinput 
                                            label={"Poskod"}
                                            placeholder='Contoh: 71450'
                                            defaultValue={data_personal.postcode}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Bandar"}
                                            placeholder='Contoh: Chembong'
                                            defaultValue={data_personal.city}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Negeri"}
                                            placeholder='Contoh: Selangor'
                                            defaultValue={data_personal.state}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <hr className='mt-12' />
                                <div className='mt-6'>
                                    <p className='mt-3 font-semibold text-gray-900'>Alamat Tetap</p>
                                    <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                        <Textinput 
                                            label={"Alamat 1"}
                                            placeholder='Contoh: Alamat 1 - No 44, Lorong TSR 2 Taman Sedia Raja'
                                            defaultValue={data_personal.live_address_1}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Alamat 2"}
                                            placeholder='Contoh: Alamat 2 - tidak wajib'
                                            defaultValue={data_personal.live_address_2}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Alamat 3"}
                                            placeholder='Contoh: Alamat 3 - tidak wajib'
                                            defaultValue={data_personal.live_address_3}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                        <Textinput 
                                            label={"Poskod"}
                                            placeholder='Contoh: 71450'
                                            defaultValue={data_personal.live_postcode}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Bandar"}
                                            placeholder='Contoh: Chembong'
                                            defaultValue={data_personal.live_city}
                                            disabled={true}
                                        />
                                        <Textinput 
                                            label={"Negeri"}
                                            placeholder='Contoh: Selangor'
                                            defaultValue={data_personal.live_state}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            </>
                        )
                    }

                    {
                        loading_family === false && active_menu_value === "Family" && (
                            <>
                            <div className='flex flex-col gap-3'>
                                {
                                    data_family === null && (
                                        <Pane>
                                            <p className='text-sm text-gray-600 text-center'>Ahli kariah ini tidak mempunyai sebarang maklumat keluarga & pasangan.</p>
                                        </Pane>
                                    )
                                }
                                {
                                    data_family !== null && (
                                        <>
                                            <div>
                                                <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                    <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                    <td width={'30%'} className='p-3 font-semibold text-sm'>Nama</td>
                                                    <td width={'30%'} className='p-3 font-semibold text-sm'>E-mel</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>No. Telefon</td>
                                                    {/* <td width={'20%'} className='p-3 font-semibold text-sm text-center'>Jumlah Tanggungan</td> */}
                                                </thead>
                                                <tbody className='text-sm p-3'>
                                                    {
                                                        data_family.length < 1 && (
                                                            <tr className='border border-gray-100 p-3'>
                                                                <td colSpan={5} className='p-3 text-center'>Anda tidak mempunyai sebarang maklumat pasangan.</td>
                                                            </tr>
                                                        )
                                                    }

                                                    {
                                                        data_family.length > 0 && data_family.map((data, index) => (
                                                            <tr key={index} className='border border-gray-100 p-3'>
                                                                <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                <td width={'30%'} className='p-3 font-semibold text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.spouse_name}</p>
                                                                </td>
                                                                <td width={'30%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.spouse_email}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.spouse_phone}</p>
                                                                </td>
                                                                {/* <td width={'20%'} className='p-3 font-normal text-sm text-clip text-center'>
                                                                    <p className='font-normal text-gray-900'>{data.number_of_dependents}</p>
                                                                </td> */}
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                                </table>
                                            </div>
                                            {/* <div className='grid gap-3'>
                                                <Textinput 
                                                    label={'Nama Pasangan'}
                                                    placeholder='Contoh: Nama Pasangan'
                                                    defaultValue={data_family && data_family.spouse_name}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className='grid gap-3'>
                                                <Textinput 
                                                    label={'Jumlah Tanggungan'}
                                                    placeholder='Contoh: 0'
                                                    defaultValue={Number(data_family && data_family.number_of_dependents)}
                                                    disabled={true}
                                                />
                                            </div> */}
                                        </>
                                    )
                                }
                            </div>
                            </>
                        )
                    }

                    {
                        loading_child === false && active_menu_value === "Child" && (
                            <>
                            <div className='flex flex-col gap-3'>
                                {/* {
                                    data_child.length > 0 && data_child.map((item, index) => (
                                        <>
                                            <div>
                                                <p className='font-medium text-sm text-gray-900'>Tanggungan - No. {index + 1}</p>
                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                                    <Textinput 
                                                        label={'Nama Penuh'}
                                                        placeholder='Contoh: Aqmar Khilmie'
                                                        defaultValue={item.name && item.name}
                                                        disabled={true}
                                                    />
                                                    <Textinput 
                                                        label={'Tarikh Lahir'}
                                                        placeholder='Contoh: 1990-10-12'
                                                        defaultValue={item.date_of_birth && moment(item.date_of_birth).format("DD MMMM YYYY")}
                                                        disabled={true}
                                                    />
                                                    <Textinput 
                                                        label={'Status'}
                                                        placeholder='Contoh: Aktif'
                                                        defaultValue={item.status && item.status}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ))
                                } */}
                                {
                                    data_child.length < 1 && (
                                        <Pane>
                                            <p className='text-sm text-gray-600 text-center'>Pengguna ini tidak mempunyai sebarang maklumat tanggungan.</p>
                                        </Pane>
                                    )
                                }
                                {
                                    data_child.length > 0 && (
                                        <>
                                        <div>
                                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                    <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Pasangan</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Nama</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>E-mel</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>No. Telefon</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Hubungan</td>
                                                </thead>
                                                <tbody className='text-sm p-3'>
                                                    {
                                                        data_child.length < 1 && (
                                                            <tr className='border border-gray-100 p-3'>
                                                                <td colSpan={5} className='p-3 text-center'>Anda tidak mempunyai sebarang maklumat tanggungan atau ahli keluarga.</td>
                                                            </tr>
                                                        )
                                                    }

                                                    {
                                                        data_child.length > 0 && data_child.map((data, index) => (
                                                            <tr key={index} className='border border-gray-100 p-3'>
                                                                <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                <td width={'20%'} className='p-3 font-semibold text-sm text-clip '>
                                                                    <p className='font-normal text-gray-900'>{data.spouse_name}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-semibold text-sm text-clip '>
                                                                    <p className='font-normal text-gray-900'>{data.name}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.email}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.phone}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.relation}</p>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                                </table>
                                        </div>
                                        </>
                                    )
                                }
                            </div>
                            </> 
                        )
                    }

                    {
                        loading_bank === false && active_menu_value === "Bank" && (
                            <>
                            <div className='flex flex-col gap-3'>
                                {
                                    data_bank.length > 0 && data_bank.map((item, index) => (
                                        <>
                                            <div>
                                                <p className='font-medium text-sm text-gray-900'>Maklumat Perbankan - No. {index + 1}</p>
                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                                    <Textinput 
                                                        label={'Nama Pemegang'}
                                                        defaultValue={item.bank_holder_name}
                                                        disabled={true}
                                                    />
                                                    <Textinput 
                                                        label={'Bank'}
                                                        defaultValue={item.bank_name}
                                                        disabled={true}
                                                    />
                                                    <Textinput 
                                                        label={'No. Akaun'}
                                                        defaultValue={item.bank_account_number}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }
                                {
                                    data_bank.length < 1 && (
                                        <Pane>
                                            <p className='text-sm text-gray-600 text-center'>Pengguna ini tidak mempunyai sebarang maklumat perbankan.</p>
                                        </Pane>
                                    )
                                }
                            </div>
                            </> 
                        )
                    }

                    {
                        loading_subscription === false && loading === false && active_menu_value === "Subscription" && (
                            <>
                            <div className='flex flex-col gap-3'>
                                <div className='grid grid-cols-1 gap-3'>
                                    {
                                        data_subscription === null && (
                                            <Pane>
                                                <p className='text-sm text-gray-600 text-center'>Pengguna ini tidak mempunyai sebarang maklumat keahlian kariat kematian.</p>
                                            </Pane>
                                        )
                                    }
                                    {
                                        data_subscription !== null && (
                                            <>
                                                <Textinput 
                                                    label={'Jenis Keahlian Khairat'}
                                                    defaultValue={`Keahlian ` + data_subscription.subscription_type}
                                                    disabled={true}
                                                />
                                                <Textinput 
                                                    label={'Status'}
                                                    defaultValue={
                                                        data_subscription.status === 'Active' 
                                                            ? 'Aktif' 
                                                            : data_subscription.status === 'Pending' 
                                                            ? 'Dalam Proses' 
                                                            : data_subscription.status
                                                    }
                                                    disabled={true}
                                                />
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            </>
                        )
                    }

                    {
                        loading_waris === false && active_menu_value === "Waris" && (
                            <>
                                {
                                    data_waris.length < 1 && (
                                        <>
                                        <Pane>
                                            <p className='text-sm text-gray-600 text-center'>Ahli kariah ini tidak mempunyai sebarang maklumat waris.</p>
                                        </Pane>
                                        </>
                                    )
                                }
                                {
                                    data_waris.length > 0 && (
                                        <>
                                        <div>
                                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                    <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                    <td width={'30%'} className='p-3 font-semibold text-sm'>Nama</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Hubungan</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Alamat</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm'>Maklumat Perbankan</td>
                                                </thead>
                                                <tbody className='text-sm p-3'>
                                                    {
                                                        data_waris.length < 1 && (
                                                            <tr className='border border-gray-100 p-3'>
                                                                <td colSpan={5} className='p-3 text-center'>Anda tidak mempunyai sebarang maklumat pasangan.</td>
                                                            </tr>
                                                        )
                                                    }

                                                    {
                                                        data_waris.length > 0 && data_waris.map((data, index) => (
                                                            <tr key={index} className='border border-gray-100 p-3'>
                                                                <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                <td width={'30%'} className='p-3 font-semibold text-sm text-clip'>
                                                                    <p className='font-semibold text-gray-900'>{data.waris_fullname}</p>
                                                                    <p className='font-normal text-gray-900'>{data.waris_email}</p>
                                                                    <p className='font-normal text-gray-900'>{data.waris_phone}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.waris_relationship}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.waris_address}</p>
                                                                </td>
                                                                <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                                    <p className='font-normal text-gray-900'>{data.waris_bank_name}</p>
                                                                    <p className='font-normal text-gray-900'>{data.waris_bank_account_number}</p>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        </>
                                    )
                                }
                            </>
                        )
                    }

                    {
                        loading_kematian === false && active_menu_value === "Kematian" && (
                            <>
                                <div>
                                    {
                                        kematian_id === null && (
                                            <Pane>
                                                <p className='text-sm text-gray-600 text-center'>Ahli kariah ini tidak mempunyai sebarang rekod kematian.</p>
                                                <div className='mt-3 flex justify-center items-center'>
                                                    <Button className='bg-teal-600 text-white' onClick={() => set_modal_form_kematian(true)}>Kemaskini Maklumat Kematian</Button>
                                                </div>
                                            </Pane>
                                        )
                                    }

                                    {
                                        kematian_id !== null && (
                                            <>
                                            <div>
                                                <div>
                                                    <div>
                                                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Kematian Ahli Kariah</p>
                                                        <p className='font-normal text-gray-600 text-sm'>Berikut adalah maklumat mengenai kematian ahli kariah ini.</p>
                                                    </div>
                                                    <div className='mt-6'>
                                                        <div className='grid grid-cols-1 gap-3'>
                                                            <Textarea 
                                                                label={'Keterangan Kematian'}
                                                                placeholder={'Contoh: Ahli kariah ini disahkan meninggal dunia akibat sakit tenat dan mempunya 2 penyakit kronik iaitu kegagal buah pinggang dan kegagalan jantung untuk berfungsi.'}
                                                                dvalue={keterangan_kematian}
                                                                onChange={e => set_keterangan_kematian(e.target.value)}
                                                                disabled={true}
                                                            />
                                                            <Textarea 
                                                                label={'Lokasi Kematian'}
                                                                placeholder={'Contoh: 24 D Kampung Bukit Larut, Mukim Ulu Melaka, 07000 Langkawi, Kedah.'}
                                                                dvalue={lokasi_kematian}
                                                                onChange={e => set_lokasi_kematian(e.target.value)}
                                                                disabled={true}
                                                            />

                                                            <div className='grid grid-cols-2 gap-3'>
                                                                <div>
                                                                    <label htmlFor="" className='form-label'>Tarikh Kematian</label>
                                                                    <Flatpickr
                                                                        className="form-control py-2"
                                                                        value={tarikh_kematian}
                                                                        onChange={(date) => set_tarikh_kematian(date)}
                                                                        id="default-picker"
                                                                        disabled={true}
                                                                        style={{ background: "white" }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label htmlFor="" className='form-label'>Masa Kematian</label>
                                                                    <Flatpickr
                                                                        className="form-control py-2"
                                                                        value={masa_kematian}
                                                                        id="timepicker"
                                                                        options={{
                                                                            enableTime: true,
                                                                            noCalendar: true,
                                                                            dateFormat: "H:i",
                                                                            time_24hr: true,
                                                                        }}
                                                                        onChange={(date) => set_masa_kematian(date)}
                                                                        disabled={true}
                                                                        style={{ background: "white" }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Textinput 
                                                                    label={'Nama Pemaklum Kematian'}
                                                                    placeholder={'Contoh: Muhd Aqmar Bin Khilmie.'}
                                                                    defaultValue={nama_pemaklum}
                                                                    onChange={e => set_nama_pemaklum(e.target.value)}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Textinput 
                                                                    label={'E-mel Pemaklum Kematian'}
                                                                    placeholder={'Contoh: akmar@email.com.'}
                                                                    defaultValue={emel_pemaklum}
                                                                    onChange={e => set_emel_pemaklum(e.target.value)}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Textinput 
                                                                    label={'No. Telefon Pemaklum Kematian'}
                                                                    placeholder={'Contoh: 0123456789.'}
                                                                    defaultValue={phone_pemaklum}
                                                                    onChange={e => set_phone_pemaklum(e.target.value)}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>  
                                            </div>
                                            </>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }


                </Card>
            </section>

            {/* {
                Object.keys(state.maklumat_kariah).map((section, index) => section === current_active_menu && (
                    <section className='mt-6' key={index}>
                        <Card>
                            <div>
                                <p className='font-semibold text-gray-900 uppercase'>{section.replaceAll("_", " ")}</p>
                            </div>
                            <div className='mt-3'>
                                {
                                    section !== 'family_information' && Object.keys(state.maklumat_kariah[section]).map((title, index) => 
                                        (
                                        <div className='mb-3' key={index}>
                                        <Textinput 
                                            label={title.replaceAll("_", " ")}
                                            disabled={true}
                                            placeholder='-- tiada maklumat --'
                                            classLabel='font-semibold text-sm text-gray-900 uppercase mb-2'
                                            defaultValue={state.maklumat_kariah[section][title]}
                                        />
                                        </div>
                                        )
                                    )
                                }

                                {
                                    section === 'family_information' && (
                                        <div>
                                            <div className='mb-3'>
                                                <Textinput 
                                                    label={'Nama Pasangan'}
                                                    disabled={true}
                                                    classLabel='font-semibold text-sm text-gray-900 uppercase mb-2'
                                                    defaultValue={state.maklumat_kariah[section]["spouse_name"]}
                                                    placeholder='-- tiada maklumat --'
                                                />
                                            </div>
                                            <div className='mb-3'>
                                                <Textinput 
                                                    label={'Jumlah Tanggungan'}
                                                    disabled={true}
                                                    classLabel='font-semibold text-sm text-gray-900 uppercase mb-2'
                                                    defaultValue={state.maklumat_kariah[section]["number_of_dependents"]}
                                                    placeholder='-- tiada maklumat --'
                                                />
                                            </div>
                                            {
                                                state.maklumat_kariah[section]["children"].length > 0 && state.maklumat_kariah[section]["children"].map((child, index) => (
                                                    <div className='mb-3'>
                                                        <Textinput 
                                                            label={`Tanggungan ${index + 1}`}
                                                            disabled={true}
                                                            classLabel='font-semibold text-sm text-gray-900 uppercase mb-2'
                                                            defaultValue={child["name"]}
                                                            placeholder='-- tiada maklumat --'
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </Card>
                    </section>
                ))
            } */}
        </div>
    );
}

export default data_personal;