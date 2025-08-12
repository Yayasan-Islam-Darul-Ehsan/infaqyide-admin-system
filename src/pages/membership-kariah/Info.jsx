import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';
import { useSelector } from 'react-redux';
import Card from '@/components/ui/Card';
import useWidth from '@/hooks/useWidth';
import QRCode from 'react-qr-code';
import Icons from '@/components/ui/Icon';
import { Icon } from '@iconify/react';

import gmail from "@/assets/images/e-commerce/productDetails/gmail.svg";
import facebook from "@/assets/images/e-commerce/productDetails/facebook.svg";
import twitter from "@/assets/images/e-commerce/productDetails/twitter.svg";
import insta from "@/assets/images/e-commerce/productDetails/insta.svg";
import linkedin from "@/assets/images/e-commerce/productDetails/linkedin.svg";
import Badge from '@/components/ui/Badge';
import { Alert } from 'evergreen-ui';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

InfoMembershipKariah.propTypes = {
    
};

function InfoMembershipKariah(props) {

    const { user }                              = useSelector(a => a.auth )
    const navigate                              = useNavigate()
    const [loading, set_loading]                = useState(true)
    const { width, breakpoints }                = useWidth();

    const [membership_id, set_membership_id]    = useState(user.account_secret_key)

    useEffect(() => {
        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }, [])

    return (
        <div>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Membership Kariah</p>  
                        <p className={`text-xs text-gray-500`}>Berikut adalah senarai maklumat membership anda.</p>  
                    </div>
                    <div>
                        <Button onClick={() => navigate("/membership-kariah/payment")}  className='bg-teal-500 text-white'>
                            Bayar Keahlian
                        </Button>
                    </div>
                </div>
            </section>

            <section className='mt-3'>
                <div>
                    <Card>

                        {
                            loading && <Loading /> 
                        }

                        {
                            loading === false && (
                                <div className='flex flex-row gap-3'>
                                    <div className=''>
                                        <QRCode
                                            className='border p-3 rounded-lg bg-white shadow'
                                            size={256}
                                            style={{ 
                                                height: "auto", 
                                                maxWidth: "100%", 
                                                width: "100%" 
                                            }}
                                            value={membership_id}
                                            viewBox={`0 0 256 256`}
                                        />
                                        <div className='mt-2 text-center'>
                                            <p className='text-xs'>{membership_id}</p>
                                        </div>
                                        <div className='mt-3 text-center'>
                                            <Badge className='bg-red-600 text-white'>Tidak Aktif</Badge>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <div className='mb-3'>
                                            <Alert
                                            intent='danger'
                                            title="Keahlian Tidak Aktif"
                                            >
                                                Harap maaf! Keahlian kariah anda tidak aktif. Sila buat bayaran keahlian anda dengan klik butang di bawah.
                                            </Alert>
                                        </div>
                                        <div>
                                            <p className='font-semibold text-2xl text-gray-900'>{user.account_fullname} <span className='text-gray-500 text-sm'>({user.account_username})</span></p>
                                            <div className='flex gap-1'>
                                                <Icon icon="ph:star-fill" className="text-yellow-400" />
                                                <Icon icon="ph:star-fill" className="text-yellow-400" />
                                                <Icon icon="ph:star-fill" className="text-yellow-400" />
                                                <Icon icon="ph:star-fill" className="text-yellow-400" />
                                                <Icon icon="ph:star-fill" className="text-yellow-400" />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-gray-500 text-sm'>
                                                {user.account_address}
                                            </p>
                                        </div>
                                        <div className='mt-3'>
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse ">
                                                <p className="font-normal text-xs text-slate-500 dark:text-slate-400">
                                                    Kongsi kepada:
                                                </p>
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <button type="button" className="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center">
                                                        <img className="w-full h-full" src={gmail} alt="" />
                                                    </button>
                                                    <button type="button" className="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center">
                                                        <img className="w-full h-full" src={facebook} alt="" />
                                                    </button>
                                                    <button type="button" className="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center">
                                                        <img className="w-full h-full" src={twitter} alt="" />
                                                    </button>
                                                    <button type="button" className="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center">
                                                        <img className="w-full h-full" src={insta} alt="" />
                                                    </button>
                                                    <button type="button" className="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center">
                                                        <img className="w-full h-full" src={linkedin} alt="" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-6'>
                                            <p className='font-semibold text-gray-900'>Surau Taman Dato' Wan</p>
                                            <p className='text-sm text-gray-500'>
                                            Persiaran Dato Wan, Tapian Gelanggang Paroi, 70400 Seremban, Negeri Sembilan
                                            </p>
                                            <p className='text-xs text-gray-500'>surautamandatowan@gmail.com</p>
                                            <p className='text-xs text-gray-500'>+06-704 0246</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default InfoMembershipKariah;