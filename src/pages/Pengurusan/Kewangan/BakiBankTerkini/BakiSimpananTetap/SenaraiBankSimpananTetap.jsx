import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Icons from '@/components/ui/Icon';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

SenaraiBankSimpananTetap.propTypes = {
    
};

function SenaraiBankSimpananTetap(props) {

    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                = useState(true)

    const [currentPage, setCurrentPage]         = useState(1);
    const [rowsPerPage, setRowsPerPage]         = useState(5);
    const [totalRows, setTotalRows]             = useState(0) 
    const totalPages                            = Math.ceil(totalRows / rowsPerPage);
    const [total_data, set_total_data]          = useState(0)

    const [list_bank, set_list_bank]            = useState([])
    const [root_data, set_root_data]            = useState([])

    const GET__LIST__BANK = async () => {
        set_loading(true)
        let api = await API(`kewangan/bank-simpanan-tetap/senarai-akaun?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET", true)
        console.log("Log Api Get List Bank Simpanan Tetap : ", api)

        if(api.status_code === 200) {
            set_list_bank(api.data.row)
            set_root_data(api.data.row)
            set_total_data(api.data.total)
        }

        set_loading(false)
    }

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(
                item => 
                    item.bbfd_account_bank_name.toLowerCase().indexOf(search_string.toLowerCase()) !== -1 ||
                    item.bbfd_account_holder_name.toLowerCase().indexOf(search_string.toLowerCase()) !== -1 ||
                    item.bbfd_account_number.toLowerCase().indexOf(search_string.toLowerCase()) !== -1
            )
            set_list_bank(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_list_bank(root_data)
        }
        
    }

    useEffect(() => {
        GET__LIST__BANK()
    }, [currentPage, rowsPerPage])

    //if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Akaun Bank Simpanan Tetap</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai maklumat akaun bank simpanan tetap yang telah anda daftar. Klik pada senarai di bawah untuk melihat keterangan akaun bank dengan lebih lanjut.</p>  
                    </div>
                    <div>
                        <Button className='bg-emerald-600 text-white' onClick={() => navigate("/kewangan/daftar-bank-simpanan-tetap")}>Tambah Bank Simpanan Tetap</Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <InputGroup
                        className='bg-gray-100 w-full md:w-[300px]'
                        type="text"
                        prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                        placeholder='Carian.....'
                        merged
                        onChange={e => SEARCH__DATA(e.target.value)}
                    />
                    <div className='mt-3'>
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
                            loading === false && (
                                <>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-gray-500 text-sm'>Papar {list_bank.length} per {total_data} rekod.</p>
                                        </div>
                                        <div>
                                            <Pagination
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                handlePageChange={(val) => {
                                                    setCurrentPage(val)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Select 
                                            placeholder='-- Jumlah Rekod --'
                                            defaultValue={rowsPerPage}
                                            options={[
                                                { label: 5, value: 5},
                                                { label: 10, value: 10},
                                                { label: 20, value: 20},
                                                { label: 50, value: 50},
                                                { label: 100, value: 100}
                                            ]}
                                            onChange={(e) => {
                                                setRowsPerPage(e.target.value)
                                            }}
                                            />
                                        </div>
                                    </div>
                                    <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                        <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                            <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Bank</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Pemegang Bank</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Nombor Akaun Bank</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Baki Semasa (RM)</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                            <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                list_bank.length < 1 && (
                                                    <tr className='border border-gray-100 p-3'>
                                                        <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai bank simpanan tetap buat masa sekarang.</td>
                                                    </tr>
                                                )
                                            }
                                            {
                                                list_bank.length > 0 && list_bank.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.bbfd_account_bank_name}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.bbfd_account_holder_name}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.bbfd_account_number}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{parseFloat(data.bbfd_balance_amount).toFixed(2)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>Aktif</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                            <button onClick={() => navigate(`/kewangan/maklumat-bank-simpanan-tetap`, { state: data })} className='py-3 px-2'>
                                                                <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-500 text-xl'} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </>
                            )
                        }
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default SenaraiBankSimpananTetap;