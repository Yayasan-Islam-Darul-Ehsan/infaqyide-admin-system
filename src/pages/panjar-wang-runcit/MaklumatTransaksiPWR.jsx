import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Card from '@/components/ui/Card';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';

MaklumatTransaksiPWR.propTypes = {
    
};

function MaklumatTransaksiPWR(props) {

    const state                         = useLocation().state
    const navigate                      = useNavigate()
    const { width, breakpoints }        = useWidth()

    const [loading, set_loading]                        = useState(true)
    const [maklumat_transaksi, set_maklumat_transaksi]  = useState(null)

    const GET__DATA = async() => {
        set_loading(true)
        let api = await API(`kewangan/panjar-wang-runcit/list-pwr-transaction/${state.pwr_id}/${state.data.rtpwr_id}`, {}, "GET")
        console.log("Log Get Transaction : ", api)

        if(api.status_code === 200) {
            set_maklumat_transaksi(api.data)
        }

        set_loading(false)
    }

    useEffect(() => {
        GET__DATA()
    }, [state])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Transaksi Panjar Wang Runcit - Petty Cash</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat terperinci mengenai transaksi panjar wang runcit.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Maklumat Transaksi PWR</p>
                    </div>
                    <div className='mt-6'>
                        <div className='mb-6'>
                            <Textinput 
                            label={"Nama Transaksi"}
                            defaultValue={maklumat_transaksi.rtpwr_title}
                            disabled={true}
                            />
                        </div>
                        <div className='mb-6'>
                            <Textarea 
                            label={"Keterangan Transaksi"}
                            dvalue={maklumat_transaksi.rtpwr_description}
                            disabled={true}
                            />
                        </div>
                        <div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div>
                                <Textinput 
                                label={"Kategori Transaksi"}
                                defaultValue={maklumat_transaksi.rtlookup_name}
                                disabled={true} 
                                />
                            </div>
                            <div>
                                <Textinput 
                                label={"Jenis Transaksi"}
                                defaultValue={maklumat_transaksi.rtlookup_type}
                                disabled={true} 
                                />
                            </div>
                        </div>
                        <div className='mb-6'>
                            <Textinput
                            label={"Amaun Transaksi (RM)"}
                            defaultValue={"RM " + parseFloat(maklumat_transaksi.rtpwr_amount).toFixed(2)}
                            disabled={true}
                            type={"number"}
                            pattern="^[0-9]" 
                            inputmode="numeric"
                            />
                        </div>
                        <div className='mb-6'>
                            <Textinput
                            label={"Tarikh Transaksi"}
                            defaultValue={maklumat_transaksi.rtpwr_transaction_date}
                            disabled={true}
                            />
                        </div>
                        <div className='mb-6'>
                            <Textinput
                            label={"No. Rujukan Transaksi"}
                            defaultValue={maklumat_transaksi.rtpwr_reference_number}
                            disabled={true}
                            />
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default MaklumatTransaksiPWR;