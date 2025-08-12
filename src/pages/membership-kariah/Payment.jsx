import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Pane } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';

PaymentMembershipkariah.propTypes = {
    
};

function PaymentMembershipkariah(props) {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth();
    const [plan, set_plan]                      = useState(null)

    const [payment_method, set_payment_method]  = useState("")

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Bayaran Keahlian Kariah</p>  
                        <p className={`text-xs text-gray-500`}>Lengkapkan maklumat bayaran keahlian anda di bawah.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-3'>
                <Card>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='col-span-1'>
                            <div><p className='font-semibold text-lg'>Plan Bayaran Keahlian</p></div>
                            <div className='mt-3'>
                                <Pane onClick={() => set_plan(1)} className={`${plan === 1 ? 'bg-gray-200' : 'bg-white'} mt-3 mb-3 border border-gray-200 rounded p-5`}>
                                    <div className='font-semibold text-sm'>Yuran Pendaftaran & Yuran Tahunan Keahlian</div>
                                    <div className='pl-6 flex justify-between items-center'>
                                        <div>
                                            <ul className='list-disc text-xs'>
                                                <li>Bayaran pendaftaran ahli kariah sekali seumur hidup</li>
                                                <li>Bayaran pengurusan</li>
                                                <li>Bayaran keahlian (seumur hidup)</li>
                                            </ul>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-xs'>Bermula dari:</p>
                                            <p className='font-semibold text-xl text-red-500'>RM 100.00 / Bulan</p>
                                        </div>
                                    </div>
                                </Pane>
                                <Pane onClick={() => set_plan(2)} className={`${plan === 2 ? 'bg-gray-200' : 'bg-white'} border border-gray-200 rounded p-5`}>
                                    <div className='font-semibold text-sm'>Yuran Pendaftaran & Yuran Keahlian Seumur Hidup</div>
                                    <div className='pl-6 flex justify-between items-center'>
                                        <div>
                                            <ul className='list-disc text-xs'>
                                                <li>Bayaran pendaftaran ahli kariah sekali seumur hidup</li>
                                                <li>Bayaran pengurusan</li>
                                                <li>Bayaran keahlian (seumur hidup)</li>
                                            </ul>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-xs'>Hanya:</p>
                                            <p className='font-semibold text-xl text-red-500'>RM 1,500.00</p>
                                        </div>
                                    </div>
                                </Pane>
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div><p className='font-semibold text-lg'>Kaedah Bayaran</p></div>
                            <div className='mt-3'>
                                <Pane onClick={() => set_payment_method(payment_method === "FPX" ? "" : "FPX")} className={`p-3 rounded border border-gray-200 w-[200px] ${payment_method === "FPX" && 'bg-gray-200'}`}>
                                    <img src='https://vectorlogo4u.com/wp-content/uploads/2020/10/fpx-logo-vector-01-1024x483.png' />
                                    <div className='mt-1 text-center'><p className='text-xs text-gray-500'>Online Banking</p></div>
                                </Pane>
                            </div>
                            <div className='mt-5'>
                                <div className='mt-5'>
                                    <p className='font-semibold text-lg'>Pecahan Bayaran</p>
                                    <div className='mt-3'>
                                        <div className='flex flex-row items-center justify-between'>
                                            <p className='text-xs font-normal text-gray-900'>Bayaran pendaftaran ahli kariah seumur hidup</p>
                                            <p className='text-xs font-semibold text-gray-900'>RM 1,500.00</p>
                                        </div>
                                        <div className='mt-2 flex flex-row items-center justify-between'>
                                            <p className='text-xs font-normal text-gray-900'>Bayaran pengurusan</p>
                                            <p className='text-xs font-semibold text-gray-900'>RM 100.00</p>
                                        </div>
                                        <div className='mt-2 flex flex-row items-center justify-between'>
                                            <p className='text-xs font-normal text-gray-900'>Bayaran keahlian seumur hidup (50 - 60 Tahun)</p>
                                            <p className='text-xs font-semibold text-gray-900'>RM 300.00</p>
                                        </div>
                                    </div>
                                    <div className='mt-3 border-t border-gray-200 pb-3 pt-3'>
                                        <div className='mt-2 flex flex-row items-center justify-between'>
                                            <p className='text-lg font-semibold text-gray-900'>Jumlah</p>
                                            <p className='text-lg font-semibold text-gray-900'>RM 1,400.00</p>
                                        </div>
                                    </div>
                                    <div className='mt-3 border-t border-gray-200 pb-3 pt-3'>
                                        <div className='mt-2 flex flex-row items-center justify-end'>
                                            <Button onClick={() => navigate("/membership-kariah/receipt")} className='bg-teal-500 text-white'>
                                                Teruskan Pembayaran
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default PaymentMembershipkariah;