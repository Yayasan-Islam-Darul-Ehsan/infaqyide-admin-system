import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { Icons } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import moment from 'moment';
import Badge from '@/components/ui/Badge';

function MaklumatBayaranKhairatKematian() {

    const navigate                      = useNavigate()
    const { width, breakpoints }        = useWidth()
    const state                         = useLocation().state

    const [loading, set_loading]        = useState(true)
    const [transaksi, set_transaksi]    = useState(null)

    const fetch__data = async () => {
        set_loading(true)
        let api = await API(`kariah/payout/list/${state.payout_id}`, {}, "GET", true)
        console.log("Log API : ", api)
        if(api.status_code === 200) {
            set_transaksi(api.data)
        }
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
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Transaksi Bayaran Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai transaksi bayaran yang telah dibuat oleh ahli kariah anda. Klik pada senarai transaksi di bawah untuk melihat maklumat lanjut.</p>  
                    </div>
                    {/* <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button>
                    </div> */}
                </div>
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-3'>
                    <Card className='col-span-1 md:col-span-7'>
                        <div>
                            <p className='font-semibold text-gray-900 text-sm'>Maklumat Pembayaran</p>
                        </div>    
                        <div className='mt-6'>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Nama Bil'}
                                    defaultValue={transaksi.payout_name}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textarea 
                                    label={'Keterangan Bil'}
                                    dvalue={transaksi.payout_description}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Jumlah (RM)'}
                                    defaultValue={transaksi.payout_amount}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Mode Pembayaran'}
                                    defaultValue={transaksi.payout_mode}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Kaedah Bayaran'}
                                    defaultValue={transaksi.payout_method}
                                    disabled={true}
                                />
                            </div>
                            {
                                transaksi.payout_method === "Cash" && (
                                    <div className='mb-3'>
                                        <label htmlFor="" className='form-label'>Dokumen</label>
                                        <div>
                                            <a href={transaksi.payout_file} className='underline text-primary-600 text-sm'>{transaksi.payout_file}</a>
                                        </div>
                                        {/* <Textinput 
                                            label={'File'}
                                            defaultValue={transaksi.payout_file}
                                            disabled={true}
                                        /> */}
                                    </div>
                                )
                            }
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Tarikh & Masa'}
                                    defaultValue={moment(transaksi.payout_created_date).format("YYYY-MM-DD hh:mm A")}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <div>
                                    <label htmlFor="" className='form-label'>Status Pembayaran</label>
                                </div>
                                {
                                    transaksi.payout_status === "Success" && (
                                        <Badge className='bg-emerald-600 text-white'>Transaksi Berjaya</Badge>
                                    )
                                }
                                {
                                    transaksi.payout_status !== "Success" && (
                                        <Badge className='bg-gray-600 text-white'>{transaksi.payout_status}</Badge>
                                    )
                                }
                            </div>
                        </div>
                    </Card>
                    <Card className='col-span-1 md:col-span-5'>
                        <div>
                            <p className='font-semibold text-gray-900 text-sm'>Maklumat Penerima Bayaran / Waris</p>
                        </div>
                        <div className='mt-6'>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Nama'}
                                    placeholder='-- tiada maklumat --'
                                    defaultValue={transaksi.receiver_name}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'E-mel'}
                                    placeholder='-- tiada maklumat --'
                                    defaultValue={transaksi.receiver_email}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'No. Telefon'}
                                    placeholder='-- tiada maklumat --'
                                    defaultValue={transaksi.receiver_phone}
                                    disabled={true}
                                />
                            </div>
                            <div className='mb-3'>
                                <Textinput 
                                    label={'Hubungan'}
                                    placeholder='-- tiada maklumat --'
                                    defaultValue={transaksi.receiver_phone}
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

export default MaklumatBayaranKhairatKematian;