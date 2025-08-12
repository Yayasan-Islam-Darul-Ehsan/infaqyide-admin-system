import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Spinner } from 'evergreen-ui';
import { API } from '@/utils/api';
import InputGroup from '@/components/ui/InputGroup';
import Icons from '@/components/ui/Icon';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Badge from '@/components/ui/Badge';

SenaraiKempen.propTypes = {
    
};

function SenaraiKempen(props) {

    let base_url = process.env.NODE_ENV === "production" ? "https://al-jariyah.com/institusi/" : "https://demo.al-jariyah.com/institusi/"

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    const [loading, set_loading]                        = useState(true)
    const [list_data, set_list_data]                    = useState([])
    const [root_data, set_root_data]                    = useState([])

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(10);
    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(list_data.length / rowsPerPage);
    const [total_data, set_total_data]                  = useState(0)

    const GET__LIST__DATA = async () => {
        set_loading(true)
        let api = await API(`getKempen?orgId=${user.user ? user.user.id : user.id}`, {}, "GET")
        console.log("Log Api Get List Kempen : ", api)

        if(api.status === 200) {
            set_list_data(api.data)
            set_root_data(api.data)
            setTotalRows(api.data.length)
        }

        set_loading(false)
    }

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.campaignTitle.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_list_data(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_list_data(root_data)
        }
        
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 2, // Ensures two decimal places
        }).format(value);
    }

    useEffect(() => {
        GET__LIST__DATA()
    }, [])

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Senarai Kempen Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai senarai kempen institusi anda.</p>  
                    </div>
                    <div>
                        <Button className='bg-teal-600 text-white' onClick={() => navigate("/kempen/tambah-kempen")}>Tambah Kempen Institusi</Button>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    {
                        loading && (
                            <>
                            <div className='flex justify-center items-center'>
                                <Spinner size={24} width={24} />
                            </div>
                            </>
                        )
                    }

                    {
                        !loading && (
                            <>
                                <InputGroup
                                    className='bg-gray-100 w-full md:w-[300px]'
                                    type="text"
                                    prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                                    placeholder='Carian.....'
                                    merged
                                    onChange={(e) => SEARCH__DATA(e.target.value)}
                                />
                                <div className='mt-3'>
                                    {
                                        loading === false && (
                                            <>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <p className='text-gray-500 text-sm'>Papar {list_data.length} per {total_data} rekod.</p>
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
                                                        <td width={'30%'} className='p-3 font-semibold text-sm'>Nama Kempen</td>
                                                        <td width={'15%'} className='p-3 font-semibold text-sm'>Sasaran Kempen (RM)</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Mula</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Tamat</td>
                                                        <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Status</td>
                                                        <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                                    </thead>
                                                    <tbody className='text-sm p-3'>
                                                        {
                                                            list_data.length < 1 && (
                                                                <tr className='border border-gray-100 p-3'>
                                                                    <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai kempen buat masa sekarang.</td>
                                                                </tr>
                                                            )
                                                        }
                                                        {
                                                            list_data.length > 0 && list_data.map((data, index) => (
                                                                <tr key={index} className='border border-gray-100 p-3'>
                                                                    <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                                    <td width={'30%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-semibold text-gray-900 text-md'>{data.campaignTitle}</p>
                                                                        <a 
                                                                            className='font-medium text-gray-900 underline' 
                                                                            target='blank'
                                                                            href={`${base_url}kempen?orgCode=${data.organizationCode}&campaignId=${data.campaignId}`}
                                                                        >
                                                                            {base_url}kempen?orgCode={data.organizationCode}&campaignId={data.campaignId}
                                                                        </a>
                                                                    </td>
                                                                    <td width={'15%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{parseFloat(data.campaignTarget).toFixed(2)}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{moment(data.campaignCreatedDate).format("DD MMM YYYY")}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                                        <p className='font-normal text-gray-900'>{moment(data.campaignDeadline).format("DD MMM YYYY")}</p>
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-sm text-center'>
                                                                        {
                                                                            data.campaignStatus === "ACTIVE" && <Badge className='bg-teal-600 text-white'>Kempen Aktif</Badge>
                                                                        }
                                                                        {
                                                                            data.campaignStatus === "PENDING" && <Badge className='bg-yellow-500 text-white'>Dalam Proses</Badge>
                                                                        }
                                                                        {
                                                                            data.campaignStatus === "INACTIVE" && <Badge className='bg-red-600 text-white'>Tidak Aktif</Badge>
                                                                        }
                                                                        {
                                                                            data.campaignStatus === "REJECTED" && <Badge className='bg-red-600 text-white'>Pengesahan Ditolak</Badge>
                                                                        }
                                                                    </td>
                                                                    <td width={'10%'} className='p-3 font-normal text-center'>
                                                                        <Button className='text-lg text-yellow-500' onClick={() => navigate("/kempen/maklumat-kempen", { state: data })}>
                                                                            <Icons icon={"heroicons:pencil-square"} />
                                                                        </Button>
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
                            </>
                        )
                    }
                </Card>
            </section>
        </div>
    );
}

export default SenaraiKempen;