import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import moment from 'moment';
import API_FORM_DATA, {  API_FORM_DATA_STAGING } from '@/utils/api';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Alert, FileCard, FileUploader } from 'evergreen-ui';
import Card from '@/components/ui/Card';
import { Pane } from 'evergreen-ui';
import Badge from '@/components/ui/Badge';
import AnimatedLotties from '@/components/AnimatedLotties';
import Icons from '@/components/ui/Icon';
import { API } from '@/utils/api';



import 'ckeditor5/ckeditor5.css';

MaklumatTransaksi.propTypes = {};

function MaklumatTransaksi(props) {

    const { width, breakpoints }            = useWidth();
    const navigate                          = useNavigate()
    const state                             = useLocation().state
    const { user }                          = useSelector(a => a.auth)

    const [loading, set_loading]            = useState(true)
    const [transaction, set_transaction]    = useState("")
    const [modal, set_modal]                = useState(false)


    const GET__TRANSAKSI__DETAILS = async () => {
        set_loading(true);
        try {
            let api = await API("getTransaksiDetails", { payment_ref: state.bill_invoice_no }, "POST", true);
            console.log('Log Get DETAILS  : ', api);
    
            // Check if api is not null or undefined
            if (api.status == 200) {
                set_transaction(api.data[0]);
            } else {
                console.error('Failed to fetch transaction details or invalid status code:', api);
                
            }
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            
        }
        set_loading(false);
    };
    

    useEffect(() => {
        GET__TRANSAKSI__DETAILS()
    }, []);

    const closeModal    = () => {set_modal(false)}
    const openModal     = () => {set_modal(true)}

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Transaksi</p>  
                        <p className={`text-xs text-gray-500`}>Berikut adalah maklumat transaksi institusi anda.</p>  
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
                                    <img src="https://yide.com.my/wp-content/uploads/2024/07/logo-besar.png" alt="" className='max-w-[200px]' />
                                </div>

                                <div className='mt-3 text-center'>
                                    <p className='font-semibold text-lg'>Resit Transaksi</p>
                                </div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Maklumat Pembayar</p></div>
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Nama</p>
                                            <p className='font-normal text-xs text-gray-900'>{transaction.bill_payor}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Kepada Institusi</p>
                                            <p className='font-normal text-xs text-gray-900'>{transaction.org_name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 border-t border-dashed border-gray-400'></div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Maklumat Pembayaran</p></div>
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Tarikh</p>
                                            <p className='font-normal text-xs text-gray-900'>{moment(transaction.bill_datetime).format("DD MMM YYYY, H:mm A")}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>No. Rujukan</p>
                                            <p className='font-normal text-xs text-gray-900'>{transaction.bill_invoice_no}</p>
                                        </div>
                                        <div className='mt-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Amaun (RM)</p>
                                            <p className='font-semibold text-lg text-gray-900'>RM {parseFloat(transaction.bill_amount).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 border-t border-dashed border-gray-400'></div>

                                <div className='mt-6'>
                                    <div><p className='font-semibold text-sm text-gray-900'>Tindakan</p></div>
                                    <div className='mt-3'>
                                        <div className='mb-3 flex justify-between items-center'>
                                            <p className='font-semibold text-xs text-gray-900'>Jenis Bayaran</p>
                                            <p className='font-normal text-xs text-gray-900'>{transaction.bill_payment_channel}</p>
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
                {/* {
                    !loading && (
                        <Pane>
                            <div className='mt-3 flex justify-center items-center'>
                                <Button onClick={openModal} className='bg-primary-600 text-white items-center'><Icons className={'mr-1 text-lg'} icon={'heroicons:printer'} />Cetak Resit PDF</Button>
                            </div>
                        </Pane>
                    )
                } */}
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

export default MaklumatTransaksi;