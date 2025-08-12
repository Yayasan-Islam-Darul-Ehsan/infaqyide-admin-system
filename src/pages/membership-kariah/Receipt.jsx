import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import LoaderCircle from '@/components/Loader-circle';
import { Pane } from 'evergreen-ui';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import AnimatedLotties from '@/components/AnimatedLotties';

function ReceiptPaymentMembershipKariah() {

    const { width, breakpoints }    = useWidth();
    const { user }                  = useSelector(a => a.auth)
    const [loading, set_loading]    = useState(true)
    const [modal, set_modal]        = useState(false)

    useEffect(() => {
        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }, [])

    const closeModal = () => {set_modal(false)}
    const openModal = () => {set_modal(true)}

    return (
        <div className=''>

            <Modal
                title='Cetak Resit Bayaran Keahlian'
                activeModal={modal}
                uncontrol={false}
                centered={true}
                onClose={closeModal}
                footerContent={(
                    <Button onClick={closeModal}>Tutup</Button>
                )}
            >
                <div className=''>
                    <AnimatedLotties 
                    title='Cetak Resit Berjaya'
                    description='Sila semak E-mel anda untuk mendapatkan resit bayaran keahlian anda.'
                    status={true}
                    />
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Resit Bayaran Keahlian Kariah</p>  
                        <p className={`text-xs text-gray-500`}>Berikut merupakan resit maklumat bayaran keahlian kariah anda.</p>  
                    </div>
                </div>
            </section>            

            <section className='mt-6 flex flex-col justify-center items-center'>
                <Card className='max-w-[768px] w-[768px] h-full'>

                    {
                        loading && <LoaderCircle />
                    }

                    {
                        !loading && (
                            <Pane>
                                <div className='flex items-center justify-center'>
                                    <img src="https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png" alt="" className='max-w-[80px]' />
                                </div>

                                <div className='mt-3 text-center'>
                                    <p className='font-semibold text-lg'>Resit Bayaran Keahlian Kariah</p>
                                </div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Maklumat Ahli</p></div>
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Nama</p>
                                            <p className='font-normal text-xs text-gray-900'>{user.account_fullname}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>E-mel</p>
                                            <p className='font-normal text-xs text-gray-900'>{user.account_email}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>No. Telefon</p>
                                            <p className='font-normal text-xs text-gray-900'>{user.account_phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 border-t border-dashed border-gray-400'></div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Maklumat Pembayaran</p></div>
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Tarikh</p>
                                            <p className='font-normal text-xs text-gray-900'>{moment(new Date()).format("DD MMM YYYY, H:mm A")}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>No. Rujukan</p>
                                            <p className='font-normal text-xs text-gray-900'>AJKARIAH019281982918263</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>No. Transaksi FPX</p>
                                            <p className='font-normal text-xs text-gray-900'>202405191289173726427</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Status</p>
                                            <p className='font-normal text-xs text-gray-900'><Badge className='bg-emerald-600 text-white'>Berjaya</Badge></p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Amaun (RM)</p>
                                            <p className='font-semibold text-lg text-gray-900'>RM 1,500.00</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 border-t border-dashed border-gray-400'></div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Tindakan</p></div>
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Jenis Bayaran</p>
                                            <p className='font-normal text-xs text-gray-900'>Keahlian Seumur Hidup</p>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='font-semibold text-xs text-gray-900'>Rujukan</p>
                                            <p className='font-normal text-xs text-gray-900'>
                                                <div className='mt-3 p-3 border border-dashed rounded'>
                                                    <p className='text-xs'>1. Bayaran pendaftaran ahli kariah sekali seumur hidup</p>
                                                    <p className='text-xs'>2. Bayaran pengurusan</p>
                                                    <p className='text-xs'>3. Bayaran keahlian (seumur hidup)</p>
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Pane>
                        )
                    }
                </Card>
                {
                    !loading && (
                        <Pane>
                            <div className='mt-3 flex justify-center items-center'>
                                <Button onClick={openModal} className='bg-primary-600 text-white items-center'><Icons className={'mr-1 text-lg'} icon={'heroicons:printer'} /> Cetak Resit</Button>
                            </div>
                        </Pane>
                    )
                }
            </section>
        </div>
    );
}

export default ReceiptPaymentMembershipKariah;