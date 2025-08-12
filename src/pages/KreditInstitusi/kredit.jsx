import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useWidth from '@/hooks/useWidth';
import Loading from '@/components/Loading';
import { API } from '@/utils/api';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Textinput from '@/components/ui/Textinput';


Kredit.propTypes = {
    
};

function Kredit(props) {

    const { user }                                                            = useSelector(user => user.auth)
    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading, set_loading]                                              = useState(true)
    const [senarai_tabung, set_senarai_tabung]                                = useState("")
    const [senarai_transaksi_tabung, set_senarai_transaksi_tabung]            = useState([])

    const [select_tabung_id, set_select_tabung_id]                            = useState(null)

    const [total_verified, set_total_kredit] 		                          = useState(0)
	const [total_pending, set_total_kredit_float] 	                          = useState(0)

    const [bank_name, set_bank_name] 	                                      = useState("")
    const [bank_no, set_bank_no] 	                                          = useState("")
    const [bank_holder, set_bank_holder] 	                                  = useState("")

    const [currentPage, setCurrentPage]                                       = useState(1);
    const [rowsPerPage, setRowsPerPage]                                       = useState(10);

    const [totalRows, setTotalRows]                                           = useState(10) 
    const totalPages                                                          = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                                        = useState(0)


    const GET__LIST__TABUNG = async () => {
        set_loading(true)
        let api = await API(`getTabungInstitusi`, {org_id: user.id}, "POST", true)
        console.log("Log Get Tabung Institusi  : ", api)
        let array = []
        if(api.status_code === 200) {
            array.push({
                // label: api.data[0]["tabung_name"],
                // value: api.data[0]["tabung_id"]
                label: '-- Pilih Tabung --',
                value: null
                
            })
            for (let i = 0; i < api.data.row.length; i++) {
                array.push({
                    label: api.data.row[i]["tabung_name"],
                    value: api.data.row[i]["tabung_id"]
                })

            }
            set_senarai_tabung(array)

            // if(array.length > 0) {
            //     GET__TABUNG__DETAIL(array[0]["tabung_id"])
            // }
        }

        set_loading(false)
    }

    const GET__TABUNG__DETAIL = async (tabung_id) => {
        set_loading(true)
        let api = await API(`getKreditInstitusiDetails`, {org_id: user.id, tabung_id: tabung_id ?? select_tabung_id}, "POST", true)
        console.log("Log Get Senarai Transaksi Tabung Kredit  : ", api)
        if(api.status === 200) {

            set_senarai_transaksi_tabung(api.data)
            setTotalRows(api.data.length)

            let data2 = api.data2[0]
            set_total_kredit(data2.baki_kredit)
			set_total_kredit_float(data2.baki_kredit_float)
            set_bank_name(data2.acc_bank)
            set_bank_no(data2.no_acc_credit)
            set_bank_holder(data2.nama_pemegang_acc)
        }
        set_loading(false)
    }

    useEffect(() => {
        GET__LIST__TABUNG()
    }, [])

    useEffect(() => {
        GET__TABUNG__DETAIL()
    }, [select_tabung_id])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 2, // Ensures two decimal places
        }).format(value);
    }

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Kredit Tabung</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah paparan kredit institusi dan transaksi kredit institusi.</p>  
                    </div>
                </div>
            </section>  

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Pemilihan Tabung</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila pilih paparan perincian tabung yang ingin dipaparkan.</p>
                    </div>
                    <div className='mt-6'>
                        <div className='grid grid-cols-1 gap-3'>
                            <div className='grid grid-cols-1 md:grid-cols-1 gap-3'>
                                <Select 
                                    label={'Tabung'}
                                    placeholder='-- Sila Pilih Tabung  --'
                                    defaultValue={select_tabung_id}
                                    options={senarai_tabung}
                                    onChange={e => {
                                        set_select_tabung_id(e.target.value)
                                    }}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
                                    <Card>
                                        <div><p className="font-medium text-sm text-gray-600">Baki Kredit</p></div>
                                        <div className="mt-3"><p className="font-regular text-teal-500 text-2xl">RM {parseFloat(total_verified).toFixed(2)}</p></div>
                                    </Card>
                                            
                                    <Card>
                                        <div><p className="font-medium text-sm text-gray-600">Baki Kredit Float</p></div>
                                        <div className="mt-3"><p className="font-regular text-purple-800 text-2xl">RM {parseFloat(total_pending).toFixed(2)}</p></div>
                                    </Card>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    
                </Card>
                
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-lg'>Akaun Bank Tabung</p>
                        <p className='font-normal text-gray-600 text-sm'>Paparan maklumat tabung kredit institusi.</p>
                    </div>

                    <div className='mt-3'>
                        <div>
                            <Textinput 
                                label={"Nama Bank"}
                                placeholder=''
                                defaultValue={bank_name}
                                disabled={true}
                            />
                            </div>
                            <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <Textinput 
                                label={"No Akaun"}
                                placeholder=''
                                defaultValue={bank_no}
                                disabled={true}
                            />
                            <Textinput 
                                label={"Nama Pemegang Akaun Bank"}
                                placeholder=''
                                defaultValue={bank_holder}
                                disabled={true}
                            />
                        </div>
                    </div>
                </Card>
                
            </section>

            <section className='mt-3'>
                <div>
                    <Card>
                        {
                            loading && (
                                <>
                                <div className='flex flex-col justify-center items-center'>
                                    <Spinner />
                                </div>
                                </>
                            )
                        }

                        {
                            !loading && (
                                <>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-500 text-sm'>Papar {senarai_transaksi_tabung.length} per {total_data} rekod.</p>
                                        </div>
                                        <div>
                                            <Pagination
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                handlePageChange={(val) => {
                                                    setCurrentPage(val)
                                                    handleDataTableOnChange(val, rowsPerPage)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Select 
                                            placeholder='-- Jumlah Rekod --'
                                            defaultValue={rowsPerPage}
                                            options={[
                                                { label: 10, value: 10},
                                                { label: 20, value: 20},
                                                { label: 50, value: 50},
                                                { label: 100, value: 100}
                                            ]}
                                            onChange={(e) => {
                                                setRowsPerPage(e.target.value)
                                                handleDataTableOnChange(currentPage, e.target.value)
                                            }}
                                            />
                                        </div>
                                    </div>

                                    <div className='mt-3'>
                                        <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Rujukan</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis Bayaran</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Amaun (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Caj Amaun (RM)</td>
                                                <td width={'15%'} className='p-3 font-semibold text-sm'>Kepada Anda (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh</td>
                                                {/* <td width={'10%'} className='p-3 font-semibold text-sm'>Tindakan</td> */}
                                                
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    senarai_transaksi_tabung.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai transaksi buat masa sementara waktu.</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    senarai_transaksi_tabung.length > 0 && senarai_transaksi_tabung.map((data, index) => index < rowsPerPage && (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.invoice_no}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.billpayment_billname}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{formatCurrency(data.trans_amount)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{formatCurrency(data.trans_charge)}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{formatCurrency(data.trans_amount_nett)}</p>
                                                            </td>
                                                            <td width={'15%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{moment(data.trans_date).format("DD MMM YYYY, hh:mm A")}</p>
                                                            </td>
                                                            {/* <td width={'10%'} className='p-3 font-normal flex'>
                                                                <button onClick={() => navigate(`/institusi/transaksi-institusi/maklumat-transaksi/${data.bill_invoice_no}`, { state: data })} className='py-3 px-2'>
                                                                    <Icons icon={'heroicons:eye'} className={'bg-white text-blue-500 text-xl'} />
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>       
                                </>
                            )
                        }
                    </Card>
                </div>
            </section>

            

            
        </div>
    );
}

export default Kredit;