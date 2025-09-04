import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HomeBredCurbs from '../dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import RevenueBarChart from '@/components/partials/widget/chart/revenue-bar-chart';
import DashboardChart from './DashboardChart';
import { toast } from 'react-toastify';
import { API, SYSADMIN_API } from '@/utils/api';
import SkeletionTable from '@/components/skeleton/Table';
import { Table } from 'evergreen-ui';
import Badge from '@/components/ui/Badge';

function toMYR(amount = 0) {
    return Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount)
}

function DashboardSuperAdmin(props) {

    const [loading, set_loading]                            = useState(true)
    const [loading_transaction, set_loading_transaction]    = useState(true)
    const [loading_users, set_loading_users]                = useState(true)

    const [summary, set_summary]                            = useState({ JUMLAH_PENGGUNA: 0, JUMLAH_SUMBANGAN_INFAQ: 0, JUMLAH_SUMBANGAN_AUTO_INFAQ: 0, JUMLAH_SUMBANGAN_KEMPEN_INFAQ: 0, JUMLAH_TAMBAH_NILAI: 0})
    const [data_transaction, set_data_transaction]          = useState([])
    const [data_users, set_data_users]                      = useState([])

    const GetDashboard = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API("dashboard", {}, "GET", true)
            if(api.status_code === 200) {
                set_summary(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Ralat! Terdapat masalah pada fungsi melihat data ringkasan dashboard.")
        }
    }

    const GetLatestTransaction = async () => {
        set_loading_transaction(true)
        try {
            let api = await SYSADMIN_API("pengurusan/transaksi?page=1&limit=10", {}, "GET")
            if(api.status_code === 200) {
                set_data_transaction(api.data.row)
            }
        } catch (e) {
            toast.error(e)
        } finally {
            set_loading_transaction(false)
        }
    }

    const GetLatestRegisteredUsers = async () => {
        set_loading_users(true)
        try {
            let api = await SYSADMIN_API("pengurusan/pengguna?page=1&limit=10", {}, "GET")
            if(api.status_code === 200) {
                set_data_users(api.data.row)
            }
        } catch (e) {
            toast.error(e)
        } finally {
            set_loading_users(false)
        }
    }

    useEffect(() => {
        GetDashboard()
        GetLatestTransaction()
        GetLatestRegisteredUsers()
    }, [])

    return (
        <div>
            <section>
                <HomeBredCurbs title={"Dashboard - Pengurusan InfaqYIDE"} />
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-blue-600'>{summary.JUMLAH_PENGGUNA}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Pengguna</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-yellow-600'>{toMYR(summary.JUMLAH_SUMBANGAN_INFAQ)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Kutipan Infaq</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-violet-600'>{toMYR(summary.JUMLAH_SUMBANGAN_INFAQ)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Kutipan Auto Infaq</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-emerald-600'>{toMYR(summary.JUMLAH_SUMBANGAN_KEMPEN_INFAQ)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Kutipan Kempen</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-red-600'>{toMYR(summary.JUMLAH_TAMBAH_NILAI)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Tambah Nilai</p>
                        </div>
                    </Card>
                </div>
            </section>

            <section className='mt-6'>
                <Card className='overflow-scroll'>
                    <DashboardChart />
                </Card>
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-3'>
                    <Card title={"Rekod 10 Transaksi Terkini"} className='col-span-12 md:col-span-7'>
                        {
                            loading_transaction && <SkeletionTable count={5} />
                        }
                        {
                            loading_transaction === false && data_transaction.length < 1 && (<p>Tiada rekod transaksi terkini.</p>)
                        }
                        {
                            (loading_transaction === false && data_transaction.length > 0) && (
                                <>
                                <Table className='mt-6'>
                                    <Table.Head>
                                        <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                                        <Table.HeaderCell flexBasis={300} flexShrink={0} flexGrow={0}>Maklumat Transaksi</Table.HeaderCell>
                                        <Table.HeaderCell>Amaun (RM)</Table.HeaderCell>
                                        <Table.HeaderCell>Nama Pembayar</Table.HeaderCell>
                                        <Table.HeaderCell>Status Transaksi</Table.HeaderCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {
                                            data_transaction.map((item, index) => (
                                                <Table.Row key={index}>
                                                    <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{index + 1}.</Table.Cell>
                                                    <Table.Cell flexBasis={300} flexShrink={0} flexGrow={0} fontSize="small">
                                                        <p>{item.billpayment_invoiceNo} - <span className='font-semibold'>{item.billpayment_type}</span></p>
                                                    </Table.Cell>
                                                    <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayment_amount)}</Table.Cell>
                                                    <Table.Cell fontSize="small">{item.billpayment_payorName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                                    <Table.Cell fontSize="small">
                                                        {item.billpayment_status == "1" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Transaksi Berjaya</Badge>}
                                                        {item.billpayment_status == "2" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses</Badge>}
                                                        {item.billpayment_status == "3" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pembayaran Gagal</Badge>}
                                                        {item.billpayment_status == "4" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        }
                                    </Table.Body>
                                </Table>
                                </>
                            )
                        }
                    </Card>
                    <Card title={"Rekod 10 Pengguna Berdaftar Terkini"} className='col-span-12 md:col-span-5'>
                        {
                            loading_users && <SkeletionTable count={5} />
                        }
                        {
                            loading_users === false && data_users.length < 1 && (<p>Tiada rekod pendaftaran pengguna terkini.</p>)
                        }
                        {
                            (loading_users === false && data_users.length > 0) && (
                                <>
                                <Table className='mt-6'>
                                    <Table.Head>
                                        <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                                        <Table.HeaderCell>Nama Pengguna</Table.HeaderCell>
                                        <Table.HeaderCell>E-mel Pengguna</Table.HeaderCell>
                                        <Table.HeaderCell>No. Telefon Pengguna</Table.HeaderCell>
                                        <Table.HeaderCell>Status Akaun</Table.HeaderCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {
                                            data_users.map((item, index) => (
                                                <Table.Row key={index}>
                                                    <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{index + 1}.</Table.Cell>
                                                    <Table.Cell fontSize="small">{item.account_username}</Table.Cell>
                                                    <Table.Cell fontSize="small">{item.account_email}</Table.Cell>
                                                    <Table.Cell fontSize="small">{item.account_phone}</Table.Cell>
                                                    <Table.Cell fontSize="small">
                                                        {
                                                            item.account_verified == "2" ? <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Akaun Aktif</Badge> : <Badge className='bg-red-50 border border-red-100 text-red-900'>Akaun Nyahaktif</Badge>
                                                        }
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        }
                                    </Table.Body>
                                </Table>
                                </>
                            )
                        }
                    </Card>
                </div>
            </section>
        </div>
    );
}

export default DashboardSuperAdmin;