import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import Button from '@/components/ui/Button';
import useWidth from '@/hooks/useWidth';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import LoaderCircle from '@/components/Loader-circle';
import { Pane } from 'evergreen-ui';
import { useSelector } from 'react-redux';
import Badge from '@/components/ui/Badge';
import moment from 'moment';
import Modal from '@/components/ui/Modal';
import AnimatedLotties from '@/components/AnimatedLotties';

TransactionDetail.propTypes = {
    
};

function TransactionDetail(props) {

    const { width, breakpoints }            = useWidth();
    const navigate                          = useNavigate()
    const state                             = useLocation().state
    const { user }                          = useSelector(a => a.auth)

    const [loading, set_loading]            = useState(true)
    const [transaction, set_transaction]    = useState(null)
    const [modal, set_modal]                = useState(false)

    useEffect(() => {
        fetch_info()
    }, [])

    const fetch_info = async () => {
        set_loading(true)
        setTimeout(() => {
            set_loading(false)
        }, 1000);
        set_loading(false)
    }

    const closeModal = () => {set_modal(false)}
    const openModal = () => {set_modal(true)}

    if(loading) {
        return <Loading />
    }

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Transaksi</p>  
                        <p className={`text-xs text-gray-500`}>Berikut adalah maklumat transaksi bayaran yang telah anda lakukan.</p>  
                    </div>
                    {/* <div className='flex flex-row gap-3'>
                        <Button className='bg-white border shadow border-gray-200 items-center gap-2'><Icons icon={'heroicons:printer'} />Cetak Resit PDF</Button>
                    </div> */}
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
                                            <p className='font-normal text-xs text-gray-900'>{moment(state.transaction_date).format("DD MMM YYYY, H:mm A")}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>No. Rujukan</p>
                                            <p className='font-normal text-xs text-gray-900'>{state.transaction_reference_number}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>No. Transaksi FPX</p>
                                            <p className='font-normal text-xs text-gray-900'>{state.transaction_fpx_id}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Status</p>
                                            <p className='font-normal text-xs text-gray-900'><Badge className='bg-emerald-600 text-white'>{state.transaction_status}</Badge></p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Amaun (RM)</p>
                                            <p className='font-semibold text-lg text-gray-900'>RM {parseFloat(state.transaction_amount).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 border-t border-dashed border-gray-400'></div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Tindakan</p></div>
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Jenis Bayaran</p>
                                            <p className='font-normal text-xs text-gray-900'>{state.transaction_bill_name}</p>
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
                {
                    !loading && (
                        <Pane>
                            <div className='mt-3 flex justify-center items-center'>
                                <Button onClick={openModal} className='bg-primary-600 text-white items-center'><Icons className={'mr-1 text-lg'} icon={'heroicons:printer'} />Cetak Resit PDF</Button>
                            </div>
                        </Pane>
                    )
                }
            </section>
            {/* <section className='mt-6'>
            <Card>
                <div>
                    <p>{JSON.stringify(state)}</p>
                </div>
            </Card>
            </section>   */}
        </div>
    );
}

export default TransactionDetail;