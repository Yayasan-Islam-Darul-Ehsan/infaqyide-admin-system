import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { API } from '@/utils/api';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Loading from '@/components/Loading';
import Textarea from '@/components/ui/Textarea';
import moment from 'moment';

MaklumatTransaksi.propTypes = {
    
};

function MaklumatTransaksi(props) {

    const navigate                  = useNavigate()
    const { width, breakpoints }    = useWidth()
    const state                     = useLocation().state

    const [loading, set_loading]        = useState(true)
    const [transaksi, set_transaksi]    = useState(null)

    const fetch__data = async () => {
        set_loading(true)
        let api = await API(`kariah/payment/list/${state.payment_id}`, {}, "GET", true)
        set_transaksi(api.data)
        set_loading(false)
    }

    useEffect(() => {
        fetch__data()
    }, [])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Transaksi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat transaksi bayaran keahlian yang dibuat oleh ahli kariah yang berdaftar di bawah institusi anda.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-3'>
                    <Card className='col-span-7'>
                        <div>
                            <p className='font-semibold text-gray-800'>Maklumat Pembayaran</p>
                        </div>
                        <div className='mt-6'>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Nama Bil'}
                                    defaultValue={transaksi.bill_name}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textarea
                                    label={'Keterangan Bil'}
                                    dvalue={transaksi.bill_description}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Amaun (RM)'}
                                    defaultValue={transaksi.payment_amount}
                                    disabled={true}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Nama Pembayar'}
                                    defaultValue={transaksi.payor_name}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'E-mel Pembayar'}
                                    defaultValue={transaksi.payor_email}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'No. Telefon Pembayar'}
                                    defaultValue={transaksi.payor_phone}
                                    disabled={true}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Kaedah Pembayaran'}
                                    defaultValue={transaksi.payment_method}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Mode Pembayaran'}
                                    defaultValue={transaksi.payment_mode}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Tarikh & Masa'}
                                    defaultValue={moment(transaksi.payment_date).format("YYYY-MM-DD hh:mm A")}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Status'}
                                    defaultValue={
                                        transaksi.payment_status === 'Approve'
                                            ? 'Berjaya'
                                            : transaksi.payment_status === 'Pending'
                                            ? 'Dalam Proses'
                                            : transaksi.payment_status === 'Complete'
                                            ? 'Selesai'
                                            : transaksi.payment_status === 'Cancel'
                                            ? 'Gagal'
                                            : transaksi.payment_status === 'Others'
                                            ? 'Lain-Lain'
                                            : transaksi.payment_status
                                    }
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </Card>
                    <Card className='col-span-5'>
                        <div>
                            <p className='font-semibold text-gray-800'>Maklumat Yuran</p>
                        </div>
                        <div className='mt-6'>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Nama Yuran'}
                                    defaultValue={transaksi.yuran_name}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textarea
                                    label={'Keterangan Bil'}
                                    dvalue={transaksi.yuran_description}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Amaun (RM)'}
                                    defaultValue={transaksi.yuran_amount}
                                    disabled={true}
                                    type={"number"}
                                    pattern="^[0-9]" 
                                    inputmode="numeric"
                                />
                            </div>
                            <div className='mb-3 grid grid-cols-1 md:grid-cols-1'>
                                <Textinput 
                                    label={'Jenis'}
                                    defaultValue={transaksi.yuran_type}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default MaklumatTransaksi;