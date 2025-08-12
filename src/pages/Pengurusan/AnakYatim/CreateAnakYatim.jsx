import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { API } from '@/utils/api';
import { DISTRICT, NEGERI, POSTCODE } from './constant-senarai-negeri-dan-daerah';
import { EditIcon, Spinner, SquareIcon, TrashIcon } from 'evergreen-ui';

CreateAnakYatim.propTypes = {
    
};

function CreateAnakYatim(props) {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                = useState(false)

    const [modal_1, set_modal_1]                = useState(false)
    const [modal_2, set_modal_2]                = useState(false)
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

    const handleAddressChange = (value, line) => {
        if (line === 1) setAddressLine1(value);
        if (line === 2) setAddressLine2(value);
        if (line === 3) setAddressLine3(value);

        // Combine all address lines into one string, separated by commas
        const combinedAddress = [addressLine1, addressLine2, addressLine3]
            .map((lineValue, index) => (index + 1 === line ? value : lineValue))
            .filter(lineValue => lineValue.trim() !== '') // Remove empty lines
            .join(', ');

            set_address(combinedAddress);
    };

    const open_modal_1 = () => set_modal_1(true)
    const open_modal_2 = () => set_modal_2(true)

    const close_modal_1 = () => set_modal_1(false)
    const close_modal_2 = () => set_modal_2(false)

    const add_anak_yatim = async () => {

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
        else if(!address) {
            toast.error("Tiada alamat menetap anak yatim. Sila lengkapkan maklumat anak yatim sebelum membuat penambahan senarai maklumat anak yatim.")
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
            const full_address = `${address}, ${postcode},${city}, ${negeri}`;
            let json = {
                name: name,
                age: Number(age),
                gender: gender,
                address: full_address,
                city: city,
                state: negeri,
                postcode: postcode,
                guardian_name: guardian_name.trim()
            }

            let api = await API("kariah/anak-yatim/create", json, "POST", true)
            console.log("Log Function Tambah Anak Yatim : ", api)
            set_loading(false)

            if(api.status_code === 200) {
                set_modal_type("success")
                set_modal_title("Senarai Anak Yatim Berjaya Disimpan")
                set_modal_body(api.message)
                open_modal_2()
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
            else {
                set_modal_type("danger")
                set_modal_title("Senarai Anak Yatim Gagal Disimpan")
                set_modal_body(api.message)
                open_modal_2()
            }
        }
    }

    if(loading) return <Loading />

    return (
        <div>
            <Modal
                title='Pengesahan Tambah Senarai Anak Yatim'
                themeClass='bg-teal-600'
                activeModal={modal_1}
                onClose={close_modal_1}
                centered={true}
                footerContent={(
                    <>
                    <div className='flex gap-3'>
                        <Button className='' onClick={close_modal_1}>Tutup</Button>
                        <Button className='bg-teal-600 text-white' onClick={add_anak_yatim}>Teruskan</Button>
                    </div>
                    </>
                )}
            >
                <div>
                    <p className='font-normal text-sm text-gray-600'>Anda pasti untuk menambah maklumat anak yatim?</p>
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
                        <Button className='bg-teal-600 text-white' onClick={close_modal_2}>Teruskan</Button>
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
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Tambah Maklumat Anak Yatim</p>  
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
                        <p className='font-semibold text-gray-900 text-xl'>Borang Maklumat Anak Yatim</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila lengkapkan maklumat borang anak yatim di bawah untuk menambah senarai anak yatim baharu.</p>
                    </div>
                    <div className='mt-6'>
                        <div className='mb-3 grid grid-cols-2 gap-3'>
                            <div>
                                <Textinput 
                                    label={'Nama'}
                                    placeholder='Contoh: Muhd Akmar Bin Khilmie'
                                    defaultValue={name}
                                    onChange={e => set_name(e.target.value)}
                                    // required
                                />
                            </div>
                            <div>
                                <Select 
                                    label={'Jantina'}
                                    placeholder='Contoh: Lelaki'
                                    defaultValue={gender}
                                    onChange={e => set_gender(e.target.value)}
                                    options={[
                                        { label: 'Lelaki', value: 'Lelaki' },
                                        { label: 'Perempuan', value: 'Perempuan'}
                                    ]}
                                    // required
                                />
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2 gap-3'>
                            <Textinput 
                                label={'Nama Penjaga'}
                                placeholder='Contoh: Salehuddin Bin Rosli'
                                defaultValue={guardian_name}
                                onChange={e => set_guardian_name(e.target.value)}
                                // required
                            />
                            <Textinput 
                                label={'Umur'}
                                placeholder='Contoh: 20'
                                defaultValue={age}
                                onChange={e => set_age(e.target.value)}
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
                <div className='mt-3 flex justify-end items-center'>
                    <Button className='bg-emerald-600 text-white' onClick={open_modal_1}>Tambah Senarai Anak Yatim</Button>
                </div>
            </section>
        </div>
    );
}

export default CreateAnakYatim;