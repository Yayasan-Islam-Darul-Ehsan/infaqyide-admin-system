import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import { Spinner } from 'evergreen-ui';
import Icons from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';

MaklumatBankInstitusi.propTypes = {
    
};

function MaklumatBankInstitusi(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading, set_loading]                        = useState(true)
    
    const [opt_bank, set_opt_bank]                      = useState([])
    const [option_bank, set_option_bank]                = useState([])

    const [senarai_bank, set_senarai_bank]              = useState([])

    const GET__LIST__BANK = async () => {
        set_loading(true)
        let api = await API("getBankInstitusi", { org_id: user.user ? user.user.id : user.id })
        
        let array = []
        if(api.status === 200) {
            set_opt_bank(api.data)
            set_senarai_bank(api.data)
            if(api.data.length > 0) {
                for (let i = 0; i < api.data.length; i++) {
                    array.push({
                        label: api.data[i]["org_bank_acc_name"] + " - " + api.data[i]["org_bank_acc_number"],
                        value: api.data[i]["org_bank_acc_id"]
                    })
                }
            }
            set_option_bank(array)
        }

        set_loading(false)
    }

    const onChangeSelect = (bank_id) => {
        set_load_data(true)
        let filter = opt_bank.filter(a => a.org_bank_acc_id == bank_id)

        set_bank_name(filter[0]["org_bank_name"])
        set_bank_holder_name(filter[0]["org_acc_holder_name"])
        set_bank_account_no(filter[0]["org_bank_acc_number"])
        
        setTimeout(() => {
            set_load_data(false)
        }, 500);
    }

    useEffect(() => {
        GET__LIST__BANK()
    }, [])

    if(loading) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Perbankan Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai perbankan institusi anda.</p>  
                    </div>
                    <div>
                        <Button className='bg-teal-600 text-white' onClick={() => navigate("/perbankan/tambah-maklumat")}>Tambah Maklumat Perbankan</Button>
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
                            {/* <li className='text-sm text-gray-600'>1. Akaun Bank yang telah didaftarkan tidak boleh dikemaskini dan dibatalkan.</li> */}
                            <li className='text-sm text-gray-600'>1. Sila E-mel ke <strong>aljariyahapp@dagangtek.com</strong> untuk sebarang perubahan yang perlu dilakukan.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-lg text-gray-900'>Senarai Maklumat Akaun Bank</p>
                        <p className='font-normal text-sm text-gray-500'>Berikut adalah senarai maklumat akaun bank yang telah anda daftarkan.</p>
                    </div>
                    <div className='mt-6'>
                        <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                <td width={'30%'} className='p-3 font-semibold text-sm'>Nama Bank</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Pemegang Bank</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>No. Akaun Bank</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Bank</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                            </thead>
                            <tbody className='text-sm p-3'>
                                {
                                    senarai_bank.length == 0 && (
                                        <tr className='border border-gray-100 p-3'>
                                            <td colSpan={6} className='p-3 text-center'>Anda tidak mempunyai senarai akaun bank buat masa sekarang.</td>
                                        </tr>
                                    )
                                }
                                {
                                    senarai_bank.length > 0 && senarai_bank.map((data, index) => (
                                        <tr key={index} className='border border-gray-100 p-3'>
                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                            <td width={'20%'} className='p-3 font-normal text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{data.org_bank_acc_name}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{data.org_acc_holder_name ?? '-- tiada maklumat --'}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{data.org_bank_acc_number ?? '-- tiada maklumat --'}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{data.org_bank_name ?? '-- tiada maklumat --'}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>
                                                    <Badge className='bg-teal-600 text-white'>{data.org_bank_acc_status === 1 ? 'Aktif' : 'Tidak Aktif'}</Badge>
                                                </p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                <Button className='text-lg text-yellow-500' onClick={() => navigate("/perbankan/kemaskini-maklumat", { state: data })}>
                                                    <Icons icon={"heroicons:pencil-square"} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default MaklumatBankInstitusi;