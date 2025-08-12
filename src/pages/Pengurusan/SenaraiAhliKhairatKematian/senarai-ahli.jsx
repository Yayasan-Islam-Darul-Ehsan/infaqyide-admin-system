import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import { API } from '@/utils/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import { Spinner } from 'evergreen-ui';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import moment from 'moment';
import Modal from '@/components/ui/Modal';
import ExcelJS from 'exceljs';

SenaraiAhliKhairatKematian.propTypes = {
    
};

function SenaraiAhliKhairatKematian(props) {

    const navigate                                  = useNavigate()
    const { width, breakpoints }                    = useWidth()

    const [loading_table, set_loading_table]        = useState(true)
    const [senarai_ahli, set_senarai_ahli]          = useState([])

    const [currentPage, setCurrentPage]             = useState(1);
    const [rowsPerPage, setRowsPerPage]             = useState(10);

    const [totalRows, setTotalRows]                 = useState(0) 
    const totalPages                                = Math.ceil(totalRows / rowsPerPage);

    const [total_data, set_total_data]              = useState(0)

    const [modal_excel, set_modal_excel]            = useState(false)

    const open_modal    = () => set_modal_excel(true)
    const close_modal   = () => set_modal_excel(false)

    const fetch__ahli = async (offset, limit) => {
        set_loading_table(true)
        let api = await API(`kariah/ahli-khairat/list?page=${offset}&limit=${limit}`, {}, "GET", true)
        console.log("Senarai Khairat:",api)
        if(api.status_code === 200) {
            set_senarai_ahli(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
        }
        set_loading_table(false)
    }

    // const DownloadExcel = async () => {
    //     open_modal()

    //     let header  = Object.keys(senarai_ahli[0])
    //     let data    = senarai_ahli

    //     let myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     let api = await fetch("https://cp-api-demo.al-jariyah.com/admin/generate-excel", { 
    //         method: "post", 
    //         headers: myHeaders, 
    //         redirect: 'follow', 
    //         body: JSON.stringify({
    //             header: header,
    //             data: data
    //         })
    //     }).then(res => res.json())

    //     console.log("Log Download Excel : ", api)

    //     close_modal()

    //     if(api.status_code === 200) {
    //         window.open(api.data, "blank")
    //     }
    // }

    const DownloadExcel = async () => {
        open_modal(); 
    
        setTimeout(async () => {
            if (senarai_ahli.length === 0) {
                toast.error('Tiada data untuk dimuat turun.');
                close_modal(); 
                return;
            }

            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Senarai Ahli Khairat');
    
            worksheet.columns = [
                { header: 'Bil', key: 'bil', width: 10 },
                { header: 'Nama Kariah', key: 'nama', width: 30 },
                { header: 'No. Kad Pengenalan', key: 'ic_number', width: 20 },
                { header: 'E-mel', key: 'email', width: 25 },
                { header: 'No. Telefon', key: 'phone_number', width: 20 },
                { header: 'Jantina', key: 'gender', width: 15 },
                { header: 'Alamat', key: 'address', width: 40 },
                { header: 'Jenis Keahlian', key: 'type', width: 15 },
                { header: 'Tarikh Sah Tempoh', key: 'date', width: 35 },
                { header: 'Status Keahlian', key: 'status', width: 20 },
            ];
    
            senarai_ahli.forEach((item, index) => {
                worksheet.addRow({
                    bil: index + 1,
                    nama: item.full_name,
                    ic_number: item.ic_number,
                    email: item.email_address,
                    phone_number: item.phone_number,
                    gender: item.gender,
                    address: item.home_address,
                    type: `Keahlian ${item.subscription_type}`,
                    date: `${moment(item.start_date).format("DD MMMM YYYY")} - ${moment(item.end_date).format("DD MMMM YYYY")}`,
                    status: GetStatusTextForExcel(item.status),
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
            link.download = 'Senarai_Ahli_Khairat_Kematian.xlsx';
            link.click();
    
            close_modal();
        }, 1000);
    };
    
    

    const GetStatusTextForExcel = (status) => {
        switch (status) {
            case 'Active':
                return 'Aktif';
            case 'Pending':
                return 'Dalam Proses';
            case 'Expired':
                return 'Tamat Tempoh';
            default:
                return 'Lain-lain';
        }
    };

    useEffect(() => {
        fetch__ahli(currentPage, rowsPerPage)
    }, [currentPage, rowsPerPage])
    

    const get_badge = (status) => {
        if(status === 'Active') {
            return <Badge className='bg-emerald-600 text-white'>Aktif</Badge>
        } 
        else if(status === 'Pending') {
            return <Badge className='bg-yellow-600 text-white'>Dalam Proses</Badge>
        } 
        else if(status === 'Expired') {
            return <Badge className='bg-red-600 text-white'>Tamat Tempoh</Badge>
        } 
        else {
            return <Badge className='bg-gray-600 text-white'>Lain-lain</Badge>
        }
    }

    return (
        <div>
            <Modal
            title='Muat Turun Maklumat Senarai Ahli Khairat Kematian'
            activeModal={modal_excel}
            onClose={close_modal}
            centered={true}
            >
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Ahli Berdaftar Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai ahli khairat kematian yang telah berdaftar di bawah institusi kariah anda. Klik pada senarai di bawah untuk melihat maklumat lebih lanjut.</p>  
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
                        />
                    </Card>
                </div>
            </section> 
            <section className='mt-3'>
                <div>
                    <Card>
                        <div className='mt-3'>
                            {
                                loading_table && (
                                    <>
                                    <div className='flex flex-col justify-center items-center'>
                                        <Spinner />
                                    </div>
                                    </>
                                )
                            }
                            {
                                loading_table === false && (
                                    <>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-gray-500 text-sm'>Papar {senarai_ahli.length} per {total_data} rekod.</p>
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
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Ahli</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>No. Kad Pengenalan</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>E-mel</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>No. Telefon</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Jantina</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Jenis Keahlian</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm text-center'>Tarikh Sah Tempoh</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm text-center'>Status Keahlian</td>
                                            <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                senarai_ahli.length < 1 && (
                                                    <tr className='border border-gray-100 p-3'>
                                                        <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai senarai ahli khairat kematian yang berdaftar buat sementara waktu.</td>
                                                    </tr>
                                                )
                                            }

                                            {
                                                senarai_ahli.length > 0 && senarai_ahli.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.full_name}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.ic_number}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.email_address}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.phone_number}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.gender}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>Keahlian {data.subscription_type}</p>
                                                        </td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm text-clip text-center'>
                                                            <p className='font-normal text-gray-900'>{moment(data.start_date).format("DD MMM YYYY")} - {moment(data.end_date).format("DD MMM YYYY")}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip text-center'>
                                                            <p className='font-normal text-gray-900'>{get_badge(data.status)}</p>
                                                        </td>

                                                        <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                            <button onClick={() => navigate(`/ahli-khairat/detail?a=${btoa(data.member_id)}`, { state: data })} className='py-3 px-2'>
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
                </div>
            </section>
        </div>
    );
}

export default SenaraiAhliKhairatKematian;