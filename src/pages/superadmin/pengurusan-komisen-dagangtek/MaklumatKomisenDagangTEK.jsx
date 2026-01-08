import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Loading from '@/components/Loading';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { SYSADMIN_API } from '@/utils/api';

function MaklumatKomisenDagangTEK() {

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState(null);
    
    // Get year and month from location state or URL params
    const searchParams = new URLSearchParams(location.search);
    const year = location.state?.year || searchParams.get('year') || new Date().getFullYear();
    const month = location.state?.month || searchParams.get('month') || new Date().getMonth() + 1;
    const monthName = location.state?.monthName || '';
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Helper function to get month name
    const getMonthName = (monthNumber) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNumber - 1] || "";
    };

    // Helper function to format status
    const getStatusBadge = (status) => {
        if (status === 1) {
            return <Badge label="Berjaya" className="bg-success-600 text-white" />;
        } else if (status === 0) {
            return <Badge label="Diproses" className="bg-warning-500 text-black-500" />;
        } else {
            return <Badge label="Gagal" className="bg-red-600 text-white" />;
        }
    };

    // Fetch transaction data
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let apiUrl = `dagangtek/transactions?year=${year}&month=${month}&page=${currentPage}&limit=${rowsPerPage}`;
            let api = await SYSADMIN_API(apiUrl, {}, "GET", true);
            console.log("Log Api Get Transactions : ", api);
            
            if (api.status_code === 200) {
                setData(api.data || []);
                setSummary(api.summary || null);
                setTotalRows(api.totalData || 0);
                setTotalPages(api.totalPage || 1);
            } else {
                toast.error(api.message || "Gagal mendapatkan data transaksi.");
                setData([]);
                setSummary(null);
                setTotalRows(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Harap maaf! Terdapat masalah untuk mendapatkan data.");
            setData([]);
            setSummary(null);
            setTotalRows(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Export to PDF function
    const exportToPDF = async () => {
        try {
            toast.info("Sedang menjana PDF...");
            
            // Get the base URL based on environment
            const getBaseUrl = () => {
                if (process.env.NODE_ENV === "development") {
                    return "http://localhost:40000/sysadmin/";
                } else if (process.env.NODE_ENV === "staging") {
                    return "https://admin-stg.infaqyide.com.my/sysadmin/";
                } else if (process.env.NODE_ENV === "production") {
                    return "https://admin.infaqyide.com.my/sysadmin/";
                } else {
                    return "http://localhost:40000/sysadmin/";
                }
            };

            const token = sessionStorage.getItem("token");
            const baseUrl = getBaseUrl();
            const url = `${baseUrl}dagangtek/export-pdf?year=${year}&month=${month}`;

            // Fetch PDF as blob
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'token': token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download PDF');
            }

            // Get the blob from response
            const blob = await response.blob();

            // Create a link element and trigger download
            const downloadUrl   = window.URL.createObjectURL(blob);
            const link          = document.createElement('a');
            link.href           = downloadUrl;
            link.download = `Komisen_DagangTEK_${year}_${getMonthName(month)}_${moment().format('YYYYMMDDHHmmss')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("PDF berjaya dimuat turun!");
        } catch (error) {
            console.error("Error exporting to PDF:", error);
            toast.error("Gagal memuat turun PDF. Sila cuba lagi.");
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Fetch data on mount and when pagination changes
    useEffect(() => {
        fetchTransactions();
    }, [currentPage, rowsPerPage]);

    if (loading) return <Loading />;

    return (
        <div>
            <HomeBredCurbs title={`Detail Komisen - ${monthName || getMonthName(month)} ${year}`} />

            {/* Back Button */}
            {/* <div className="mb-4">
                <Button
                    text="Kembali"
                    icon="heroicons-outline:arrow-left"
                    className="btn-outline-dark"
                    onClick={() => navigate(-1)}
                />
            </div> */}

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    {/* Total Amount Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-blue-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 shadow-lg">
                                    <Icon icon="heroicons:currency-dollar" className="text-white text-2xl" />
                                </div>
                                <div className='text-right'>
                                    <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Jumlah Keseluruhan</div>
                                    <div className="text-xs text-blue-500 dark:text-blue-400 mt-2">{totalRows.toLocaleString()} transaksi</div>
                                </div>
                            </div>
                            <div className="text-right text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                                RM {parseFloat(summary.totalAmount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Total Commission DT Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-purple-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 dark:bg-purple-600 shadow-lg">
                                    <Icon icon="heroicons:banknotes" className="text-white text-2xl" />
                                </div>
                                <div className="text-right">
                                <div className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">Komisen DagangTEK</div>
                                <div className="text-xs text-purple-500 dark:text-purple-400 mt-2">Komisen gateway</div>
                                </div>
                            </div>
                            <div className="text-right text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                                RM {parseFloat(summary.totalCommissionDT || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Total Commission YIDE Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-green-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 dark:bg-green-600 shadow-lg">
                                    <Icon icon="heroicons:chart-bar" className="text-white text-2xl" />
                                </div>
                                <div className='text-right'>
                                <div className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-1">Komisen YIDE</div>
                                <div className="text-xs text-green-500 dark:text-green-400 mt-2">Komisen platform</div>
                                </div>
                            </div>
                            <div className="text-right text-3xl font-extrabold text-green-700 dark:text-green-300">
                                RM {parseFloat(summary.totalCommissionYIDE || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Total Nett Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-cyan-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500 dark:bg-cyan-600 shadow-lg">
                                    <Icon icon="heroicons:arrow-trending-up" className="text-white text-2xl" />
                                </div>
                                <div className='text-right'>
                                <div className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold mb-1">Jumlah Bersih</div>
                                <div className="text-xs text-cyan-500 dark:text-cyan-400 mt-2">Diterima institusi</div>
                                </div>
                            </div>
                            <div className="text-right text-3xl font-extrabold text-cyan-700 dark:text-cyan-300">
                                RM {parseFloat(summary.totalAmountNett || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Table Card */}
            <Card>
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Menunjukkan {data.length > 0 ? ((currentPage - 1) * rowsPerPage) + 1 : 0} - {Math.min(currentPage * rowsPerPage, totalRows)} daripada {totalRows} rekod
                        </div>
                    </div>
                    <Button
                        text="Export ke PDF"
                        icon="heroicons-outline:document-arrow-down"
                        className="bg-blue-600 text-white"
                        onClick={exportToPDF}
                        disabled={data.length === 0}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">No.</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Invoice No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Jenis</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nama Bil</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Jumlah (RM)</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Komisen DT</th>
                                {/* <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Komisen YIDE</th> */}
                                {/* <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Jumlah Bersih</th> */}
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Pembayar</th>
                                {/* <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Saluran</th> */}
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Tarikh</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-700">
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item.billpayment_id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {((currentPage - 1) * rowsPerPage) + index + 1}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-300 font-mono">
                                            {item.billpayment_invoiceNo}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <Badge 
                                                label={item.billpayment_type} 
                                                className={
                                                    item.billpayment_type === 'Kempen' ? 'bg-purple-600 text-white' :
                                                    item.billpayment_type === 'Infaq' ? 'bg-blue-600 text-white' :
                                                    item.billpayment_type === 'Topup' ? 'bg-green-600 text-white' :
                                                    'bg-slate-500 text-white'
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-300 max-w-xs truncate">
                                            {item.billpayment_billName}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-300 font-semibold">
                                            RM {parseFloat(item.billpayment_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-purple-600 dark:text-purple-400">
                                            RM {parseFloat(item.commission_dagangtek || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td> */}
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                                            RM {parseFloat(item.commission_yide || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-cyan-600 dark:text-cyan-400 font-bold">
                                            RM {parseFloat(item.amount_nett || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td> */}
                                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-300">
                                            <div className="max-w-xs">
                                                <div className="font-semibold truncate">{item.billpayment_payorName}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.billpayment_payorEmail}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{item.billpayment_payorPhone}</div>
                                            </div>
                                        </td>
                                        {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {item.billpayment_paymentChannel}
                                        </td> */}
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                                            {getStatusBadge(item.billpayment_status)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            <div>{moment(item.billpayment_createdDate).format('DD/MM/YYYY')}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {moment(item.billpayment_createdDate).format('HH:mm:ss')}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Tiada data untuk paparan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            text
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}

export default MaklumatKomisenDagangTEK;
