import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Pane, Spinner } from 'evergreen-ui';
import Icons from '@/components/ui/Icon';
import InputGroup from '@/components/ui/InputGroup';
import Modal from '@/components/ui/Modal';
import { useModal } from '@/components/ui/SuperModal';

MaklumatYuran.propTypes = {
    
};

function MaklumatYuran(props) {

    const { width, breakpoints }    = useWidth()
    const state                     = useLocation().state
    const navigate                  = useNavigate()

    const { showModal, hideModal }  = useModal()

    const [yuran, set_yuran]                        = useState(null)
    const [loading, set_loading]                    = useState(true)
    const [loading_item, set_loading_item]          = useState(false)

    const [nama_yuran, set_nama_yuran]              = useState("")
    const [keterangan_yuran, set_keterangan_yuran]  = useState("")
    const [jenis_yuran, set_jenis_yuran]            = useState("")
    const [amaun_yuran, set_amaun_yuran]            = useState(0.00)
    const [item_yuran, set_item_yuran]              = useState([])


    const [modal_confirm_delete, set_modal_confirm_delete]  = useState(false)
    const [modal_confirm_update, set_modal_confirm_update]  = useState(false)

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

    const fetch_yuran = async (yuran_id) => {
        set_loading(true)
        let api = await API(`kariah/yuran/list/${yuran_id}`, {}, "GET", true)
        console.log("Log APi Get Yuran Detail : ", api)
        if(api.status_code === 200) {
            set_yuran(api.data)

            let data = api.data
            set_nama_yuran(data.yuran_name)
            set_keterangan_yuran(data.yuran_description)
            set_jenis_yuran(data.yuran_type)
            set_amaun_yuran(parseFloat(data.yuran_amount).toFixed(2))
            set_item_yuran(data.yuran_item)
        }
        set_loading(false)
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

    const __functionUpdateYuran = async () => {
        set_modal_confirm_update(false)
        set_loading(true)

        let json = {
            yuran_id: state.yuran_id,
            yuran_name: nama_yuran,
            yuran_description: keterangan_yuran,
            yuran_type: jenis_yuran,
            yuran_amount: parseFloat(amaun_yuran).toFixed(2),
            yuran_item: item_yuran
        }

        let api = await API("kariah/yuran/update", json, "POST", true)
        console.log("Log Update Yuran : ", api)
        set_loading(false)

        if(api.status_code === 200) {
            set_modal_type("success")
            set_modal_title("Kemaskini Maklumat Yuran Berjaya")
            set_modal_description(api.message)
            set_modal_response(true)

            setTimeout(() => {
                navigate(0)
            }, 1000);
        } else {
            set_modal_type("danger")
            set_modal_title("Kemaskini Maklumat Yuran Gagal")
            set_modal_description(api.message)
            set_modal_response(true)
        }
    }

    const __functionDeleteYuran = async () => {
        set_modal_confirm_delete(false)
        set_loading(true)
        let json = {
            yuran_id: state.yuran_id,
        }

        let api = await API("kariah/yuran/delete", json, "POST", true)
        console.log("Log Delete Yuran : ", api)
        set_loading(false)

        if(api.status_code === 200) {
            set_modal_type("success")
            set_modal_title("Proses Memadam Yuran Berjaya")
            set_modal_description(api.message)
            set_modal_response(true)
        } else {
            set_modal_type("success")
            set_modal_title("Proses Memadam Yuran Gagal")
            set_modal_description(api.message)
            set_modal_response(true)
        }
    }

    useEffect(() => {
        fetch_yuran(state.yuran_id)
    }, [state])

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
                    <Button className='' onClick={() => set_modal_add_item(false)}>Tutup</Button>
                    <Button className='bg-emerald-600 text-white' onClick={_addItems}>Tambah Kandungan</Button>
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
            themeClass={'bg-red-600 text-white'}
            title='Pengesahan Memadam Maklumat Yuran'
            centered={true}
            activeModal={modal_confirm_delete}
            onClose={() => set_modal_confirm_delete(false)}
            footerContent={(
                <div>
                    <Button className='' onClick={() => set_modal_confirm_delete(false)}>Tidak</Button>
                    <Button className='bg-red-600 text-white' onClick={__functionDeleteYuran}>Ya</Button>
                </div>
            )}
            >
                <div>
                    <p>Anda pasti untuk memadam yuran maklumat yuran ini?</p>
                </div>
            </Modal>

            <Modal
            themeClass={'bg-teal-600 text-white'}
            title='Pengesahan Kemaskini Maklumat Yuran'
            centered={true}
            activeModal={modal_confirm_update}
            onClose={() => set_modal_confirm_update(false)}
            footerContent={(
                <div>
                    <Button className='' onClick={() => set_modal_confirm_update(false)}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={__functionUpdateYuran}>Ya</Button>
                </div>
            )}
            >
                <div>
                    <p>Anda pasti untuk mengemaskini yuran maklumat yuran ini?</p>
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
                    <p>{modal_description}</p>
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Yuran</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat yuran khairat kematian. Anda boleh mengemaskini maklmuat yuran anda di bawah. Sila pastikan semua maklumat yuran telah lengkap.</p>  
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
                                label={'Nama'}
                                placeholder='Contoh: Yuran Tahunan Khairat Kematian'
                                defaultValue={nama_yuran}
                                onChange={e => set_nama_yuran(e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <Textarea
                                label={'Keterangan'}
                                placeholder='Contoh: Keterangan yuran tahunan khairat kematian bagi pendaftar yuran khairat kematian.'
                                dvalue={keterangan_yuran}
                                onChange={e => set_keterangan_yuran(e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <Select 
                                label={'Jenis'}
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
                                label={'Amaun (RM)'}
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
                                                        <Button className='text-red-500 text-lg' onClick={() => _removeYuranItem(item)}><Icons icon={'heroicons:trash'} /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>       
                            </>
                        )
                    }
                </Card>
            </section>

            <section>
                <div className='mt-3 flex justify-end gap-3'>
                    <Button onClick={() => set_modal_confirm_delete(true)} className='bg-red-600 text-white'>Padam Yuran</Button>
                    <Button onClick={() => set_modal_confirm_update(true)}>Kemaskini Yuran</Button>
                </div>
            </section>
        </div>
    );
}

export default MaklumatYuran;