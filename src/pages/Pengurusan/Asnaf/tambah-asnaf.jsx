import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import { API } from '@/utils/api';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import { DISTRICT, NEGERI, POSTCODE } from './constant-senarai-negeri-dan-daerah';
import { EditIcon, Spinner, SquareIcon, TrashIcon } from 'evergreen-ui';



TambahAsnaf.propTypes = {
    
};

function TambahAsnaf(props) {

    const navigate                                              = useNavigate()
    const { width, breakpoints }                                = useWidth()

    const [loading, set_loading]                                = useState(false)

    const [modal_1, set_modal_1]                                = useState(false)
    const [modal_2, set_modal_2]                                = useState(false)
    const [modal_type, set_modal_type]                          = useState("default")
    const [modal_title, set_modal_title]                        = useState("")
    const [modal_body, set_modal_body]                          = useState("")

    const [asnaf_type, set_asnaf_type]                          = useState("")
    const [asnaf_name, set_asnaf_name]                          = useState("")
    const [asnaf_email, set_asnaf_email]                        = useState("")
    const [asnaf_age, set_asnaf_age]                            = useState("")
    const [asnaf_address, set_asnaf_address]                    = useState("")
    const [asnaf_city, set_asnaf_city]                          = useState("")
    const [asnaf_state, set_asnaf_state]                        = useState("")
    const [asnaf_postcode, set_asnaf_postcode]                  = useState("")
    const [asnaf_gender, set_asnaf_gender]                      = useState("")

    const [opt_for_negeri, set_opt_for_negeri]                  = useState(NEGERI)
    const [opt_for_daerah, set_opt_for_daerah]                  = useState([])
    const [opt_for_postcode, set_opt_for_postcode]              = useState([])

    const [loading_address, set_loading_address]                = useState(false)

    const [option_kategori_asnaf, set_option_kategori_asnaf]    = useState([])

    // State for each address line
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [addressLine3, setAddressLine3] = useState('');

    const handleAddressChange = (value, line) => {
        if (line === 1) setAddressLine1(value);
        if (line === 2) setAddressLine2(value);
        if (line === 3) setAddressLine3(value);

        // Combine all address lines into one string, separated by commas
        const combinedAddress = [addressLine1, addressLine2, addressLine3]
            .map((lineValue, index) => (index + 1 === line ? value : lineValue))
            .filter(lineValue => lineValue.trim() !== '') // Remove empty lines
            .join(', ');

            set_asnaf_address(combinedAddress);
    };


    const open_modal_1 = () => set_modal_1(true)
    const open_modal_2 = () => set_modal_2(true)

    const close_modal_1 = () => set_modal_1(false)
    const close_modal_2 = () => set_modal_2(false)

    const get_kategori_asnaf = async () => {
        let api = await API("kariah/asnaf/list-kategori-asnaf", {}, "GET")
        console.log("Log Kategori Asnaf : ", api)
        if(api.status_code === 200) {
            set_option_kategori_asnaf(api.data)
        }
    }

    const add_asnaf = async () => {
        close_modal_1()
        close_modal_2()

        if(!asnaf_type) {
            toast.error("Tiada jenis asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_name) {
            toast.error("Tiada nama asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_age) {
            toast.error("Tiada umur asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_gender) {
            toast.error("Tiada jantina asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_address) {
            toast.error("Tiada alamat menetap asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_city) {
            toast.error("Tiada bandar asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_state) {
            toast.error("Tiada negeri asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else if(!asnaf_postcode) {
            toast.error("Tiada postcode menetap asnaf. Sila lengkapkan maklumat asnaf sebelum membuat penambahan senarai maklumat asnaf.")
        }
        else {

            set_loading(true)

            const full_address = `${asnaf_address}, ${asnaf_postcode}, ${asnaf_city}, ${asnaf_state}`;

            let json = {
                asnaf_name: asnaf_name.trim(),
                asnaf_age: Number(asnaf_age),
                asnaf_gender: asnaf_gender,
                asnaf_address: full_address,
                asnaf_city: asnaf_city,
                asnaf_state: asnaf_state,
                asnaf_postcode: asnaf_postcode,
                asnaf_category: asnaf_type
            }

            let api = await API("kariah/asnaf/create", json, "POST", true)
            console.log("Log Function Tambah Asnaf : ", api)

            set_loading(false)

            if(api.status_code === 200) {

                set_modal_type("success")
                set_modal_title("Senarai Asnaf Berjaya Disimpan")
                set_modal_body(api.message)
                open_modal_2()

                setTimeout(() => {
                    navigate(-1)
                }, 3000);
            }
            else {
                set_modal_type("danger")
                set_modal_title("Senarai Asnaf Gagal Disimpan")
                set_modal_body(api.message)
                open_modal_2()
            }
        }
    }

    useEffect(() => {
        get_kategori_asnaf()
    }, [])

    if(loading) return <Loading />

    return (
        <div>

            <Modal
                title='Pengesahan Tambah Senarai Asnaf'
                themeClass='bg-teal-600'
                activeModal={modal_1}
                onClose={close_modal_1}
                centered={true}
                footerContent={(
                    <>
                    <div className='flex gap-3'>
                        <Button className='' onClick={close_modal_1}>Tidak</Button>
                        <Button className='bg-teal-600 text-white' onClick={add_asnaf}>Ya</Button>
                    </div>
                    </>
                )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>Anda pasti untuk menambah rekod maklumat asnaf di bawah institusi anda?</p>
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
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Maklumat Asnaf</p>  
                        <p className={`text-sm text-gray-500`}>Sila lengkapkan maklumat asnaf di bawah dan pastikan semua maklumat adalah tepat dan benar.</p>  
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
                        <p className='font-semibold text-gray-900 text-xl'>Borang Maklumat Asnaf</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat borang asnaf di bawah untuk menambah senarai asnaf baharu.</p>
                    </div>
                    <div className='mt-6'>
                        <div className='mb-3'>
                            <Select 
                                label={'Jenis Asnaf'}
                                placeholder='Contoh: Miskin'
                                defaultValue={asnaf_type}
                                onChange={e => set_asnaf_type(e.target.value)}
                                disabled={option_kategori_asnaf.length < 1 ? true : false}
                                options={option_kategori_asnaf}
                                // required
                            />
                        </div>
                        <div className='mb-3 grid grid-cols-2 gap-3'>
                            <div>
                                <Textinput 
                                    label={'Nama'}
                                    placeholder='Contoh: Muhd Akmar Bin Khilmie'
                                    defaultValue={asnaf_name}
                                    onChange={e => set_asnaf_name(e.target.value)}
                                    // required
                                />
                            </div>
                            <div>
                                <Select 
                                    label={'Jantina'}
                                    placeholder='Contoh: Lelaki'
                                    defaultValue={asnaf_gender}
                                    onChange={e => set_asnaf_gender(e.target.value)}
                                    options={[
                                        { label: 'Lelaki', value: 'Lelaki' },
                                        { label: 'Perempuan', value: 'Perempuan'}
                                    ]}
                                    // required
                                />
                            </div>
                        </div>
                        <div className='mb-3'>
                            <Textinput 
                                label={'Umur'}
                                placeholder='Contoh: 20'
                                defaultValue={asnaf_age}
                                onChange={e => set_asnaf_age(e.target.value)}
                                type={"number"}
                                pattern="^[0-9]" 
                                inputmode="numeric"
                                // required
                            />
                        </div>
                        <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                            <Textinput
                                label={'Alamat 1'}
                                placeholder='Contoh: Jalan 11'
                                //defaultValue={asnaf_address.split(',')[0] || ''}
                                //disabled={disabled_editing}
                                onChange={e => handleAddressChange(e.target.value, 1)}
                            />
                            <Textinput
                                label={'Alamat 2'}
                                placeholder='Contoh: Datuk Panglima Garang'
                                //defaultValue={asnaf_address.split(',')[1] || ''}
                                //disabled={disabled_editing}
                                onChange={e => handleAddressChange(e.target.value, 2)}
                            />
                            <Textinput
                                label={'Alamat 3'}
                                placeholder='Contoh: Hulu Selangor, 12345 Selangor, Malaysia'
                                //defaultValue={asnaf_address.split(',')[2] || ''}
                                //disabled={disabled_editing}
                                onChange={e => handleAddressChange(e.target.value, 3)}
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
                                            defaultValue={asnaf_postcode}
                                            options={opt_for_postcode}
                                            onChange={e => set_asnaf_postcode(e.target.value)}
                                        />
                                        
                                        <Select 
                                            label={'Bandar'}
                                            placeholder='-- Sila Pilih Daerah --'
                                            defaultValue={asnaf_city}
                                            options={opt_for_daerah}
                                            onChange={e => {

                                                set_loading_address(true)

                                                let array_postcode  = []
                                                let city            = e.target.value

                                                set_asnaf_city(city)
                                                set_asnaf_postcode("")
                                                
                                                let basic       = POSTCODE.state.filter(item => item.name === asnaf_state)[0].city
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
                                            defaultValue={asnaf_state}
                                            options={opt_for_negeri}
                                            onChange={e => {

                                                set_loading_address(true)

                                                set_asnaf_state(e.target.value)
                                                set_asnaf_city("")
                                                set_asnaf_postcode("")

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
                <div className='mt-3 flex justify-end items-center'>
                    <Button className='bg-emerald-600 text-white' onClick={open_modal_1}>Tambah Senarai Asnaf</Button>
                </div>
            </section>
        </div>
    );
}

export default TambahAsnaf;