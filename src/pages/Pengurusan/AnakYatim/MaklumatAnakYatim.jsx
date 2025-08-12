import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { DISTRICT, NEGERI, POSTCODE } from './constant-senarai-negeri-dan-daerah';
import { EditIcon, Spinner, SquareIcon, TrashIcon } from 'evergreen-ui';

MaklumatAnakYatim.propTypes = {
    
};

function MaklumatAnakYatim(props) {

    const state                                 = useLocation().state
    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                = useState(true)

    const [modal_1, set_modal_1]                = useState(false)
    const [modal_2, set_modal_2]                = useState(false)
    const [modal_3, set_modal_3]                = useState(false)
    const [modal_type, set_modal_type]          = useState("default")
    const [modal_title, set_modal_title]        = useState("")
    const [modal_body, set_modal_body]          = useState("")

    const [name, set_name]                      = useState("")
    const [age, set_age]                        = useState("")
    const [gender, set_gender]                  = useState("")
    const [address, set_address]                = useState("")
    const [city, set_city]                      = useState("")
    const [negeri, set_state]                   = useState("")
    const [postcode, set_postcode]              = useState("")
    const [guardian_name, set_guardian_name]    = useState("")

    const [opt_for_negeri, set_opt_for_negeri]                  = useState(NEGERI)
    const [opt_for_daerah, set_opt_for_daerah]                  = useState([])
    const [opt_for_postcode, set_opt_for_postcode]              = useState([])

    const [loading_address, set_loading_address]                = useState(false)

    // State for each address line
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [addressLine3, setAddressLine3] = useState('');


    const open_modal_1 = () => set_modal_1(true)
    const open_modal_2 = () => set_modal_2(true)
    const open_modal_3 = () => set_modal_3(true)

    const close_modal_1 = () => set_modal_1(false)
    const close_modal_2 = () => set_modal_2(false)
    const close_modal_3 = () => set_modal_3(false)

    const get__anak__yatim = async () => {
        set_loading(true)
        let api = await API(`kariah/anak-yatim/list/${state.id}`, {}, "GET", true)
        console.log("Log Get Maklumat Anak Yatim : ", api)
        if(api.status_code === 200) {
            let data = api.data
            set_name(data.name)
            set_age(data.age)
            set_gender(data.gender)
            setAddressLine1(data.address.split(',')[0] || '')
            setAddressLine2(data.address.split(',')[1] || '')
            setAddressLine3(data.address.split(',')[2] || '')
            set_city(data.city)
            set_state(data.state)
            set_postcode(data.postcode)
            set_guardian_name(data.guardian_name)

            if(data.city) {
                //set_opt_for_daerah(POSTCODE[data.org_state].name)
                
                let array_city      = []
                let array_postcode  = []

                let basic = POSTCODE.state.filter(item => item.name === data.state)[0].city

                for (let i = 0; i < basic.length; i++) {
                    array_city.push({
                        label: basic[i].name,
                        values: basic[i].name,
                    })

                    if(data.city === basic[i].name) {
                        let default_arr = basic.filter(item => item.name === data.city)
                        for (let j = 0; j < default_arr[0].postcode.length; j++) {
                            array_postcode.push(default_arr[0].postcode[j])                        
                        }
                    }
                }

                set_opt_for_daerah(array_city)
                set_opt_for_postcode(array_postcode)
            }
        }
        set_loading(false)
    }

    const update_anak_yatim = async () => {

        close_modal_1()
        close_modal_2()

        if(!name) {
            toast.error("Tiada nama anak yatim. Sila lengkapkan maklumat anak yatim sebelum membuat penambahan senarai maklumat anak yatim.")
        }
        else if(!age) {
            toast.error("Tiada umur anak yatim. Sila lengkapkan maklumat anak yatim sebelum membuat penambahan senarai maklumat anak yatim.")
        }
        else if(!gender) {
            toast.error("Tiada jantina anak yatim. Sila lengkapkan maklumat anak yatim sebelum membuat penambahan senarai maklumat anak yatim.")
        }
        else if(!city) {
            toast.error("Tiada bandar asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!negeri) {
            toast.error("Tiada negeri asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!postcode) {
            toast.error("Tiada postcode menetap asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!guardian_name) {
            toast.error("Tiada nama penjaga anak yatim. Sila lengkapkan maklumat anak yatim sebelum membuat penambahan senarai maklumat anak yatim.")
        }
        else {

            set_loading(true)
            const full_address = `${addressLine1}, ${addressLine2}, ${addressLine3}`;
            let json = {
                id: state.id,
                name: name,
                age: Number(age),
                gender: gender,
                address: full_address,
                city: city,
                state: negeri,
                postcode: postcode,
                guardian_name: guardian_name.trim()
            }

            let api = await API("kariah/anak-yatim/update", json, "POST", true)
            console.log("Log Function Update Anak Yatim : ", api)
            set_loading(false)

            if(api.status_code === 200) {
                set_modal_type("success")
                set_modal_title("Senarai Anak Yatim Berjaya Dikemaskini")
                set_modal_body(api.message)
                open_modal_2()
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
            else {
                set_modal_type("danger")
                set_modal_title("Senarai Anak Yatim Gagal Dikemaskini")
                set_modal_body(api.message)
                open_modal_2()
            }
        }
    }

    const delete_anak_yatim = async () => {
        close_modal_3()

        if(!state.id) {
            toast.error("Tiada ID anak yatim. Sila lengkapkan maklumat anak yatim sebelum memadam maklumat anak yatim.")
        }
        else {

            set_loading(true)

            let json = {
                id: state.id,
            }

            let api = await API("kariah/anak-yatim/delete", json, "POST", true)
            console.log("Log Function Delete Anak Yatim : ", api)
            set_loading(false)

            if(api.status_code === 200) {
                set_modal_type("success")
                set_modal_title("Senarai Anak Yatim Berjaya Dipadam")
                set_modal_body(api.message)
                open_modal_2()
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
            else {
                set_modal_type("danger")
                set_modal_title("Senarai Anak Yatim Gagal Dipadam")
                set_modal_body(api.message)
                open_modal_2()
            }
        }
    }

    useEffect(() => {
        get__anak__yatim()
    }, [])

    if(loading) return <Loading />

    return (
        <div>
            <Modal
                title='Pengesahan Kemaskini Senarai Anak Yatim'
                themeClass='bg-teal-600'
                activeModal={modal_1}
                onClose={close_modal_1}
                centered={true}
                footerContent={(
                    <>
                    <div className='flex gap-3'>
                        <Button className='' onClick={close_modal_1}>Tidak</Button>
                        <Button className='bg-teal-600 text-white' onClick={update_anak_yatim}>Ya</Button>
                    </div>
                    </>
                )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>Anda pasti untuk mengemaskini maklumat anak yatim ini?</p>
                </div>
            </Modal>

            <Modal
                title='Pengesahan Memadam Maklumat Anak Yatim'
                themeClass='bg-red-600'
                activeModal={modal_3}
                onClose={close_modal_3}
                centered={true}
                footerContent={(
                    <>
                    <div className='flex gap-3'>
                        <Button className='' onClick={close_modal_3}>Tutup</Button>
                        <Button className='bg-red-600 text-white' onClick={delete_anak_yatim}>Ya</Button>
                    </div>
                    </>
                )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>Anda pasti untuk memadam maklumat anak yatim ini?</p>
                </div>
            </Modal>

            <Modal
                title={modal_title}
                themeClass={modal_type === "success" ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}
                activeModal={modal_2}
                onClose={close_modal_2}
                centered={true}
                footerContent={(
                    <>
                    <div className='flex gap-3'>
                        <Button className='' onClick={close_modal_2}>Tutup</Button>
                    </div>
                    </>
                )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>{modal_body}</p>
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Kemaskini Maklumat Anak Yatim</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat anak yatim di bawah dan pastikan semua maklumat adalah tepat dan benar.</p>  
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
                        <p className='font-semibold text-gray-900 text-xl'>Borang Kemaskini Anak Yatim</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat borang anak yatim di bawah untuk kemaskini senarai anak yatim baharu.</p>
                    </div>
                    <div className='mt-6'>
                        <div className='mb-3 grid grid-cols-2 gap-3'>
                            <div>
                                <Textinput 
                                    label={'Nama Anak Yatim'}
                                    placeholder='Contoh: Muhd Akmar Bin Khilmie'
                                    defaultValue={name}
                                    onChange={e => set_name(e.target.value)}
                                    
                                />
                            </div>
                            <div>
                                <Select 
                                    label={'Jantina Anak Yatim'}
                                    placeholder='Contoh: Lelaki'
                                    defaultValue={gender}
                                    onChange={e => set_gender(e.target.value)}
                                    options={[
                                        { label: 'Lelaki', value: 'Lelaki' },
                                        { label: 'Perempuan', value: 'Perempuan'}
                                    ]}
                                    
                                />
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2 gap-3'>
                            <Textinput 
                                label={'Nama Penjaga Anak Yatim'}
                                placeholder='Contoh: Salehuddin Bin Rosli'
                                defaultValue={guardian_name}
                                onChange={e => set_guardian_name(e.target.value)}
                                
                            />
                            <Textinput 
                                label={'Umur Anak Yatim'}
                                placeholder='Contoh: 20'
                                defaultValue={age}
                                onChange={e => set_age(e.target.value)}
                                type={"number"}
                                pattern="^[0-9]" 
                                inputmode="numeric"
                                
                            />
                        </div>
                        <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                            <Textinput
                                label={'Alamat 1'}
                                placeholder='Contoh: Jalan 11'
                                defaultValue={addressLine1}
                                //disabled={disabled_editing}
                                onChange={e => setAddressLine1(e.target.value)}
                            />
                            <Textinput
                                label={'Alamat 2'}
                                placeholder='Contoh: Datuk Panglima Garang'
                                defaultValue={addressLine2}
                                //disabled={disabled_editing}
                                onChange={e => setAddressLine2(e.target.value)}
                            />
                            <Textinput
                                label={'Alamat 3'}
                                placeholder='Contoh: Hulu Selangor, 12345 Selangor, Malaysia'
                                defaultValue={addressLine3}
                                //disabled={disabled_editing}
                                onChange={e => setAddressLine3(e.target.value)}
                            />
                        </div>

                        <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-3'>

                            {
                                loading_address && (
                                <>
                                    <div className='col-span-1 justify-center items-center'>
                                        <Spinner />
                                    </div>
                                </>
                                )
                            }

                            {
                                !loading_address && (
                                    <>
                                        <Select 
                                            label={'Poskod'}
                                            placeholder='-- Sila Pilih Poskod --'
                                            defaultValue={postcode}
                                            options={opt_for_postcode}
                                            onChange={e => set_postcode(e.target.value)}
                                        />
                                        
                                        <Select 
                                            label={'Bandar'}
                                            placeholder='-- Sila Pilih Daerah --'
                                            defaultValue={city}
                                            options={opt_for_daerah}
                                            onChange={e => {

                                                set_loading_address(true)

                                                let array_postcode  = []
                                                let city            = e.target.value

                                                set_city(city)
                                                set_postcode("")
                                                
                                                let basic       = POSTCODE.state.filter(item => item.name === negeri)[0].city
                                                let default_arr = basic.filter(item => item.name === city)
                                                console.log("Log Change City For Postcode : ", default_arr)
                                                
                                                array_postcode.push({
                                                    label: "-- Sila Pilih --",
                                                    value: ""
                                                })
                                                for (let j = 0; j < default_arr[0].postcode.length; j++) {
                                                    array_postcode.push(default_arr[0].postcode[j])                        
                                                }

                                                set_opt_for_postcode(array_postcode)

                                                setTimeout(() => {
                                                    set_loading_address(false)
                                                }, 500);
                                            }}
                                        />

                                        <Select 
                                            label={'Negeri'}
                                            placeholder='-- Sila Pilih Negeri --'
                                            defaultValue={negeri}
                                            options={opt_for_negeri}
                                            onChange={e => {

                                                set_loading_address(true)

                                                set_state(e.target.value)
                                                set_city("")
                                                set_postcode("")

                                                let array = []
                                                let basic = POSTCODE.state.filter(item => item.name === e.target.value)[0]
                                                console.log("Log List Daerah : ", basic)

                                                array.push({
                                                    label: "-- Sila Pilih --",
                                                    value: ""
                                                })
                                                for (let i = 0; i < basic.city.length; i++) {
                                                    array.push({
                                                        label: basic.city[i].name,
                                                        value: basic.city[i].name
                                                    })
                                                    
                                                }
                                                set_opt_for_daerah(array)

                                                setTimeout(() => {
                                                    set_loading_address(false)
                                                }, 500);
                                            }}
                                        />
                                        
                                    </>
                                )
                            }
                        </div>
                    </div>
                </Card>
                <div className='mt-3 flex justify-end items-center gap-3'>
                    <Button className='bg-danger-600 text-white' onClick={open_modal_3}>Padam Maklumat Anak Yatim</Button>
                    <Button className='bg-emerald-600 text-white' onClick={open_modal_1}>Kemaskini Maklumat Anak Yatim</Button>
                </div>
            </section>
        </div>
    );
}

export default MaklumatAnakYatim;