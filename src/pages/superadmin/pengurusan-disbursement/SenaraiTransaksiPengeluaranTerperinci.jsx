import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import { useLocation } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { SYSADMIN_API } from '@/utils/api';
import { toast } from 'react-toastify';
import Textinput from '@/components/ui/Textinput';
import { Pagination, Pane, Spinner, Table } from 'evergreen-ui';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import Icons from '@/components/ui/Icon';

SenaraiTransaksiPengeluaranTerperinci.propTypes = {
    
};

function SenaraiTransaksiPengeluaranTerperinci(props) {

    const state                     = useLocation().state
    const [loading, set_loading]    = useState(true)
    const [data, set_data]          = useState({
        row: [],
        total: 0,
        totalPages: 0
    })

    const [metadata, set_metadata] = useState({
        page: 1,
        limit: 10,
        totalData: 0,
        totalPage: 0,
        search: "",
        status: ""
    })

    const getData = async (_search = "") => {
        try {
            let api = await SYSADMIN_API(`disbursement/${state.disburse_id}/transaction/${state.dd_id}?page=${metadata.page}&limit=${metadata.limit}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_data(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Sistem Ralat! Terdapat masalah pada pangkalan data. Sila hubungi sistem pentadbir anda.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [metadata.page, metadata.limit])

    return (
        <div>
            <section>
                <HomeBredCurbs title={`Senarai Transaksi Sumbangan Bagi EFT NO - ${state.disbursement_eft_no}`} />
            </section>

            <section className='mt-6'>
                <Card title={`Maklumat EFT & Institusi`} subtitle={`Berikut adalah maklumat EFT serta institusi agihan sumbangan.`}>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                        <Textinput 
                        label={"No. Batch"}
                        defaultValue={state.disbursement_eft_no.split("/")[0]}
                        disabled={true}
                        />
                        <Textinput 
                        label={"No. EFT Disbursement"}
                        defaultValue={state.disbursement_eft_no}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Status"}
                        defaultValue={state.dd_settlement_status}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Nama Institusi"}
                        defaultValue={state.organizationName}
                        disabled={true}
                        />
                        <Textinput 
                        label={"E-mel Institusi"}
                        defaultValue={state.organizationEmail}
                        disabled={true}
                        />
                        <Textinput 
                        label={"No. Telefon Institusi"}
                        defaultValue={state.organizationPhone}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Nama Pemegang Akaun Bank"}
                        defaultValue={state.organizationBankAccName}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Nama Bank"}
                        defaultValue={state.organizationBankName}
                        disabled={true}
                        />
                        <Textinput 
                        label={"No. Akaun Bank"}
                        defaultValue={state.organizationBankNumber}
                        disabled={true}
                        />
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <Table className='mt-6 overflow-scroll'>
                        <Table.Head>
                            <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                            <Table.HeaderCell>Nama Bil</Table.HeaderCell>
                            <Table.HeaderCell>Keterangan Bil</Table.HeaderCell>
                            <Table.HeaderCell>Jenis Bil</Table.HeaderCell>
                            <Table.HeaderCell>Amaun Agihan (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Maklumat Pembayar</Table.HeaderCell>
                            <Table.HeaderCell>Kaedah Bayaran</Table.HeaderCell>
                            <Table.HeaderCell>Status Agihan</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Rekod Dijana</Table.HeaderCell>
                        </Table.Head>
                        {
                            (loading) && (
                                <Table.Row flex={1} textAlign="center">
                                    <td className='flex w-full justify-center items-center'>
                                        <Spinner />
                                    </td>
                                </Table.Row>
                            )
                        }
                        {
                            (!loading && data.total == 0) && (
                                <Table.Row flex={1} textAlign="center">
                                    <Table.Cell flex={1}>
                                        <td className='flex w-full justify-center items-center text-sm text-black-500'>Tiada senarai transaksi pengeluaran buat masa sekarang.</td>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        {
                            (!loading && data.total > 0) && data.row.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(metadata.page - 1) * metadata.limit + index + 1}.</Table.Cell>
                                    <Table.Cell className='font-semibold text-teal-600 text-sm underline'>
                                        <p className='line-clamp-1'>{item.billpayment_billname}</p>
                                        <p className='font-semibold'>{item.billpayment_invoiceNo}</p>
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">
                                        <p className='line-clamp-1'>{item.billpayment_billdescription}</p>
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">
                                        <p>{item.billpayment_type}</p>
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">
                                        <p>{Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR'}).format(item.billpayment_amountNett)}</p>
                                    </Table.Cell>
                                    <Table.Cell fontSize="small" flexDirection="column" justifyItems="start" alignItems="start">
                                        <div>
                                        <p>{item.billpayment_payorName}</p>
                                        <p>{item.billpayment_payorEmail}</p>
                                        <p>{item.billpayment_payorPhone}</p>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">
                                        <p>{item.billpayment_paymentChannel}</p>
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">
                                        {item.dtrans_settlement_status == "Approved" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Pengeluaran Berjaya</Badge>}
                                        {item.dtrans_settlement_status == "Pending" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses Pengeluaran</Badge>}
                                        {item.dtrans_settlement_status == "Rejected" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pengeluaran Gagal</Badge>}
                                        {item.dtrans_settlement_status == "Others" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">{moment(item.billpayment_createdDate).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table>
                    <Pane className='flex flex-row justify-center items-center p-6'>
                        <Pagination
                        page={metadata.page}
                        onPageChange={e => set_metadata({...metadata, page: e})}
                        totalPages={data.totalPages}
                        />
                    </Pane>
                </Card>
            </section>
        </div>
    );
}

export default SenaraiTransaksiPengeluaranTerperinci;