import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import { API } from '@/utils/api';
import { Spinner } from 'evergreen-ui';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import ExcelJS from 'exceljs';

SenaraiTransaksi.propTypes = {
    
};

function SenaraiTransaksi(props) {

    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading_table, set_loading_table]        = useState(true)
    const [list_transaction, set_list_transaction]  = useState([])

    const [currentPage, setCurrentPage]         = useState(1);
    const [rowsPerPage, setRowsPerPage]         = useState(10);

    const [totalRows, setTotalRows]             = useState(0) 
    const totalPages                            = Math.ceil(totalRows / rowsPerPage);

    const [total_data, set_total_data]          = useState(0)

    const [modal_excel, set_modal_excel]            = useState(false)

    const open_modal    = () => set_modal_excel(true)
    const close_modal   = () => set_modal_excel(false)

    const fetch__data = async () => {
        set_loading_table(true)
        let api = await API(`kariah/payment/list?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET", true)
        console.log("List",api)
        if(api.status_code === 200) {
            set_list_transaction(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
        }
        setTimeout(() => {
            set_loading_table(false)
        }, 1000);
    }

    const handleDataTableOnChange = async (page, limit) => {
        set_loading_table(true)
        let api = await API(`kariah/payment/list?page=${page}&limit=${limit}`, {}, "GET", true)
        if(api.status_code === 200) {
            set_list_transaction(api.data.row)
            setTotalRows(api.data.total)
            set_total_data(api.data.total)
        }
        setTimeout(() => {
            set_loading_table(false)
        }, 1000);
    }

    // const DownloadExcel = async () => {
    //     open_modal()

    //     let header  = Object.keys(list_transaction[0])
    //     let data    = list_transaction

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

    const GetStatusTextForExcel = (status) => {
        switch (status) {
            case 'Approve':
                return 'Berjaya';
            case 'Pending':
                return 'Dalam Proses';
            default:
                return 'Lain-Lain';
        }
    };

    const DownloadExcel = async () => {
        set_modal_excel(true)
    
        setTimeout(async () => {
            if (list_transaction.length === 0) {
                toast.error('Tiada data untuk dimuat turun.');
                set_modal_excel(false)
                return;
            }
            

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Senarai Transaksi Bayaran Khairat Kematian');
        
            worksheet.columns = [
                { header: 'Bil.', key: 'bil', width: 10 },
                { header: 'Nama Bil', key: 'bill_name', width: 35 },
                { header: 'No. Rujukan Bil', key: 'bill_id', width: 35 },
                { header: 'Jumlah (RM)', key: 'total', width: 20 },
                { header: 'Nama Kariah', key: 'Nama_ahli', width: 20 },
                { header: 'E-mel Kariah', key: 'emel_ahli', width: 25 },
                { header: 'No. Telefon Kariah', key: 'telefon_ahli', width: 20 },
                { header: 'Kaedah Bayaran', key: 'payment_method', width: 25 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Tarikh', key: 'date', width: 20 },
            ];
        
            list_transaction.forEach((item, index) => {
                worksheet.addRow({
                    bil: index + 1,
                    bill_name: item.bill_name,
                    bill_id: item.transaction_id,
                    total: item.payment_amount,
                    Nama_ahli: item.payor_name,
                    emel_ahli: item.payor_email,
                    telefon_ahli: item.payor_phone,
                    payment_method: item.payment_method,
                    status: GetStatusTextForExcel(item.payment_status),
                    date: moment(item.created_date).format("DD MMMM YYYY"),
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
            link.download = 'Senarai_Transaksi_Bayaran_Khairat_Kematian.xlsx';
            link.click();
            set_modal_excel(false)
        },1000);
        
    };

    useEffect(() => {
        fetch__data()
    }, [currentPage, rowsPerPage])

    const get_badge = (status) => {
        if(status === 'Approve') {
            return <Badge className='bg-emerald-600 text-white'>Berjaya</Badge>
        } 
        else if(status === 'Pending') {
            return <Badge className='bg-yellow-600 text-white'>Dalam Proses</Badge>
        } 
        else {
            return <Badge className='bg-gray-600 text-white'>Lain-lain</Badge>
        }
    }

    return (
        <div>
            <Modal
            title='Muatturun Maklumat Senarau Ahli Khairat Kematian'
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
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Transaksi Bayaran Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai transaksi bayaran keahlian yang dibuat oleh ahli kariah yang berdaftar di bawah institusi anda. Klik pada senarai di bawah untuk melihat maklumat lanjut.</p>  
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
                                                <p className='text-gray-500 text-sm'>Papar {list_transaction.length} per {total_data} rekod.</p>
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
                                                    { label: 5, value: 5},
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

                                        <table className='mt-6 min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                        <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                            <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Nama Bil</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Jumlah(RM)</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Nama Kariah</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>E-mel</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>No. Telefon</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Status</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh</td>
                                            <td width={'10%'} className='text-center p-3 font-semibold text-sm'>Tindakan</td>
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                list_transaction.length < 1 && (
                                                    <tr className='border border-gray-100 p-3'>
                                                        <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
                                                    </tr>
                                                )
                                            }

                                            {
                                                list_transaction.length > 0 && list_transaction.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                        <td width={'20%'} className='p-3 font-semibold text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.bill_name}</p>
                                                            <p className='font-semibold text-gray-900 underline'>{data.transaction_id}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.payment_amount}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.payor_name}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.payor_email}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{data.payor_phone}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{get_badge(data.payment_status)}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-normal text-gray-900'>{moment(data.created_date).format("DD MMM YYYY hh:mm A")}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                            <button onClick={() => navigate(`/transaksi/maklumat-bayaran/${data.transaction_id}`, { state: data })} className='py-3 px-2'>
                                                                <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-500 text-xl'} />
                                                            </button>
                                                        </td>
                                                        {/* <td width={'10%'} className='p-3 font-normal text-sm text-clip'>
                                                            <p className='font-semibold text-gray-900'>{data.email_address}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal text-sm text-center'>
                                                        <p className='font-normal text-gray-900'>{data.phone_number}</p>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-semibold text-sm text-center'>
                                                            {
                                                                data.gender === "Lelaki" ?
                                                                <Badge className='bg-blue-400 text-white w-[80px] justify-center'>{data.gender}</Badge> :
                                                                <Badge className='bg-pink-400 text-white w-[80px] justify-center'>{data.gender}</Badge>
                                                            }
                                                        </td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm text-center'>
                                                            <p className='font-normal text-gray-900'>{moment(data.register_date).format("DD MMMM YYYY")}</p>
                                                        </td>
                                                        <td width={'5%'} className='p-3 font-normal text-sm text-center'>
                                                            <Badge className='bg-yellow-600 text-white w-[80px] justify-center'>Belum Sah</Badge>
                                                        </td>
                                                        <td width={'10%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                            <button onClick={() => navigate("/kariah/maklumat-kariah", { state: data })} className='py-3 px-2'>
                                                                <Icons icon={'heroicons-outline:pencil-square'} className={'bg-white text-yellow-600 text-xl'} />
                                                            </button>
                                                        </td> */}
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

export default SenaraiTransaksi;