import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Loading from '@/components/Loading';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

TambahAJK.propTypes = {};

function TambahAJK(props) {
    const { user }                              = useSelector(user => user.auth);
    const navigate                              = useNavigate();
    const { width, breakpoints }                = useWidth();

    const [jawatan_ajk, set_jawatan_ajk]        = useState("");
    const [nama_ajk, set_nama_ajk]              = useState("");
    const [emel_ajk, set_email_ajk]             = useState("");
    const [phone_ajk, set_phone_ajk]            = useState("");
    const [loading, set_loading]                = useState(true);
    const [opt_for_title, set_opt_for_title]    = useState([]);
    const [modal, set_modal]                    = useState(false);

    const GET__LIST__AJK__TITLE = async () => {
        set_loading(true);
        let api = await API("reference?title=Sub+User", {}, "GET");
        console.log("Log Api Get Role : ", api);

        if (api.status === 200 && api.data.length > 0) {
            let data = api.data;
            let array = [];
            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: data[i]["ref_name"],
                    value: data[i]["ref_name"]
                });
            }
            set_opt_for_title(array);
        }
        set_loading(false);
    };

    const CREATE__AJK = async () => {
        let json = {
            username: nama_ajk,
            role: jawatan_ajk,
            email: emel_ajk,
            phone: phone_ajk,
            ORGANIZATION_ID: user.user ? user.user.id : user.id
        };

        try {
            let api = await API("insertSubUser", json);
            console.log("Log Create AJK : ", api);

            if (api.status === 200) {
                toast.success("Pendaftaran AJK masjid telah berjaya disimpan.");
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            } else {
                // Display error message if the AJK already exists
                if (api.status === 400) {
                    toast.error(api.message);
                } else {
                    toast.error("Terdapat masalah semasa pendaftaran AJK.");
                }
            }
        } catch (error) {
            toast.error("Terdapat masalah semasa pendaftaran AJK: " + error.message);
        }
    };

    const validateFields = () => {
        if (!jawatan_ajk) {
            toast.error("Sila pilih jawatan.");
            return false;
        }
        if (!nama_ajk) {
            toast.error("Sila masukkan nama AJK.");
            return false;
        }
        if (!emel_ajk) {
            toast.error("Sila masukkan E-mel AJK.");
            return false;
        }
        if (!phone_ajk) {
            toast.error("Sila masukkan nombor telefon AJK.");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateFields()) {
            set_modal(true);
        }
    };

    useEffect(() => {
        GET__LIST__AJK__TITLE();
    }, []);

    if (loading) return <Loading />;

    return (
        <div>
            <Modal
                title='Pengesahan Pendaftaran Ahli AJK'
                themeClass='bg-teal-600 text-white'
                activeModal={modal}
                centered={true}
                onClose={() => set_modal(false)}
                footerContent={(
                    <div className='flex justify-end items-center gap-3'>
                        <Button className='' onClick={() => set_modal(false)}>Tidak</Button>
                        <Button className='bg-success-600 text-white' onClick={() => { 
                            set_modal(false);
                            CREATE__AJK();
                        }}>Ya</Button>
                    </div>
                )}
            >
                <p className='text-sm text-gray-600'>Anda pasti untuk mendaftar ahli jawatankuasa baharu?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Pendaftaran Ahli AJK Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai pendaftaran ahli jawatankuasa untuk institusi anda.</p>  
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
                        <p className='font-semibold text-lg text-gray-900'>Maklumat Ahli AJK Institusi</p>
                        <p className='font-normal text-sm text-gray-600'>Informasi mengenai ahli AJK yang akan disimpan.</p>
                    </div>
                    <div className='mt-6'>
                        <div>
                            <Select 
                                required
                                label={"Kategori Jawatan"}
                                placeholder='Contoh: Pengurusi AJK Masjid'
                                description={"Sila pilih jawatan untuk ahli jawatankuasa institusi anda."}
                                options={opt_for_title}
                                defaultValue={jawatan_ajk}
                                onChange={e => set_jawatan_ajk(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                                required
                                label={"Nama Ahli Jawatankuasa"}
                                placeholder='Contoh: Muhd Akmar Bin Muhd Khilmie'
                                defaultValue={nama_ajk}
                                onChange={e => set_nama_ajk(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput 
                                required
                                label={"E-mel Ahli Jawatankuasa"}
                                placeholder='Contoh: akmarkhlimie@email.com'
                                defaultValue={emel_ajk}
                                onChange={e => set_email_ajk(e.target.value)}
                            />
                        </div>
                        <div className='mt-6'>
                            <Textinput
                                name={"Phone"}
                                isMask={true}
                                register={() => {}}
                                required 
                                label={"No. Telefon Ahli Jawatankuasa"}
                                placeholder='Contoh: 0123456789'
                                defaultValue={phone_ajk}
                                onChange={e => set_phone_ajk(e.target.value)}
                                type={"number"}
                                pattern="^[0-9]{1,12}$" 
                                inputMode="numeric" 
                                maxLength={12} 
                                max={12}
                                isNumberOnly
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <div className='flex justify-end items-center'>
                    <Button className='bg-teal-600 text-white' onClick={handleSubmit}>Daftar Ahli AJK</Button>
                </div>
            </section>
        </div>
    );
}

export default TambahAJK;
