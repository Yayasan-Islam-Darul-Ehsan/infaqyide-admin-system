import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '@/utils/api';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import { Spinner } from 'evergreen-ui';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import ListLoading from '@/components/skeleton/ListLoading';
import Badge from '@/components/ui/Badge';
import moment from 'moment';

MaklumatAhliKhairat.propTypes = {
    
};

function MaklumatAhliKhairat(props) {

    const state                                     = useLocation().state
    const navigate                                  = useNavigate()
    const { width, breakpoints }                    = useWidth()

    const [loading, set_loading]                    = useState(true)
    const [makluamt_ahli, set_maklumat_ahli]        = useState(null)

    const [loading_transaksi, set_loading_transaksi]= useState(true)
    const [transaksi, set_transaksi]                = useState([])

    const get_ahli = async () => {
        set_loading(true)
        let api = await API(`kariah/ahli-khairat/list/${state.member_id}`, {}, "GET", true)
        if(api.status_code === 200) {
            set_maklumat_ahli(api.data)
        }
        set_loading(false)
    }

    const get_transaksi = async () => {
        set_loading_transaksi(true)
        let api = await API("kariah/ahli-khairat/list-payment", { member_id: state.member_id })
        if(api.status_code === 200) {
            set_transaksi(api.data.row)
        }
        set_loading_transaksi(false)
    }

    useEffect(() => {
        get_ahli()
        get_transaksi()
    }, [])

    const get_badge = (status) => {
        if(status === 'Approve') {
            return <Badge className='bg-emerald-600 text-white'>Berjaya</Badge>
        } 
        else if(status === 'Pending') {
            return <Badge className='bg-yellow-600 text-white'>Dalam Proses</Badge>
        } 
        else {
            return <Badge className='bg-gray-600 text-white'>Lain-lain</Badge>
        }
    }

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Ahli Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat ahli khairat kematian yang telah berdaftar di bawah institusi kariah anda.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
            <Card>
                {
                    loading && (
                        <>
                        <div className='flex justify-center items-center'>
                            <Spinner />
                        </div>
                        </>
                    )
                }

                {
                    loading === false && (
                        <>
                        <div>
                            <div><p className='font-semibold text-gray-900 text-xl'>Maklumat Peribadi Ahli Khairat Kematian</p></div>
                            <div className='mt-3'>
                                <div className='mb-3 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                    <Textinput 
                                        label={'Nama Penuh'}
                                        placeholder='Contoh: Muhammad Firdaus Bin Mohd Fazil'
                                        defaultValue={makluamt_ahli.full_name}
                                        disabled={true}
                                    />
                                    <Textinput 
                                        label={'E-mel'}
                                        placeholder='Contoh: m.firdausfazil@email.com'
                                        defaultValue={makluamt_ahli.email_address}
                                        disabled={true}
                                    />
                                    <Textinput 
                                        label={'No. Telefon'}
                                        placeholder='Contoh: 0123456789'
                                        defaultValue={makluamt_ahli.phone_number}
                                        disabled={true}
                                        type={"number"}
                                        pattern="^[0-9]" 
                                        inputmode="numeric"
                                    />
                                </div>
                                <div className='mb-3 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                    <Textinput 
                                        label={'Jantina'}
                                        placeholder='Contoh: Lelaki'
                                        defaultValue={makluamt_ahli.gender}
                                        disabled={true}
                                    />
                                    <Textinput 
                                        label={'Status Perkahwinan'}
                                        placeholder='Contoh: Berkahwin'
                                        defaultValue={makluamt_ahli.marital_status}
                                        disabled={true}
                                    />
                                    <Textinput 
                                        label={'Status Ahli'}
                                        placeholder='Contoh: 0123456789'
                                        defaultValue={makluamt_ahli.status}
                                        disabled={true}
                                    />
                                </div>
                                <div className='mb-3 grid grid-cols-1 gap-3'>
                                    <Textarea
                                        label={'Alamat Menetap'}
                                        placeholder='Contoh: A-16-02, Zeva Residence, Pinggiran Seri Kembangan, 43300, Seri Kembangan, Selangor, Malaysia'
                                        dvalue={makluamt_ahli.home_address}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className='mt-6'>
                                <p className='font-semibold text-gray-900 text-xl'>Maklumat Keahlian</p>
                            </div>
                            <div className='mt-3'>
                                <div className='mb-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <Textinput 
                                        label={'Jenis Keahlian'}
                                        placeholder='Contoh: Keahlian Penuh'
                                        defaultValue={"Keahlian " + makluamt_ahli.subscription_type}
                                        disabled={true}
                                    />
                                    <Textinput 
                                        label={'Nama Keahlian'}
                                        placeholder='Contoh: Keahlian Seumur Hidup'
                                        defaultValue={(makluamt_ahli.yuran_name).replace("Yuran Pendaftaran", "")}
                                        disabled={true}
                                    />
                                </div>
                                <div className='mb-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                                {
                                    makluamt_ahli.yuran_item.length > 0 && makluamt_ahli.yuran_item.map((item, index) => (
                                        <Textinput
                                            key={index} 
                                            label={`Keterangan Keahlian No. ${index + 1}`}
                                            placeholder='Contoh: Item 1'
                                            defaultValue={item}
                                            disabled={true}
                                        />
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                        </>
                    )
                }
            </Card>
            </section>

            <section className='mt-6'>
            <Card>
                {
                    loading_transaksi && (
                        <>
                        <div className='flex justify-center items-center'>
                            <ListLoading count={10} />
                        </div>
                        </>
                    )
                }

                {
                    loading_transaksi === false && (
                        <>
                        <div>
                            <div><p className='font-semibold text-gray-900 text-xl'>Senarai Transakasi Bayaran Khairat Kematian</p></div>
                            <div className='mt-3'>
                                <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                    <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                        <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                        <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Bil</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Jumlah(RM)</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Kariah</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>E-mel</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>No. Telefon</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh</td>
                                    </thead>
                                    <tbody className='text-sm p-3'>
                                        {
                                            transaksi.length < 1 && (
                                                <tr className='border border-gray-100 p-3'>
                                                    <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
                                                </tr>
                                            )
                                        }
                                        {
                                            transaksi.length > 0 && transaksi.map((data, index) => (
                                                <tr key={index} className='border border-gray-100 p-3'>
                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                    <td width={'20%'} className='p-3 font-semibold text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{data.bill_name}</p>
                                                        <p className='font-semibold text-gray-900 underline'>{data.transaction_id}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{data.payment_amount}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{data.payor_name}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{data.payor_email}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{data.payor_phone}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{get_badge(data.payment_status)}</p>
                                                    </td>
                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                        <p className='font-normal text-gray-900'>{moment(data.created_date).format("YYYY-MM-DD hh:mm A")}</p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </>
                    )
                }
            </Card>
            </section>
        </div>
    );
}

export default MaklumatAhliKhairat;