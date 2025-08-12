import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { Spinner } from 'evergreen-ui';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Icons from '@/components/ui/Icon';
import { API } from '@/utils/api';

CreateYuran.propTypes = {
    
};

function CreateYuran(props) {

    const { width, breakpoints }                            = useWidth()
    const state                                             = useLocation().state
    const navigate                                          = useNavigate()

    const [yuran, set_yuran]                                = useState(null)
    const [loading, set_loading]                            = useState(false)
    const [loading_item, set_loading_item]                  = useState(false)

    const [nama_yuran, set_nama_yuran]                      = useState("")
    const [keterangan_yuran, set_keterangan_yuran]          = useState("")
    const [jenis_yuran, set_jenis_yuran]                    = useState("")
    const [amaun_yuran, set_amaun_yuran]                    = useState(0.00)
    const [item_yuran, set_item_yuran]                      = useState([])

    const [modal_confirm_delete, set_modal_confirm_delete]  = useState(false)
    const [modal_confirm_update, set_modal_confirm_update]  = useState(false)
    const [modal_confirm_create, set_modal_confirm_create]  = useState(false)

    const [modal_type, set_modal_type]                      = useState(null)
    const [modal_title, set_modal_title]                    = useState("")
    const [modal_description, set_modal_description]        = useState("")
    const [modal_response, set_modal_response]              = useState(false)

    const [modal_add_item, set_modal_add_item]              = useState(false)
    const [temp_item, set_temp_item]                        = useState("")

    const _addItems = () => {
        set_modal_add_item(false)
        set_loading_item(true)
        let array = item_yuran
        array.push(temp_item)
        set_item_yuran(array)
        setTimeout(() => {
            set_temp_item("")
            set_loading_item(false)
        }, 500);
    }

    const _onChangeItems = (index, value) => {
        const updatedItems = item_yuran.map((item, i) => {
            if (i === index) {
              return value
            }
            return item;
        });
        set_item_yuran(updatedItems);
    }

    const _removeYuranItem = (index) => {
        set_loading_item(true)
        const filterUpdate = item_yuran.filter(a => a !== index)
        console.log("Log Remove Item : ", filterUpdate)
        set_item_yuran(filterUpdate);
        setTimeout(() => {
            set_loading_item(false)
        }, 500);
    }

    const __createYuran = async () => {
        set_modal_confirm_create(false)
        set_loading(false)

        let json = {
            yuran_name: nama_yuran,
            yuran_description: keterangan_yuran,
            yuran_type: jenis_yuran,
            yuran_amount: parseFloat(amaun_yuran).toFixed(2),
            yuran_item: item_yuran
        }

        let api = await API("kariah/yuran/create", json, "POST", true)
        console.log("Log Function Create Yuran : ", api)
        set_loading(false)

        if(api.status_code === 200) {
            set_modal_title("Yuran Khairat Kematian Berjaya Disimpan")
            set_modal_description(api.message)
            set_modal_type("success")
            set_modal_response(true)
        }
        else {
            set_modal_title("Yuran Khairat Kematian Gagal Disimpan")
            set_modal_description(api.message)
            set_modal_type("danger")
            set_modal_response(true)
        }
    }

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            title='Tambah Isi Kandungan Yuran'
            activeModal={modal_add_item}
            centered={true}
            onClose={() => set_modal_add_item(false)}
            footerContent={(
                <div>
                    <Button className='' onClick={() => set_modal_add_item(false)}>Tidak</Button>
                    <Button className='bg-emerald-600 text-white' onClick={_addItems}>Ya</Button>
                </div>
            )}
            >
                <div>
                    <Textinput 
                    label={'Isi Kandungan'}
                    placeholder='Contoh: Memperoleh sagu hati setiap tahun'
                    defaultValue={temp_item}
                    onChange={e => set_temp_item(e.target.value)}
                    />
                </div>
            </Modal>

            <Modal
            themeClass={'bg-teal-600 text-white'}
            title='Pengesahan Membuat Yuran Khairat Kematian'
            centered={true}
            activeModal={modal_confirm_create}
            onClose={() => set_modal_confirm_create(false)}
            footerContent={(
                <div>
                    <Button className='' onClick={() => set_modal_confirm_create(false)}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={__createYuran}>Ya</Button>
                </div>
            )}
            >
                <div>
                    <p className='text-gray-500 text-sm'>Anda pasti untuk tambah rekod maklumat yuran ini?</p>
                </div>
            </Modal>

            <Modal
            themeClass={modal_type === 'success' ? 'bg-emerald-600 text-white' : 'bg-danger-600 text-white'}
            title={modal_title}
            centered={true}
            activeModal={modal_response}
            onClose={() => {
                set_modal_response(false)
                if(modal_type === 'success') {
                    navigate(-1)
                }
            }}
            footerContent={(
                <div>
                    <Button 
                        className='' 
                        onClick={() => {
                            set_modal_response(false)
                            if(modal_type === 'success') {
                                navigate(-1)
                            }
                        }}>Tutup</Button>
                </div>
            )}
            >
                <div>
                    <p className='text-gray-500 text-sm'>{modal_description}</p>
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Yuran Pendaftaran / Yuran Keahlian Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Lengkapkan maklumat dibawah untuk tambah rekod yuran khairat kematian anda. Yuran terhad pada 2 bilangan yuran sahaja.</p>  
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
                        <p className='font-semibold text-gray-900'>Maklumat Yuran Khairat Kematian</p>
                    </div>
                    <div className='mt-6'>
                        <div className='mb-3'>
                            <Textinput 
                                label={'Nama Yuran'}
                                placeholder='Contoh: Yuran Tahunan Khairat Kematian'
                                defaultValue={nama_yuran}
                                onChange={e => set_nama_yuran(e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <Textarea
                                label={'Keterangan Yuran'}
                                placeholder='Contoh: Keterangan yuran tahunan khairat kematian bagi pendaftar yuran khairat kematian.'
                                dvalue={keterangan_yuran}
                                onChange={e => set_keterangan_yuran(e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <Select 
                                label={'Jenis Yuran'}
                                placeholder='Contoh: Yuran Tahunan'
                                defaultValue={jenis_yuran}
                                options={[
                                    { label: 'Tahunan', value: 'Tahunan' },
                                    { label: 'Penuh', value: 'Penuh' },
                                ]}
                                onChange={e => set_jenis_yuran(e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <Textinput 
                                label={'Amaun Yuran (RM)'}
                                placeholder='Contoh: RM 100.00'
                                defaultValue={parseFloat(amaun_yuran)}
                                onChange={e => set_amaun_yuran(e.target.value)}
                                type={"number"}
                                pattern="^[0-9]" 
                                inputmode="numeric"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    {
                        loading_item && (
                            <div className='flex justify-center items-center'>
                                <Spinner />
                            </div>
                        )
                    }

                    {
                        loading_item === false && (
                            <>
                                <div className='flex flex-row justify-between items-center'>
                                    <p className='font-semibold text-gray-900'>Kandungan Maklumat Terperinci Yuran</p>
                                    <Button className='bg-emerald-600 text-white' onClick={() => set_modal_add_item(true)}>
                                        Tambah Kandungan Yuran
                                    </Button>
                                </div>
                                <div className='mt-3'>
                                    {
                                        item_yuran.length > 0 && item_yuran.map((item, index) => (
                                            <div key={index} className='mb-3'>
                                                <div><p className='form-label'>Tindakan No. {index + 1}</p></div>
                                                <div className='mt-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center'>
                                                    <div className='col-span-11'>
                                                        <Textinput 
                                                            defaultValue={item} 
                                                            placeholder='Contoh: Isi kandungan keterangan yuran' 
                                                            onChange={(e) => _onChangeItems(index, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='col-span-1 flex justify-center'>
                                                        <Button className='bg-red-600 text-white' onClick={() => _removeYuranItem(item)}><Icons icon={'heroicons-solid:trash'} /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    {
                                        item_yuran.length < 1 && (
                                            <>
                                            <div className='font-normal text-sm text-gray-600'>
                                                Anda tidak mempunyai sebarang kandungan maklumat yuran buat masa sekarang.
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

            <section>
                <div className='mt-3 flex justify-end gap-3'>
                    <Button onClick={() => set_modal_confirm_create(true)}>Tambah Yuran Khairat Kematian</Button>
                </div>
            </section>
        </div>
    );
}

export default CreateYuran;