import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import { SENARAI__TRANSAKSI__KARIAH } from './data-senarai-transaksi';
import Card from '@/components/ui/Card';
import InputGroup from '@/components/ui/InputGroup';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import moment from 'moment';
import Modal from '@/components/ui/Modal';
import { API } from '@/utils/api';
import Loading from '@/components/Loading';
import { Spinner } from 'evergreen-ui';
import { toast } from 'react-toastify';
import ExcelJS from 'exceljs';



function SenaraiBayaranKhairatKematian(props) {

    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    const [loading, set_loading]                        = useState(false)
    const [senarai_transaksi, set_senarai_transaksi]    = useState([])

    const [currentPage, setCurrentPage]                 = useState(1);
    const [rowsPerPage, setRowsPerPage]                 = useState(5);

    const [totalRows, setTotalRows]                     = useState(0) 
    const totalPages                                    = Math.ceil(totalRows / rowsPerPage);

    const [modal_excel, set_modal_excel]                = useState(false)

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page whenever rows per page changes
    };

    const currentData = SENARAI__TRANSAKSI__KARIAH.slice(
        (currentPage - 1) * rowsPerPage, currentPage * rowsPerPage
    );

    const fetch__data = async () => {
        set_loading(true)
        let api = await API(`kariah/payout/list?page=${currentPage}&limit=${rowsPerPage}`, {}, "GET", true)
        if(api.status_code === 200) {
            set_senarai_transaksi(api.data.row)
            setTotalRows(api.data.total)
        }
        set_loading(false)
    }

    const handle_onChange = async (page, limit) => {
        set_loading(true)
        let api = await API(`kariah/payout/list?page=${page}&limit=${limit}`, {}, "GET", true)
        if(api.status_code === 200) {
            set_senarai_transaksi(api.data.row)
            setTotalRows(api.data.total)
        }
        set_loading(false)
    }

    useEffect(() => {
        fetch__data()
    }, [])


    const GetStatusTextForExcel = (status) => {
        switch (status) {
            case 'Success':
                return 'Berjaya';
            default:
                return 'Dalam Prosess';
        }
    };



    const DownloadExcel = async () => {
        set_modal_excel(true)
    
        setTimeout(async () => {
            if (senarai_transaksi.length === 0) {
                toast.error('Tiada data untuk dimuat turun.');
                set_modal_excel(false)
                return;
            }
            

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Senarai Rekod Bayaran Khairat Kematian');
        
            worksheet.columns = [
                { header: 'Bil', key: 'bil', width: 10 },
                { header: 'Keterangan Bayaran', key: 'desc', width: 30 },
                { header: 'Nama Ahli', key: 'Nama_ahli', width: 20 },
                { header: 'E-mel Ahli', key: 'emel_ahli', width: 20 },
                { header: 'No. Telefon Ahli', key: 'telefon_ahli', width: 20 },
                { header: 'Kaedah Bayaran', key: 'payment_method', width: 25 },
                { header: 'Jumlah (RM)', key: 'total', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Tarikh Bayar', key: 'date', width: 20 },
            ];
        
            senarai_transaksi.forEach((item, index) => {
                worksheet.addRow({
                    bil: index + 1,
                    desc: item.payout_name,
                    Nama_ahli: item.full_name,
                    emel_ahli: item.email_address,
                    telefon_ahli: item.phone_number,
                    payment_method: item.payout_method,
                    total: item.payout_amount,
                    status: GetStatusTextForExcel(item.payout_status),
                    date: moment(item.register_date).format("DD MMMM YYYY"),
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
            link.download = 'Senarai_Rekod_Bayaran_Khairat_Kematian.xlsx';
            link.click();
            set_modal_excel(false)
        },1000);
        
    };

    // if(loading) return <Loading />

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
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Rekod Bayaran Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai transaksi bayaran yang telah dibuat oleh ahli kariah anda. Klik pada senarai transaksi di bawah untuk melihat maklumat lanjut.</p>  
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
                                            <p className='text-gray-500 text-xs'>Papar {currentData.length} per {rowsPerPage} rekod.</p>
                                        </div>
                                        <div>
                                            <Pagination
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                handlePageChange={(e) => {
                                                    set_loading(true)
                                                    setCurrentPage(e)
                                                    handle_onChange(e, rowsPerPage)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Select 
                                            placeholder='-- Jumlah Rekod --'
                                            defaultValue={rowsPerPage}
                                            options={[
                                                { label: 2, value: 2},
                                                { label: 3, value: 3},
                                                { label: 5, value: 5},
                                                { label: 10, value: 10}
                                            ]}
                                            onChange={(e) => {
                                                set_loading(true)
                                                setRowsPerPage(e.target.value)
                                                handle_onChange(currentPage, e.target.value)
                                            }}
                                            />
                                        </div>
                                    </div>

                                    <div className='mt-3'>
                                        <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                                <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                                <td width={'30%'} className='p-3 font-semibold text-sm'>Keterangan Bayaran</td>
                                                <td width={'20%'} className='p-3 font-semibold text-sm'>Maklumat Ahli</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Kaedah Bayaran</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Jumlah (RM)</td>
                                                <td width={'5%'} className='p-3 font-semibold text-sm'>Status</td>
                                                <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh Bayar</td>
                                                <td width={'5%'} className='p-3 font-semibold text-sm text-center'>Tindakan</td>
                                            </thead>
                                            <tbody className='text-sm p-3'>
                                                {
                                                    senarai_transaksi.length < 1 && (
                                                        <tr className='border border-gray-100 p-3'>
                                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    senarai_transaksi.length > 0 && senarai_transaksi.map((data, index) => (
                                                        <tr key={index} className='border border-gray-100 p-3'>
                                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                                            <td width={'30%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.payout_name}</p>
                                                            </td>
                                                            <td width={'20%'} className='p-3 font-semibold text-sm text-clip'>
                                                                <p className='font-semibold text-gray-900'>{data.full_name}</p>
                                                                <p className='font-normal text-gray-900'>{data.email_address}</p>
                                                                <p className='font-normal text-gray-900'>{data.phone_number}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm'>
                                                                <p className='font-normal text-gray-900'>{data.payout_method}</p>
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm'>
                                                                <p className='font-normal text-gray-900'>{Number(data.payout_amount).toFixed(2)}</p>
                                                            </td>
                                                            <td width={'5%'} className='p-3 font-semibold text-sm'>
                                                                {
                                                                    data.payout_status === "Success" ?
                                                                    <Badge className='bg-emerald-600 text-white w-[80px] justify-center'>Berjaya</Badge> :
                                                                    <Badge className='bg-yellow-500 text-white w-[80px] justify-center'>Dalam Prosess</Badge>
                                                                }
                                                            </td>
                                                            <td width={'10%'} className='p-3 font-normal text-sm'>
                                                                <p className='font-normal text-gray-900'>{moment(data.payout_created_date).format("DD MMMM YYYY")}</p>
                                                            </td>
                                                            <td width={'5%'} className='p-3 font-normal flex w-full justify-center items-center'>
                                                                <button onClick={() => navigate("/khairat-kematian/maklumat-khairat-kematian", { state: data })} className='py-3 px-2'>
                                                                    <Icons icon={'heroicons:eye'} className={'bg-white text-blue-500 text-xl'} />
                                                                </button>
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

export default SenaraiBayaranKhairatKematian;