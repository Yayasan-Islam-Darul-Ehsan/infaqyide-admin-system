import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import useDarkmode from '@/hooks/useDarkMode';
import Button from '@/components/ui/Button';
import { API } from '@/utils/api';
import LoaderCircle from '@/components/Loader-circle';
import moment from 'moment';

TopupResit.propTypes = {
    
};

function TopupResit(props) {

    const [searchParams] = useSearchParams();

    console.log("Log URL : ", window.location.href.split("/resit"))

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading, set_loading] = useState(true)

    const [isDark] 		= useDarkmode();
	const { isAuth } 	= useSelector((state) => state.auth);

    const [order_id, set_order_id]  = useState(searchParams.get("order_id"))
    const [receipt, set_receipt]    = useState(null)

    const GET__RECEIPT = async () => {

        set_loading(true)

        let api = await API("getTransaksiWalletKredit", { payment_ref: searchParams.get("order_id") })
        console.log("Log APi Get Receipt : ", api)

        if(api.status === 200) {
            set_receipt(api.data[0])
        }

        set_loading(false)
    }

    useEffect(() => {
        GET__RECEIPT()
    }, [searchParams])

    return (
        <div className="flex flex-col items-center justify-center app_height">
		
		{!isAuth && (
			<div className="mb-3">
			<img src={isDark ? LogoWhite : Logo} alt="Logo" />
			</div>
		)}

        {
            loading && (
                <Card className='min-w-[786px]'>
                    <LoaderCircle />
                </Card>
            )
        }

        {
            !loading && (
                <Card className='min-w-[786px]'>
                    <div className='flex justify-center'>
                        <img src="https://demo.al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png" alt="" className='w-[100px] h-[120px]' />
                    </div>

                    <div className='mt-4 text-center'>
                        <p className='font-semibold text-xl text-gray-900'>Resit Pembayaran Tambah Nilai</p>
                        <p className='font-base text-sm text-gray-500'>Berikut adalah maklumat pembayaran tambah nilai anda di bawah.</p>
                    </div>

                    <div className='mt-12'>
                        <div className='mb-3 grid grid-cols-2 justify-between items-center'>
                            <div>
                                <p className='font-normal text-sm text-gray-900'>No. Rujukan Bayaran</p>
                            </div>
                            <div className='text-end'>
                                <p className='font-semibold text-sm text-gray-900'>{order_id}</p>
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2 justify-between items-center'>
                            <div>
                                <p className='font-normal text-sm text-gray-900'>Status Pembayaran</p>
                            </div>
                            <div className='text-end'>
                                <p className='font-semibold text-sm text-gray-900'>{receipt.bill_status === 1 ? "Berjaya" : "Tidak Berjaya"}</p>
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2 justify-between items-center'>
                            <div>
                                <p className='font-normal text-sm text-gray-900'>Tarikh Pembayaran</p>
                            </div>
                            <div className='text-end'>
                                <p className='font-semibold text-sm text-gray-900'>{moment(receipt.bill_datetime).format("DD MMM YYYY, hh:mm A")}</p>
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2 justify-between items-center'>
                            <div>
                                <p className='font-normal text-sm text-gray-900'>Amaun Tambah Nilai (RM)</p>
                            </div>
                            <div className='text-end'>
                                <p className='font-semibold text-sm text-gray-900'>RM {parseFloat(receipt.bill_amount).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className='mb-3 grid grid-cols-2 justify-between items-center'>
                            <div>
                                <p className='font-normal text-sm text-gray-900'>Kaedah Bayaran</p>
                            </div>
                            <div className='text-end'>
                                <p className='font-semibold text-sm text-gray-900'>{receipt.bill_payment_channel}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 border-t border-gray-400 border-dotted'></div>

                    <div className='my-12 flex justify-center'>
                        <Button className='bg-teal-600 text-white' onClick={() => navigate("/tabung/senarai-tabung")}>Kembali Ke Halaman Utama</Button>
                    </div>

                    <div className='mt-6'>
                        <p className='text-center text-xs text-gray-400'>Ini Adalah Cetakan Komputer Dan Tidak Memerlukan Tandatangan</p>
                        <p className='text-center text-xs text-gray-400'>Hak Cipta Terpelihara {new Date().getFullYear()} @ Al-Jariyah.com</p>
                    </div>

                </Card>
            )
        }

		</div>
    );
}

export default TopupResit;