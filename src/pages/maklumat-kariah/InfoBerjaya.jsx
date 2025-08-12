import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWidth from '@/hooks/useWidth';
import { useSelector } from 'react-redux';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

InfoBerjaya.propTypes = {
    
};

function InfoBerjaya(props) {

    const { user }                  = useSelector(a => a.auth)

    const [loading, set_loading]    = useState(true)
    const [isKariah, setIsKariah]   = useState(false)
    const { width, breakpoints }    = useWidth();

    useEffect(() => {
        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }, [])

    return (
        <div>
            <section>

                <div className='flex flex-row items-center gap-4'>
                    <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Ahli Kariah (Surau Taman Dato' Wan)</p>
                </div>

                <div className='mt-6'>
                    <Card>
                        <div>
                            <p className='font-semibold text-lg text-gray-800'>{user.account_fullname} <Badge className='bg-emerald-600 text-white' >Ahli Kariah</Badge></p>
                            <p className='font-base text-xs text-gray-500'>Ahli Kariah Surau Taman Dato' Wan</p>
                        </div>
                        <div className='w-full mt-6 grid grid-cols-1 lg:grid-cols-8 gap-3'>
                            <div className='col-span-1'>
                                <img 
                                    src={user.account_image ? user.account_image : 'https://service.sarawak.gov.my/web/web/web/web/res/no_image.png'} 
                                    alt="" 
                                    className='h-[200px] w-[180px] object-cover rounded-lg'
                                />
                            </div>
                            <div className='col-span-7'>
                                <div className='flex flex-row w-full'>
                                    <p className='font-semibold'>Nama Pengguna: </p>
                                    <p className='pl-3'>{user.account_username}</p>
                                </div>
                                <div className='mt-1 flex flex-row w-full'>
                                    <p className='font-semibold'>Nama Penuh: </p>
                                    <p className='pl-3'>{user.account_fullname}</p>
                                </div>
                                <div className='mt-1 flex flex-row w-full'>
                                    <p className='font-semibold'>E-mel: </p>
                                    <p className='pl-3'>{user.account_email}</p>
                                </div>
                                <div className='mt-1 flex flex-row w-full'>
                                    <p className='font-semibold'>No. Telefon: </p>
                                    <p className='pl-3'>{user.account_phone}</p>
                                </div>
                                <div className='mt-1 flex flex-row w-full'>
                                    <p className='font-semibold'>Alamat: </p>
                                    <p className='pl-3'>{user.account_address}</p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6 border-t border-gray-100 pt-3'>
                            <div>
                                <p className='font-semibold text-gray-900 text-lg'>Maklumat Kariah</p>
                            </div>
                            <div className='mt-3'>
                                <div className='flex flex-row w-full'>
                                    <p className='font-semibold'>Nama Kariah: </p>
                                    <p className='pl-3'>Surau Taman Dato' Wan</p>
                                </div>
                                <div className='flex flex-row w-full'>
                                    <p className='font-semibold'>Alamat: </p>
                                    <p className='pl-3'>Persiaran Dato Wan, Tapian Gelanggang Paroi, 70400 Seremban, Negeri Sembilan</p>
                                </div>
                                <div className='flex flex-row w-full'>
                                    <p className='font-semibold'>Nama Pengurus: </p>
                                    <p className='pl-3'>En. Mohd Fazil</p>
                                </div>
                                <div className='flex flex-row w-full'>
                                    <p className='font-semibold'>No. Telefon Pengurus: </p>
                                    <p className='pl-3'>+60123456789</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default InfoBerjaya;