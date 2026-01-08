import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Loading from '@/components/Loading';
import Pagination from '@/components/ui/Pagination';
import * as XLSX from 'xlsx';
import moment from 'moment';
import Select from '@/components/ui/Select';
import { SYSADMIN_API } from '@/utils/api';

const styles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: "12px"
    }),
};

function SenaraiKomisenDagangTEK() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() );
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Generate year options from 2025 to current year
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = 2025; year <= currentYear; year++) {
            years.push({ label: year.toString(), value: year });
        }
        return years.reverse(); // Latest year first
    };

    // Month options in English
    const monthOptions = [
        { label: "Semua Bulan", value: null },
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 }
    ];

    // Helper function to convert month number to name
    const getMonthName = (monthNumber) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNumber - 1] || "";
    };

    // Fetch stats function
    const fetchStats = async () => {
        try {
            let api = await SYSADMIN_API(`dagangtek/stats?year=${selectedYear}`, {}, "GET", true);
            console.log("Log Api Get Stats : ", api);
            
            if (api.status_code === 200) {
                setStats(api.data.overview);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    // Rows per page options
    const rowsPerPageOptions = [
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "50", value: 50 },
        { label: "100", value: 100 }
    ];

    // Mock data for UI testing
    const mockData = [
        { 
            tahun: 2025, 
            bulan: "January", 
            jumlah_transaksi: 150, 
            jumlah_komisen: 45000.00 
        },
        { 
            tahun: 2025, 
            bulan: "February", 
            jumlah_transaksi: 200, 
            jumlah_komisen: 60000.00 
        },
        { 
            tahun: 2025, 
            bulan: "March", 
            jumlah_transaksi: 175, 
            jumlah_komisen: 52500.00 
        },
        { 
            tahun: 2025, 
            bulan: "April", 
            jumlah_transaksi: 180, 
            jumlah_komisen: 54000.00 
        },
        { 
            tahun: 2026, 
            bulan: "January", 
            jumlah_transaksi: 220, 
            jumlah_komisen: 66000.00 
        }
    ];

    // Fetch data function
    const fetchData = async () => {
        setLoading(true);
        try {
            // Build API URL with filters
            let apiUrl = `dagangtek/commission?page=${currentPage}&limit=${rowsPerPage}&year=${selectedYear}`;
            if (selectedMonth && selectedMonth.value !== null) {
                apiUrl += `&month=${selectedMonth.value}`;
            }

            let api = await SYSADMIN_API(apiUrl, {}, "GET", true);
            console.log("Log Api Get List Commission : ", api);
            
            if (api.status_code === 200) {
                // Map API response to UI data structure
                const mappedData = api.data.map(item => ({
                    tahun: item.year,
                    bulan: getMonthName(item.month),
                    jumlah_transaksi: item.total_transactions,
                    jumlah_komisen: parseFloat(item.total_commission),
                    jumlah_amount: parseFloat(item.total_amount),
                    period: item.period,
                    period_label: item.period_label
                }));

                setData(mappedData);
                setTotalRows(api.totalData || 0);
                setTotalPages(api.totalPage || 1);
            } else {
                toast.error(api.message || "Gagal mendapatkan data.");
                setData([]);
                setTotalRows(0);
                setTotalPages(0);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Harap maaf! Terdapat masalah untuk mendapatkan data.");
            setData([]);
            setTotalRows(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Export to Excel function
    const exportToExcel = () => {
        try {
            // Prepare data for export
            const exportData = data.map((item, index) => ({
                'No.': ((currentPage - 1) * rowsPerPage) + index + 1,
                'Tahun': item.tahun,
                'Bulan': item.bulan,
                'Jumlah Transaksi': item.jumlah_transaksi,
                'Jumlah Amount (RM)': parseFloat(item.jumlah_amount || 0).toFixed(2),
                'Jumlah Komisen (RM)': parseFloat(item.jumlah_komisen || 0).toFixed(2)
            }));

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            
            // Set column widths
            ws['!cols'] = [
                { wch: 5 },   // No.
                { wch: 10 },  // Tahun
                { wch: 15 },  // Bulan
                { wch: 20 },  // Jumlah Transaksi
                { wch: 20 }   // Jumlah Komisen
            ];

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Komisen DagangTEK");

            // Generate filename with timestamp
            const filename = `Komisen_DagangTEK_${selectedYear.value}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;

            // Save file
            XLSX.writeFile(wb, filename);

            toast.success("Data berjaya dieksport ke Excel!");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            toast.error("Gagal mengeksport data ke Excel.");
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (option) => {
        setRowsPerPage(option.value);
        setCurrentPage(1); // Reset to first page
    };

    // Handle year filter change
    const handleYearChange = (option) => {
        setSelectedYear(option);
        setCurrentPage(1);
    };

    // Handle month filter change
    const handleMonthChange = (option) => {
        setSelectedMonth(option);
        setCurrentPage(1);
    };

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchData();
        fetchStats()
    }, [currentPage, rowsPerPage, selectedYear, selectedMonth]);

    if (loading) return <Loading />;

    return (
        <div>
            <HomeBredCurbs title="Komisen DagangTEK" />

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    {/* Total Transactions Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-purple-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 dark:bg-purple-600 shadow-lg">
                                    <Icon icon="heroicons:arrow-trending-up" className="text-white text-lg" />
                                </div>
                                <div className='text-right'>
                                <div className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">Jumlah Transaksi</div>
                                <div className="text-xl font-extrabold text-purple-700 dark:text-purple-300">
                                    {stats.total_transactions?.toLocaleString() || 0}
                                </div>
                                <div className="text-xs text-purple-500 dark:text-purple-400">Jumlah Keseluruhan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Amount Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-blue-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 shadow-lg">
                                    <Icon icon="heroicons:currency-dollar" className="text-white text-lg" />
                                </div>
                                <div className='text-right'>
                                <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Jumlah Amount</div>
                                <div className="text-xl font-extrabold text-blue-700 dark:text-blue-300">
                                    RM {parseFloat(stats.total_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-blue-500 dark:text-blue-400">Nilai keseluruhan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Commission Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-green-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 dark:bg-green-600 shadow-lg">
                                    <Icon icon="heroicons:banknotes" className="text-white text-lg" />
                                </div>
                                <div className='text-right'>
                                <div className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold">Jumlah Komisen</div>
                                <div className="text-xl font-extrabold text-green-700 dark:text-green-300">
                                    RM {parseFloat(stats.total_commission || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-green-500 dark:text-green-400">Pendapatan komisen</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Average Commission Card */}
                    <div className="hover:shadow-lg transition-all duration-300 border border-cyan-700 rounded-lg">
                        <div className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-md">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500 dark:bg-cyan-600 shadow-lg">
                                    <Icon icon="heroicons:chart-bar" className="text-white text-lg" />
                                </div>
                                <div className='text-right'>
                                <div className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">Purata Komisen</div>
                                <div className="text-xl font-extrabold text-cyan-700 dark:text-cyan-300">
                                    RM {parseFloat(stats.avg_commission || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-cyan-500 dark:text-cyan-400">Per transaksi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Card>
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        {/* Year Filter */}
                        <div className="flex-1">
                            <Select
                            label={"Tahun"}
                                options={generateYearOptions()}
                                value={selectedYear}
                                onChange={e => handleYearChange(e.target.value)}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Pilih Tahun"
                            />
                        </div>

                        {/* Month Filter */}
                        <div className="flex-1">
                            <Select
                                label={"Bulan"}
                                options={monthOptions}
                                value={selectedMonth}
                                onChange={e => handleMonthChange(e.target.value)}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="Pilih Bulan"
                                isClearable
                            />
                        </div>

                        {/* Rows Per Page */}
                        <div className="flex-1">
                            <Select
                                label={"Paparan"}
                                options={rowsPerPageOptions}
                                value={rowsPerPageOptions.find(opt => opt.value === rowsPerPage)}
                                onChange={handleRowsPerPageChange}
                                styles={styles}
                                className="react-select"
                                classNamePrefix="select"
                            />
                        </div>

                        {/* Export Button */}
                        {/* <div className="flex-1 flex items-end">
                            <Button
                                text="Export ke Excel"
                                icon="heroicons-outline:document-arrow-down"
                                className="bg-green-600 text-white w-full"
                                onClick={exportToExcel}
                                disabled={data.length === 0}
                            />
                        </div> */}
                    </div>

                    {/* Results Info */}
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Menunjukkan {data.length > 0 ? ((currentPage - 1) * rowsPerPage) + 1 : 0} - {Math.min(currentPage * rowsPerPage, totalRows)} daripada {totalRows} rekod
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                    No.
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                    Tahun
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                    Bulan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                    Jumlah Transaksi
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                    Jumlah Komisen (RM)
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                                    Tindakan
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-700">
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {((currentPage - 1) * rowsPerPage) + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {item.tahun}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {item.bulan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-300">
                                            {item.jumlah_transaksi.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-slate-900 dark:text-slate-300">
                                            RM {item.jumlah_komisen.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <Button
                                                text="Lihat"
                                                icon="heroicons-outline:eye"
                                                className="btn-sm btn-primary"
                                                onClick={() => {
                                                    navigate('/komisen-dagangtek/detail', {
                                                        state: {
                                                            year: item.tahun,
                                                            month: monthOptions.findIndex(m => m.label === item.bulan),
                                                            monthName: item.bulan
                                                        }
                                                    });
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
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

export default SenaraiKomisenDagangTEK;
