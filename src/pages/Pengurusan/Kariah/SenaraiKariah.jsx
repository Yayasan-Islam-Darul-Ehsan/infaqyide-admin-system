import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import { SENARAI__KARIAH__MASJID } from './data-senarai-kariah';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Spinner } from 'evergreen-ui';
import ExcelJS from 'exceljs';

SenaraiKariah.propTypes = {
    
};

function SenaraiKariah(props) {

    const { user }                              = useSelector(user => user.auth)
    const navigate                              = useNavigate()
    const { width, breakpoints }                = useWidth()

    const [loading, set_loading]                = useState(false)
    const [senarai_kariah, set_senarai_kariah]  = useState([])
    const [root_data, set_root_data]            = useState([])

    const [currentPage, setCurrentPage]         = useState(1);
    const [rowsPerPage, setRowsPerPage]         = useState(5);

    const [totalRows, setTotalRows]             = useState(0) 
    const totalPages                            = Math.ceil(totalRows / rowsPerPage);


    const [modal_excel, set_modal_excel]        = useState(false)

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page whenever rows per page changes
    };

    const currentData = SENARAI__KARIAH__MASJID.slice(
        (currentPage - 1) * rowsPerPage, currentPage * rowsPerPage
    );

    const SEARCH__DATA = (search_string = "") => {

        if(root_data.length > 0) {

            let filtered_data = root_data.filter(item => item.full_name.toLowerCase().indexOf(search_string.toLowerCase()) !== -1)
            set_senarai_kariah(filtered_data)
        }

        if(search_string == "" || search_string == null) {
            set_senarai_kariah(root_data)
        }
        
    }

    const fetch__data = async () => {
        set_loading(true)
        let api = await API(`kariah/ahli/senarai-ahli?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET", true)
        if(api.status_code === 200) {
            set_senarai_kariah(api.data.row)
            set_root_data(api.data.row)
            setTotalRows(api.data.total)
        }
        set_loading(false)
    }

    const handleDataTableOnChange = async (page, limit) => {
        set_loading(true)
        let api = await API(`kariah/ahli/senarai-ahli?page=${page}&limit=${limit}`, {}, "GET", true)
        if(api.status_code === 200) {
            set_senarai_kariah(api.data.row)
            setTotalRows(api.data.total)
        }
        set_loading(false)
    }

    useEffect(() => {
        fetch__data()
    }, [])

    if(loading) return <Loading />

    const GetStatus = (status) => {
        if(status === 'Pending') {
            return <Badge className='bg-yellow-500 text-white justify-center'>Dalam Semakan</Badge>
        }
        else if(status === 'Verified') {
            return <Badge className='bg-emerald-600 text-white justify-center'>Aktif</Badge>
        }
        else if(status === 'Suspended') {
            return <Badge className='bg-red-500 text-white justify-center'>Akaun Dibeku</Badge>
        }
        else if(status === 'Reject') {
            return <Badge className='bg-red-500 text-white justify-center'>Permohonan Ditolak</Badge>
        }
        else if(status === 'Deceased') {
            return <Badge className='bg-gray-600 text-white justify-center'>Meninggal Dunia</Badge>
        }
        else if(status === 'Others') {
            return <Badge className='bg-primary-600 text-white justify-center'>Lain-lain</Badge>
        }
    }

    // const DownloadExcel = async () => {

    //     set_modal_excel(true)

    //     let api = await API("excel-ahli-kariah", { org_id: user.id })

    //     if(api.status_code !== 200) {
    //         toast.error(api.message)
    //     }
    //     else {
    //         window.open(api.data)
    //     }

    //     set_modal_excel(false)
    // }

    const DownloadExcel = async () => {
        set_modal_excel(true)
    
        setTimeout(async () => {
            if (senarai_kariah.length === 0) {
                toast.error('Tiada data untuk dimuat turun.');
                set_modal_excel(false)
                return;
            }

            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Senarai Ahli Kariah');
        
            worksheet.columns = [
                { header: 'Bil', key: 'bil', width: 10 },
                { header: 'Nama Kariah', key: 'nama', width: 30 },
                { header: 'No. Kad Pengenalan', key: 'ic_number', width: 20 },
                { header: 'E-mel', key: 'email', width: 25 },
                { header: 'No. Telefon', key: 'phone_number', width: 20 },
                { header: 'Jantina', key: 'gender', width: 15 },
                { header: 'Alamat', key: 'address', width: 40 },
                { header: 'Tarikh Daftar', key: 'register_date', width: 20 },
                { header: 'Status Kariah', key: 'status', width: 20 },
            ];
        
            senarai_kariah.forEach((item, index) => {
                worksheet.addRow({
                    bil: index + 1,
                    nama: item.full_name,
                    ic_number: item.ic_number,
                    email: item.email_address,
                    phone_number: item.phone_number,
                    gender: item.gender,
                    address: item.home_address,
                    register_date: moment(item.register_date).format("DD MMMM YYYY"),
                    status: GetStatusTextForExcel(item.is_verified),
                });
            });
        
            worksheet.eachRow((row, rowNumber) => {
                row.font = { size: 10 }; 
                row.alignment = { horizontal: 'center' };
            });
        
            worksheet.getRow(1).font = { bold: true, size: 12 };
        
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Senarai_Ahli_Kariah.xlsx';
            link.click();

            set_modal_excel(false)
        },1000);
        
    };

    const GetStatusTextForExcel = (status) => {
        switch (status) {
            case 'Pending':
                return 'Dalam Semakan';
            case 'Verified':
                return 'Ahli Kariah Aktif';
            case 'Suspended':
                return 'Akaun Dibeku';
            case 'Reject':
                return 'Permohonan Ditolak';
            case 'Deceased':
                return 'Meninggal Dunia';
            case 'Others':
                return 'Lain-lain';
            default:
                return 'Tidak Diketahui';
        }
    };
    

    return (
        <div>

            <Modal
            title='Maklumat Sedang Diproses'
            activeModal={modal_excel}
            onClose={() => set_modal_excel(false)}
            centered={true}
            >   
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Ahli Kariah Berdaftar</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai ahli kariah yang berdaftar di bawah institusi anda. Klik pada senarai kariah di bawah untuk melihat maklumat lanjut.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button onClick={DownloadExcel} className='bg-teal-600 text-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        {/* <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button> */}
                    </div>
                </div>
            </section>  

            <section className='mt-6'>
                <div className=''>
                    <Card className='flex'>
                        <InputGroup 
                        className='bg-gray-100 w-full md:w-[300px]'
                        type="text"
                        prepend={<div className='flex items-center justify-center'><Icons icon={'heroicons:magnifying-glass'} className={'mr-3'} /></div>}
                        placeholder='Carian.....'
                        merged
                        onChange={e => SEARCH__DATA(e.target.value)}
                        />
                    </Card>
                </div>
            </section>

            <section className='mt-3'>
                <div>
                    <Card>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-500 text-xs'>Papar {currentData.length} per {rowsPerPage} rekod.</p>
                            </div>
                            <div>
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={(e) => {
                                        setCurrentPage(e.target.value)
                                        handleDataTableOnChange(e.target.value, rowsPerPage)
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
                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Kariah</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm'>E-mel</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm'>No. Telefon</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm '>Jantina</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Daftar</td>
                                    <td width={'5%'} className='p-3 font-semibold text-sm'>Status</td>
                                    <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Tindakan</td>
                                </thead>
                                <tbody className='text-sm p-3'>
                                    {
                                        senarai_kariah.length < 1 && (
                                            <tr className='border border-gray-100 p-3'>
                                                <td colSpan={8} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
                                            </tr>
                                        )
                                    }

                                    {
                                        senarai_kariah.length > 0 && senarai_kariah.map((data, index) => (
                                            <tr key={index} className='border border-gray-100 p-3'>
                                                <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                    <p className='font-semibold text-gray-900'>{data.full_name}</p>
                                                    <p className='font-normal text-gray-900'>{data.ic_number}</p>
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                    <p className='font-semibold text-gray-900'>{data.email_address}</p>
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal text-sm'>
                                                    <p className='font-normal text-gray-900'>{data.phone_number}</p>
                                                </td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>
                                                    {
                                                        data.gender === "Lelaki" ?
                                                        <Badge className='bg-blue-400 text-white w-[80px] justify-center'>{data.gender}</Badge> :
                                                        <Badge className='bg-pink-400 text-white w-[80px] justify-center'>{data.gender}</Badge>
                                                    }
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal text-sm'>
                                                    <p className='font-normal text-gray-900'>{moment(data.register_date).format("DD MMM YYYY")}</p>
                                                </td>
                                                <td width={'5%'} className='p-3 font-normal text-sm'>
                                                    {GetStatus(data.is_verified)}
                                                </td>
                                                <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                    <button onClick={() => navigate("/kariah/maklumat-kariah", { state: data })} className='py-3 px-2'>
                                                        <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-600 text-xl'} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </section>


        </div>
    );
}

export default SenaraiKariah;