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
import Radio from '@/components/ui/Radio';
import Textinput from '@/components/ui/Textinput';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';


Pengeluaran.propTypes = {
    
};

function Pengeluaran(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading, set_loading]                        = useState(true)
    const [senarai_tabung, set_senarai_tabung]          = useState([])
    const [semua_tabung, set_semua_tabung]              = useState([])
    const [senarai_transaksi, set_senarai_transaksi]    = useState([])

    const [select_tabung_id, set_select_tabung_id]      = useState("")

    const [tabung_balance, set_tabung_balance]          = useState("")
    const [selectedAmountOption, setSelectedAmountOption] = useState("")

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(20);

    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]                  = useState(0)

    const [modal, set_modal]                            = useState(false)
    const open_modal                                    = () => set_modal(true)
    const close_modal                                   = () => set_modal(false)


    const GET__LIST__TABUNG = async () => {
        set_loading(true)
        let api = await API(`getTabungInstitusi`, {org_id: user.id}, "POST", true)
        console.log("Log Get Tabung Institusi  : ", api)
        let array = []
        if(api.status_code === 200) {
            set_semua_tabung(api.data.row)
            array.push({
                label: '-- Pilih Tabung --',
                value: null,
                balance: 0
            })
            for (let i = 0; i < api.data.row.length; i++) {
                if(api.data.row[i]["org_bank_acc_id"]){
                    array.push({
                        label: api.data.row[i]["tabung_name"] + " - (RM" + parseFloat(api.data.row[i]["tabung_balance"]).toFixed(2) + ")",
                        value: api.data.row[i]["tabung_id"],
                    })
                }
                // array.push({
                //     label: api.data[i]["tabung_name"] + " - (RM" + parseFloat(api.data[i]["tabung_balance"]).toFixed(2) + ")",
                //     value: api.data[i]["tabung_id"],
                // })
            }
            set_senarai_tabung(array)
        }
        setTimeout(() => {
            set_loading(false)
        }, 500);
    }

    const GET__LIST_WITHDRAWAL = async (tabung_id) => {
        set_loading(true)
        let api = await API(`getWithdrawalTabung`, {
            org_id: user.id, 
            tabung_id: tabung_id ?? select_tabung_id 
        }, "POST", true)
        console.log("Log Get Withdrawal List  : ", api)
        if(api.status === 200) {
            set_senarai_transaksi(api.data)
            setTotalRows(api.data.length)
        }
        set_loading(false)
    }

    const onChangeSelect = (tabungid) => {
        let filter = semua_tabung.filter(a => a.tabung_id == tabungid)

        set_tabung_balance(filter[0]["tabung_balance"])
        
        
    }

    useEffect(() => {
        GET__LIST__TABUNG()
    }, [])

    useEffect(() => {
        GET__LIST_WITHDRAWAL()
    }, [select_tabung_id])


    const GetStatus = (TransaksiStatus) => {
        if(TransaksiStatus === 83) {
            return <Badge className='bg-yellow-500 text-white justify-center'>Dalam Proses</Badge>
        }
        else if(TransaksiStatus === 81) {
            return <Badge className='bg-emerald-600 text-white justify-center'>Berjaya</Badge>
        }
        else  {
            return <Badge className='bg-red-500 text-white justify-center'>Gagal</Badge>
        }
    }

    if(loading) return <Loading />

    return (
        <div>
            <Modal
            title='Pengesahan Proses Pengeluaran'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-success-600 text-white' onClick={() => {
                        close_modal()
                        
                    }}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk meneruskan proses pengeluaran?</p>
            </Modal>


            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-3xl'}`}>Pengeluaran Kredit</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat kredit dan pengeluaran.</p>  
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                    <div>
                        <p className='font-semibold text-lg text-gray-600'>Peringatan!</p>
                    </div>
                    <div className='mt-3'>
                        <ul className=''>
                            <li className='text-sm text-gray-600'>1. Proses pembayaran akan dilakukan dalam tempoh 1 hari bekerja.</li>
                            <li className='text-sm text-gray-600'>2. Pengeluaran tidak boleh dibatalkan selepas permohonan pengeluaran dilakukan.</li>
                            <li className='text-sm text-gray-600'>3. Jika tabung yang anda ingin melakukan pengeluaran tiada dalam senarai, sila pastikan anda telah mengemaskini akaun bank bagi tabung tersebut terlebih dahulu.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-gray-900 text-xl'>Pemilihan Tabung</p>
                        <p className='font-normal text-gray-600 text-sm'>Sila pilih tabung yang ingin dikeluarkan.</p>
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
                                        onChangeSelect(e.target.value)
                                    }}
                                />
                                {/* <div className='mt-6'>
                                    {JSON.stringify(senarai_tabung)}
                                </div> */}
                                <div>
                                    <label htmlFor="" className='form-label'>Pengeluaran Kredit</label>
                                    <Radio 
                                        name="pengeluaran" 
                                        label={"Semua Amaun"} 
                                        value="semua"
                                        checked={selectedAmountOption === "semua"}
                                        onChange={() => {
                                            setSelectedAmountOption("semua")
                                        }} 
                                    />
                                    <div className='my-1'></div>
                                    <Radio 
                                        name="pengeluaran" 
                                        label={"Amaun Tertentu"} 
                                        value="tertntu"
                                        checked={selectedAmountOption === "tertntu"}
                                        onChange={() => {
                                            setSelectedAmountOption("tertntu")
                                        }} 
                                    />
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <div>
                                        <Textinput
                                            label={'Jumlah Pengeluaran (RM)'}
                                            placeholder={parseFloat(0).toFixed(2)} 
                                            defaultValue={selectedAmountOption === "semua" ? parseFloat(tabung_balance || 0).toFixed(2) : ""} 
                                            onChange={e => set_tabung_balance(e.target.value)}
                                            disabled={selectedAmountOption === "semua"}
                                            type={'number'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex flex-row items-center justify-end '>
                        <Button className='bg-teal-600 text-white' onClick={open_modal}>
                            Proses Pengeluaran
                        </Button>
                    </div>
                </Card>
            </section>

            <section className='mt-3'>
                <div>
                    <Card>
                        <div>
                            <p className='font-semibold text-gray-900 text-xl'>Senarai Pengeluaran</p>
                            <p className='font-normal text-gray-600 text-sm'>Senarai pengeluaran kredit institusi.</p>
                        </div>
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
                                    <div className='mt-6 flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-500 text-sm'>Papar {senarai_transaksi.length} per {total_data} rekod.</p>
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
                                                // { label: 10, value: 10},
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
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>No. Rujukan</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Amaun (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Caj Pengeluaran (RM)</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Amaun Bersih (RM)</td>
                                                <td width={'15%'} className='p-3 font-semibold text-sm'>Tarik Pengeluaran</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    senarai_transaksi.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai transaksi buat masa sementara waktu.</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    senarai_transaksi.length > 0 && senarai_transaksi.map((data, index) => index < rowsPerPage && (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.withdrawal_ref}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.withdrawal_amount}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.withdrawal_charges}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{data.withdrawal_nett}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{moment(data.withdrawal_date).format("DD MMM YYYY, hh:mm A")}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-normal text-gray-900'>{GetStatus(data.withdrawal_status)}</p>
                                                            </td>
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

export default Pengeluaran;