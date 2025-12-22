import React, { useCallback, useEffect, useState } from 'react';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import { SYSADMIN_API } from '@/utils/api';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import { Pagination, Pane, Spinner, Table } from 'evergreen-ui';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import Icons from '@/components/ui/Icon';
import Textinput from '@/components/ui/Textinput';
import { debounce } from 'lodash';
import Select from '@/components/ui/Select';

SenaraiPengeluaran.propTypes = {
    
};

function SenaraiPengeluaran(props) {

    const [loading, set_loading]    = useState(true)
    const [data, set_data]          = useState({
        row: [],
        total: 0,
        totalPages: 0
    })

    const [page, set_page]      = useState(1)
    const [limit, set_limit]    = useState(10)
    const [search, set_search]  = useState("")
    const [status, set_status]  = useState("")

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
            let api = await SYSADMIN_API(`disbursement?page=${metadata.page}&limit=${metadata.limit}&search=${_search}&status=${metadata.status}`, {}, "GET", true)
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

    const debouncedSearch = useCallback(
        debounce((val) => {
            getData(val), 1000
        }),
        []
    );

    useEffect(() => {
        getData()
    }, [metadata.page, metadata.limit])

    return (
        <div>
            <section>
                <HomeBredCurbs title={"Senarai Pengeluaran & Agihan Kewangan Kepada Institusi."} />
            </section>        

            <section className='mt-6'>
                <Card 
                    title={"Rekod Transaksi Pengeluaran - Kumpulan (Settlement Batch)"}
                    subtitle={"Klik pada rekod di bawah untuk melihat maklumat dengan lebih terperinci."}
                    headerslot={(
                        <div className='flex gap-3'>
                        <Select 
                        placeholder='-- Had Rekod --'
                        defaultValue={metadata.limit}
                        onChange={e => set_metadata({...metadata, limit: e.target.value})}
                        options={[
                            {label: 5, value: 5},
                            {label: 10, value: 10},
                            {label: 20, value: 20},
                            {label: 30, value: 30},
                            {label: 50, value: 50},
                            {label: 100, value: 100}
                        ]}
                        />
                        <Textinput 
                            className='w-[300px]'
                            defaultValue={metadata.search}
                            placeholder='Carian rekod transaksi pengeluaran...'
                            onChange={e => {
                                set_metadata({...metadata, search: e.target.value})
                                debouncedSearch(e.target.value)
                            }}
                        />
                        </div>
                    )}
                >
                    <div className='mt-6'>
                        <Table className='mt-6 overflow-scroll'>
                            <Table.Head>
                                <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                                <Table.HeaderCell>No. Batch</Table.HeaderCell>
                                <Table.HeaderCell>Tarikh Settlement</Table.HeaderCell>
                                <Table.HeaderCell>Amaun Settlement (RM)</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Tarikh Rekod Dijana</Table.HeaderCell>
                                <Table.HeaderCell flexBasis={80} flexShrink={0} flexGrow={0}>Tindakan</Table.HeaderCell>
                            </Table.Head>
                            <Table.Body>
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
                                            {/* <a href={`rekod-pengeluaran/${item.disburse_batch_no}`}>{item.disburse_batch_no}</a> */}
                                            <Link to={`${item.disburse_batch_no}`} state={item}>{item.disburse_batch_no}</Link>
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{moment(item.disburse_settlement_date).format("DD MMM YYYY")}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.disburse_amount2)}</Table.Cell>
                                        <Table.Cell fontSize="small">
                                            {item.disburse_status == "Approved" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Pengeluaran Berjaya</Badge>}
                                            {item.disburse_status == "Pending" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses Pengeluaran</Badge>}
                                            {item.disburse_status == "Rejected" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pengeluaran Gagal</Badge>}
                                            {item.disburse_status == "Others" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{moment(item.created_date).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                        <Table.Cell flexBasis={80} flexShrink={0} flexGrow={0}>
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={item.disburse_batch_no} state={item}>
                                                    <Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} />
                                                </Link>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                            {/* {
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(metadata.page - 1) * metadata.limit + index + 1}.</Table.Cell>
                                        <Table.Cell fontSize="small">{item.disburse_batch_no}</Table.Cell>
                                        <Table.Cell fontSize="small">{moment(item.disburse_settlement_date).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.disburse_amount)}</Table.Cell>
                                        <Table.Cell fontSize="small">
                                            {item.disburse_status == "Approved" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Pengeluaran Berjaya</Badge>}
                                            {item.disburse_status == "Pending" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses Pengeluaran</Badge>}
                                            {item.disburse_status == "Rejected" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pengeluaran Gagal</Badge>}
                                            {item.disburse_status == "Others" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{moment(item.created_date).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                        <Table.Cell>
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/maklumat-transaksi"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            } */}
                            </Table.Body>
                        </Table>
                        <Pane className='flex flex-row justify-center items-center p-6'>
                            <Pagination
                            page={metadata.page}
                            onPageChange={e => set_metadata({...metadata, page: e})}
                            totalPages={data.totalPages}
                            />
                        </Pane>
                    </div>
                </Card>
                {/* <pre>
                    <code>
                        {JSON.stringify(data.row, undefined, 2)}
                    </code>
                </pre> */}
            </section>
        </div>
    );
}

export default SenaraiPengeluaran;