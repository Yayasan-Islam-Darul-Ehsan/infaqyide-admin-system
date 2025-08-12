import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWidth from '@/hooks/useWidth';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import API_FORM_DATA, { API } from '@/utils/api';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Fileinput from '@/components/ui/Fileinput';
import Button from '@/components/ui/Button';
import { useModal } from '@/components/ui/SuperModal';
import Modal from '@/components/ui/Modal';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import Radio from '@/components/ui/Radio';
import { Spinner } from 'evergreen-ui';

BayarKhairatKematian.propTypes = {
    
};

function BayarKhairatKematian(props) {

    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading, set_loading]                                    = useState(false)
    const [loading_get_list_kariah, set_loading_get_list_kariah]    = useState(false)
    const [loading_get_waris_kariah, set_loading_get_waris_kariah]  = useState(false)

    const [list_kariah, set_list_kariah]                            = useState([])
    const [list_waris_kariah, set_list_waris_kariah]                = useState([])
    const [list_bank_kariah, set_list_bank_kariah]                  = useState([])

    const [bank_fpx, set_bank_fpx]                                  = useState([])

    const [file, set_file] = useState(null)
    const [select_member_id, set_select_member_id]                  = useState(null)
    const [select_pay_method, set_select_pay_method]                = useState(null)
    const [select_amount, set_select_amount]                        = useState(null)
    const [select_fpx, set_select_fpx]                              = useState(null)
    const [select_receiver_name, set_select_receiver_name]          = useState(null)
    const [select_receiver_email, set_select_receiver_email]        = useState(null)
    const [select_receiver_phone, set_select_receiver_phone]        = useState(null)
    const [select_receiver_relay, set_select_receiver_relay]        = useState(null)
    const [select_file, set_select_file]                            = useState(null)
    const [select_bayar_kepada, set_bayar_kepada]                   = useState("")

    const [confirmation_modal, set_confirmation_modal]              = useState(false)
    const { showModal, hideModal } = useModal()

    const [select_ahli_keluarga, set_select_ahli_keluarga]          = useState("")
    const [select_waris, set_select_waris]                          = useState("")

    const [list_ahli_keluarga, set_list_ahli_keluarga]              = useState([])
    const [list_waris, set_list_waris]                              = useState([])

    const [option_for_ahli_keluarga, set_option_for_ahli_keluarga]  = useState([])
    const [option_for_waris, set_option_for_waris]                  = useState([])

    const [loading_option, set_loading_option]                      = useState(false)
    const [loading_on_select, set_loading_on_select]                = useState(false)

    const get__list__kariah = async () => {
        set_loading_get_list_kariah(true)
        let api = await API("kariah/ahli/senarai-ahli/deceased", {}, "GET", true)
        if(api.status_code === 200) {
            let array = []
            array.push({
                label: '-- Pilih Ahli Kariah --',
                value: null
            })
            for (let i = 0; i < api.data.length; i++) {
                array.push({
                    label: api.data[i]["full_name"],
                    value: api.data[i]["member_id"]
                })
            }
            set_list_kariah(array)
        }
        set_loading_get_list_kariah(false)
    }

    const get__waris__kariah = async (member_id) => {

    }

    const get__list__bank__kariah = async (member_id) => {

    }

    const list_bank_fpx = async () => {
        let api     = await fetch("https://toyyibpay.com/api/getBankFPX")
        let json    = await api.json()

        set_bank_fpx(json)
    }

    const get__senarai__ahli__keluarga = async () => {
        set_loading_option(true)
        let api = await API("kariah/ahli/maklumat-peribadi-ahli", { member_id: select_member_id, type: "Child" }, "POST", true)
        console.log("Log Api Get Kariah Personal Info : ", api)
        if(api.status_code === 200) {
            set_list_ahli_keluarga(api.data)
            if(api.data.length > 0) {
                let array = []
                for (let i = 0; i < api.data.length; i++) {
                    array.push({
                        label: api.data[i]["name"] + ' - ' + api.data[i]["relation"],
                        value: api.data[i]["name"]
                    })
                }
                set_option_for_ahli_keluarga(array)
            }
            
        }
        set_loading_option(false)
    }

    const get__senarai__waris = async () => {
        set_loading_option(true)
        let api = await API("kariah/ahli/maklumat-peribadi-ahli", { member_id: select_member_id, type: "Waris" }, "POST", true)
        console.log("Log Api Get Kariah Personal Info : ", api)
        if(api.status_code === 200) {
            set_list_waris(api.data)
            if(api.data.length > 0) {
                let array = []
                for (let i = 0; i < api.data.length; i++) {
                    array.push({
                        label: api.data[i]["waris_fullname"] + ' - ' + api.data[i]["waris_relationship"],
                        value: api.data[i]["waris_fullname"]
                    })
                }
                set_option_for_waris(array)
            }
        }
        set_loading_option(false)
    }

    const create_payout = async () => {
        set_confirmation_modal(false)

        if(!select_member_id) {
            toast.error("Tiada ahli kariah dipilih. Sila pastikan anda sudah memilih ahli kariah sebelum meneruskan bayaran.")
        }
        else if(!select_pay_method) {
            toast.error("Tiada pilihan kaedah bayaran. Sila pastikan anda sudah memilih kaedah bayaran sebelum meneruskan bayaran.")
        }
        else if(!select_amount || parseFloat(select_amount) === 0.00) {
            toast.error("Tiada jumlah bayaran. Sila pastikan anda sudah mengisi jumlah amaun bayaran sebelum meneruskan bayaran.")
        }
        else if(!select_receiver_name) {
            toast.error("Tiada nama penerima. Sila pastikan anda sudah mengisi nama penerima sebelum meneruskan bayaran.")
        }
        else if(!select_receiver_email) {
            toast.error("Tiada E-mel penerima. Sila pastikan anda sudah mengisi E-mel penerima sebelum meneruskan bayaran.")
        }
        else if(!select_receiver_phone) {
            toast.error("Tiada nombor telefon penerima. Sila pastikan anda sudah mengisi nombor telefon penerima sebelum meneruskan bayaran.")
        }
        else if(!select_receiver_relay) {
            toast.error("Tiada hubungan penerima. Sila pastikan anda sudah mengisi hubungan penerima sebelum meneruskan bayaran.")
        }
        else if(select_pay_method === "Cash" && ( !select_file || select_file === null )) {
            toast.error("Tiada lampiran resit bayaran. Sila lampirkan resit bayaran untuk kaedah pembayaran melalui cash.")
        }
        else {

            set_loading(true)
            let form_data = null

            if(select_pay_method === "Cash") {
                form_data = [
                    { title: 'member_id', value: select_member_id },
                    { title: 'bill_name', value: `Bayaran Khairat Kematian RM${parseFloat(select_amount).toFixed(2)}` },
                    { title: 'bill_amount', value: parseFloat(select_amount).toFixed(2) },
                    { title: 'bill_mode', value: 'Debit' },
                    { title: 'bill_pay_method', value: select_pay_method },
                    { title: 'receiver_name', value: select_receiver_name },
                    { title: 'receiver_email', value: select_receiver_email },
                    { title: 'receiver_phone', value: select_receiver_phone },
                    { title: 'receiver_relation', value: select_receiver_relay },
                    { title: 'file', value: file[0] }
                ]

                let api = await API_FORM_DATA("kariah/payout/pay-cash", form_data, "POST", true)
                set_loading(true)

                if(api.status_code === 200) {
                    toast.success("Pembayaran khairat kematian kepada waris telah berjaya disimpan.")
                    setTimeout(() => {
                        navigate("/khairat-kematian/senarai-khairat-kematian")
                    }, 1000);
                } else {
                    set_loading(false)
                    toast.error(api.message)
                }
            }
            else {
                set_loading(false)
                toast.error("Harap Maaf! Kaedah bayaran ini sedang dinaiktaraf. Segala kesulitan amat dikesali.")
            }

        }
        
    }

    useEffect(() => {
        get__list__kariah()
        list_bank_fpx()
    }, [])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            labelClass="btn-outline-primary"
            themeClass="bg-teal-600"
            title='Pengesahan Bayaran Khairat Kematian'
            centered={true}
            activeModal={confirmation_modal}
            label='Pengesahan Bayaran Khairat Kematian'
            uncontrol={false}
            onClose={() => set_confirmation_modal(false)}
            footerContent={(
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={() => set_confirmation_modal(false)}>
                        Tutup
                    </Button>
                    <Button className='bg-teal-600 text-white' onClick={create_payout}>
                        Teruskan
                    </Button>
                </div>
            )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>Anda pasti untuk teruskan bayaran khairat kematian kepada waris ahli kariah ini?</p>
                </div>
            </Modal>

            {/* <Modal>

            </Modal> */}
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Pembayaran Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah borang untuk membuat bayaran khairat kematian kepada waris si mati. Sila lengkapkan maklumat borang dibawah untuk membuat bayaran khairat kematian.</p>  
                    </div>
                    {/* <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button>
                    </div> */}
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Borang Pembayaran Khairat Kematian Kepada Waris Kariah</p>
                        <p className='font-normal text-gray-600 text-xs'>Sila lengkapkan borang dibawah untuk membuat bayaran khairat kematian kepada waris si mati.</p>
                    </div>
                    <div className='mt-6'>
                        <div className='grid grid-cols-1 gap-3'>
                            <div className='grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <Select 
                                    label={'Ahli Kariah'}
                                    placeholder='-- Sila Pilih Ahli Kariah --'
                                    defaultValue={select_member_id}
                                    options={list_kariah}
                                    onChange={e => set_select_member_id(e.target.value)}
                                />
                                <div>
                                    <label htmlFor="" className='form-label'>Bayaran Khairat Kematian Kepada</label>
                                    <Radio 
                                        name={"Bayar Kepada"} 
                                        label={"Ahli Keluarga"} 
                                        value={"Ahli Keluarga"} 
                                        checked={select_bayar_kepada === "Ahli Keluarga"}
                                        onChange={e => {
                                            console.log(e)
                                            set_bayar_kepada(e.target.value)
                                            set_loading_option(true)
                                            get__senarai__ahli__keluarga()
                                            set_select_receiver_name("")
                                            set_select_receiver_email("")
                                            set_select_receiver_phone("")
                                            set_select_receiver_relay("")
                                            setTimeout(() => {
                                                set_loading_on_select(false)
                                            }, 1000);
                                        }} 
                                        disabled={select_member_id === null || select_member_id === ""}
                                    />
                                    <div className='my-1'></div>
                                    <Radio 
                                        name={"Bayar Kepada"} 
                                        label={"Waris"} 
                                        value={"Waris"} 
                                        checked={select_bayar_kepada === "Waris"}
                                        onChange={e => {
                                            console.log(e)
                                            set_bayar_kepada(e.target.value)
                                            set_loading_option(true)
                                            get__senarai__waris()
                                            set_select_receiver_name("")
                                            set_select_receiver_email("")
                                            set_select_receiver_phone("")
                                            set_select_receiver_relay("")
                                            setTimeout(() => {
                                                set_loading_on_select(false)
                                            }, 1000);
                                        }} 
                                        disabled={select_member_id === null || select_member_id === ""}
                                    />
                                    <div className='my-1'></div>
                                    <Radio 
                                        name={"Bayar Kepada"} 
                                        label={"Lain-lain"} 
                                        value={"Lain-lain"} 
                                        checked={select_bayar_kepada === "Lain-lain"}
                                        onChange={e => {
                                            console.log(e)
                                            set_bayar_kepada(e.target.value)
                                            set_select_receiver_name("")
                                            set_select_receiver_email("")
                                            set_select_receiver_phone("")
                                            set_select_receiver_relay("")
                                            //set_loading_on_select(true)

                                        }} 
                                        disabled={select_member_id === null || select_member_id === ""}
                                    />
                                </div>
                            </div>
                            <div className=''>
                                {
                                    select_bayar_kepada === "Ahli Keluarga" && (
                                        <>
                                        <div>
                                        <Select 
                                            label={'Nama Ahli Keluarga'}
                                            placeholder='-- Sila Pilih Ahli Keluarga --'
                                            defaultValue={select_ahli_keluarga}
                                            options={option_for_ahli_keluarga}
                                            onChange={e => {
                                                set_loading_on_select(true)
                                                set_select_ahli_keluarga(e.target.value)
                                                let find = list_ahli_keluarga.filter(a => a.name === e.target.value)
                                                console.log("Log Find Ahli Keluarga : ", find)
                                                if(find.length > 0) {
                                                    set_select_receiver_name(find[0]["name"])
                                                    set_select_receiver_email(find[0]["email"])
                                                    set_select_receiver_phone(find[0]["phone"])
                                                    set_select_receiver_relay(find[0]["relation"])
                                                }
                                                setTimeout(() => {
                                                    set_loading_on_select(false)
                                                }, 1000);
                                            }}
                                            disabled={loading_option}
                                        />
                                        </div>
                                        </>
                                    )
                                }
                                {
                                    select_bayar_kepada === "Waris" && (
                                        <>
                                        <div>
                                        <Select 
                                            label={'Nama Waris'}
                                            placeholder='-- Sila Pilih Waris --'
                                            defaultValue={select_waris}
                                            options={option_for_waris}
                                            onChange={e => {
                                                set_loading_on_select(true)
                                                set_select_waris(e.target.value)
                                                let find = list_waris.filter(a => a.waris_fullname === e.target.value)
                                                console.log("Log Find Waris : ", find)
                                                if(find.length > 0) {
                                                    set_select_receiver_name(find[0]["waris_fullname"])
                                                    set_select_receiver_email(find[0]["waris_email"])
                                                    set_select_receiver_phone(find[0]["waris_phone"])
                                                    set_select_receiver_relay(find[0]["waris_relationship"])
                                                }
                                                setTimeout(() => {
                                                    set_loading_on_select(false)
                                                }, 1000);
                                            }}
                                            disabled={loading_option}
                                        />
                                        </div>
                                        </>
                                    )
                                }
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                <div>
                                    <Select 
                                    label={'Kaedah Bayaran'}
                                    placeholder='-- Sila Pilih Kaedah Bayaran --'
                                    defaultValue={select_pay_method}
                                    options={[
                                        { label: '-- Pilih Kaedah Bayaran --', value: '' },
                                        { label: 'Cash', value: 'Cash' },
                                        //{ label: 'Online Banking', value: 'Online Banking'}
                                    ]}
                                    onChange={e => set_select_pay_method(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Textinput
                                    label={'Jumlah Bayaran (RM)'}
                                    placeholder='RM 0.00'
                                    defaultValue={select_amount}
                                    onChange={e => set_select_amount(e.target.value)}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                    />
                                </div>
                            </div>

                            {
                                select_bayar_kepada === "Lain-lain" && (
                                    <>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                            <div>
                                                <Textinput
                                                label={'Nama Penerima'}
                                                placeholder='Contoh: Amir Bakri'
                                                defaultValue={select_receiver_name}
                                                onChange={e => set_select_receiver_name(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Textinput
                                                label={'E-mel Penerima'}
                                                placeholder='Contoh: amirbakri@email.com'
                                                defaultValue={select_receiver_email}
                                                onChange={e => set_select_receiver_email(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Textinput
                                                label={'No. Telefon Penerima'}
                                                placeholder='Contoh: 0123456789'
                                                defaultValue={select_receiver_phone}
                                                onChange={e => set_select_receiver_phone(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Textinput
                                                label={'Hubungan Penerima atau Waris'}
                                                placeholder='Contoh: Anak atau waris terdekat'
                                                defaultValue={select_receiver_relay}
                                                onChange={e => set_select_receiver_relay(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                            {
                                loading_on_select && (
                                    <>
                                    <div className='flex justify-center items-center'>
                                        <Spinner />
                                    </div>
                                    </>
                                )
                            }

                            {
                                // loading_on_select === false && select_bayar_kepada !== "Lain-lain" && (select_ahli_keluarga || select_waris) && (
                                //     <>
                                //         <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                //             <div>
                                //                 <Textinput
                                //                 label={'Nama Penerima'}
                                //                 placeholder='Contoh: Amir Bakri'
                                //                 defaultValue={select_receiver_name}
                                //                 onChange={e => set_select_receiver_name(e.target.value)}
                                //                 disabled={true}
                                //                 />
                                //             </div>
                                //             <div>
                                //                 <Textinput
                                //                 label={'E-mel Penerima'}
                                //                 placeholder='Contoh: amirbakri@email.com'
                                //                 defaultValue={select_receiver_email}
                                //                 onChange={e => set_select_receiver_email(e.target.value)}
                                //                 disabled={true}
                                //                 />
                                //             </div>
                                //             <div>
                                //                 <Textinput
                                //                 label={'No. Telefon Penerima'}
                                //                 placeholder='Contoh: 0123456789'
                                //                 defaultValue={select_receiver_phone}
                                //                 onChange={e => set_select_receiver_phone(e.target.value)}
                                //                 disabled={true}
                                //                 />
                                //             </div>
                                //             <div>
                                //                 <Textinput
                                //                 label={'Hubungan Penerima atau Waris'}
                                //                 placeholder='Contoh: Anak atau waris terdekat'
                                //                 defaultValue={select_receiver_relay}
                                //                 onChange={e => set_select_receiver_relay(e.target.value)}
                                //                 disabled={true}
                                //                 />
                                //             </div>
                                //         </div>
                                //     </>
                                // )
                            }
                            
                            {
                                select_pay_method === "Cash" && (
                                    <>
                                    <div>
                                        <label htmlFor="" className='form-label'>Resit Bayaran Cash</label>
                                        <Fileinput 
                                        name={'Click here to upload file'}
                                        label='Click here to upload file'
                                        placeholder='Contoh: Resit Bayaran Kepada Waris.pdf'
                                        selectedFile={select_file}
                                        onChange={e => {
                                            set_file(e.target.files)
                                            set_select_file(e.target.files[0])
                                        }}
                                        />
                                    </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </Card>
                <div className='mt-6 flex flex-row items-center justify-end'>
                    <Button className='bg-teal-600 text-white' onClick={() => set_confirmation_modal(true)}>
                        Bayar Khairat Kematian
                    </Button>
                </div>
            </section>

            {/* <section className='mt-6'>
                <Card>
                    {JSON.stringify(bank_fpx)}
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    {JSON.stringify(list_kariah)}
                </Card>
            </section> */}
        </div>
    );
}

export default BayarKhairatKematian;