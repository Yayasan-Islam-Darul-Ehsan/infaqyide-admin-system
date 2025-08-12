import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API } from '@/utils/api';
import { FETCH__LIST__ORGANIZATION } from '@/utils/global__function';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useSelector } from 'react-redux';
import AnimatedLotties from '@/components/AnimatedLotties';
import { fa } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';

RegistrationAhliKariah.propTypes = {
    
};

function RegistrationAhliKariah(props) {

    const { user }                                      = useSelector(a => a.auth )
    const navigate                                      = useNavigate()

    const [loading, set_loading]                        = useState(false)

    const [nama_ahli_kariah, set_nama_ahli_kariah]      = useState(user.account_fullname ?? "")
    const [email_ahli_kariah, set_email_ahli_kariah]    = useState(user.account_email ?? "")
    const [phone_ahli_kariah, set_phone_ahli_kariah]    = useState(user.account_phone ?? "")
    const [alamat_ahli_kariah, set_alamat_ahli_kariah]  = useState(user.account_address ?? "")

    const [pilihan_masjid, set_pilihan_masjid]          = useState([])
    const [masjid_ahli_kariah, set_masjid_ahli_kariah]  = useState(null)

    const [modal, set_modal]                            = useState(false)
    const [modal2, set_modal2]                          = useState(false)
    
    useEffect(() => {
        set_loading(true)
        get_list_pilihan_masjid()

        set_loading(false)
        return;
    }, []);

    const get_list_pilihan_masjid = async () => {
        let func = await FETCH__LIST__ORGANIZATION()
        console.log("Log List Masjid : ", func)
        if(func.status_code === 200) {

            let data = func.data
            let array = []
            
            array.push({
                label: '-- Sila Pilih Kariah Masjid --',
                value: ''
            })

            for (let index = 0; index < data.length; index++) {
                array.push({
                    label: data[index]["ORGANIZATION_NAME"],
                    value: data[index]["ORGANIZATION_ID"]
                })
            }
            set_pilihan_masjid(array)
        }
    }

    const SUBMIT__FORM = () => {
        set_modal(false)
        set_loading(true)   
        set_modal2(true)
        setTimeout(() => {
            set_loading(false)
        }, 2000);
    }

    const CLOSE__MODAL = () => {
        set_modal(false)
        set_modal2(false)
        navigate("/ahli-kariah/info-success")
    }

    //if(loading) return <Loading />

    return (
        <div>

            <Modal 
                label='Status Pendaftaran Ahli Kariah'
                labelClass={'bg-teal-500 text-white'}
                activeModal={modal2}
                centered={true}
                onClose={CLOSE__MODAL}
                title='Status Pendaftaran Ahli Kariah'
                uncontrol={false}
                className='max-w-xl'
                footerContent={(
                    <div className='flex gap-3'>
                        {
                            loading === false && (
                                <Button onClick={CLOSE__MODAL} className='bg-teal-500 text-white'>
                                    Teruskan
                                </Button>
                            )
                        }
                    </div>
                )}
            >
                <div>
                    {
                        loading && <Loading />
                    }

                    {
                        !loading && 
                        <AnimatedLotties 
                            title='Tahniah! Pendaftaran Anda Telah Berjaya!' 
                            description='Pendaftaran anda sebagai ahli kariah telah berjaya. Sila lengkapkan maklumat seterusnya.'
                            status={true}
                        />
                    }
                </div>
            </Modal>

            <section>
                <div>
                    <p className='text-sm md:text-4xl font-semibold text-black-900'>Pendaftaran Ahli Kariah</p>
                </div>
            </section>

            <section className='mt-6'>
                <div>
                    <Card>
                        <div>
                            <p className='font-semibold'>Maklumat Ahli Kariah</p>
                            <p className='text-xs text-gray-500'>Sila lengkapkan maklumat di bawah dan klik pada butang hantar di bawah.</p>
                        </div>
                        <div className='mt-6'>
                            <div>
                                <Select 
                                label={'Pilihan Masjid Ahli Kariah'}
                                placeholder='-- Silih Pilih Kariah Masjid --'
                                defaultValue={masjid_ahli_kariah}
                                options={pilihan_masjid}
                                />
                            </div>
                            <div className='mt-3'>
                                <Textinput 
                                type={'text'}
                                label={'Nama Penuh Ahli Kariah'}
                                placeholder='Contoh: Muhammad Firdaus Bin Mohd Fazil'
                                defaultValue={nama_ahli_kariah}
                                onChange={e => set_nama_ahli_kariah(e.targer.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <Textinput 
                                type={'text'}
                                label={'E-mel'}
                                placeholder='Contoh: firdausfazil@email.com'
                                defaultValue={email_ahli_kariah}
                                onChange={e => set_email_ahli_kariah(e.targer.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <Textinput 
                                label={'No. Telefon'}
                                placeholder='Contoh: 0123456789'
                                defaultValue={phone_ahli_kariah}
                                onChange={e => set_phone_ahli_kariah(e.targer.value)}
                                type={"number"}
                                pattern="^[0-9]" 
                                inputmode="numeric"
                                />
                            </div>
                            <div className='mt-3'>
                                <Textarea 
                                type={'text'}
                                label={'Alamat Menetap'}
                                placeholder='Contoh: Lot 40123, Jalan Seri Menanti, 71300, Kuala Pilah Negeri Sembilan.'
                                dvalue={alamat_ahli_kariah}
                                onChange={e => set_alamat_ahli_kariah(e.targer.value)}
                                >
                                    {alamat_ahli_kariah}
                                </Textarea>
                            </div>
                        </div>
                        <div className='mt-3 flex justify-end items-center'>
                            <Modal 
                                label='Daftar Ahli Kariah'
                                labelClass={'bg-teal-500 text-white'}
                                activeModal={modal}
                                centered={true}
                                onClose={() => set_modal(false)}
                                title='Pengesahan Pendaftaran Ahli Kariah'
                                uncontrol={false}
                                className='max-w-xl'
                                footerContent={(
                                    <div className='flex gap-3'>
                                        <Button onClick={() => set_modal(false)} className='bg-transparent text-gray-500'>
                                            Kembali
                                        </Button>
                                        <Button onClick={SUBMIT__FORM} className='bg-teal-500 text-white'>
                                            Teruskan
                                        </Button>
                                    </div>
                                )}
                            >
                                <div>
                                    <p className='text-sm'>
                                        Anda pasti untuk meneruskan pendaftaran sebagai ahli kariah? 
                                        Sila pastikan semua maklumat anda adalah benar.
                                    </p>
                                </div>
                            </Modal>
                            <Button onClick={() => set_modal(true)} className='bg-teal-500 text-white'>
                                Teruskan Pendaftaran
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default RegistrationAhliKariah;