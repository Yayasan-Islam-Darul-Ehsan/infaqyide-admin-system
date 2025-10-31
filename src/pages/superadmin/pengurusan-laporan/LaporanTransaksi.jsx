import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { SYSADMIN_API } from '@/utils/api';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import { debounce } from 'lodash';
import { Pagination, Pane, Spinner, Table } from 'evergreen-ui';
import Badge from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import Icons from '@/components/ui/Icon';
import moment from 'moment';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

import Flatpickr from "react-flatpickr";

function toMYR(amount = 0) {
    return Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount)
}

function LaporanTransaksi(props) {

    const [loading, set_loading]        = useState(true)
    const [transaksi, set_transaksi]    = useState([])
    const [rumusan, set_rumusan]        = useState({
        JUMLAH_AGIHAN_KEPADA_INSTITUSI: 0,
        JUMLAH_AGIHAN_KEPADA_YIDE: 0,
        JUMLAH_KESELURUHAN_INFAQ: 0,
        JUMLAH_KOMISEN_DAGANGTEK: 0,
        JUMLAH_KOMISEN_INFAQYIDE: 0
    })

    const [metadata, set_metadata]      = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })

    const [modal, set_modal] = useState(false)
    const [excel, set_excel] = useState({
        dateFrom: moment().startOf('month').format("YYYY-MM-DD"),
        dateTo: moment().endOf('month').format("YYYY-MM-DD"),
        status: ''
    })

    const [search, set_search]          = useState("")
    const [status, set_status]          = useState("")

    const getData = async (_search = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`laporan?page=${metadata.page}&limit=${metadata.limit}&search=${_search}&status=${status}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_transaksi(api.data.row)
                set_metadata({
                    ...metadata,
                    total: api.data.total,
                    totalPages: api.data.totalPages
                })
                set_rumusan(api.summary[0])
            }
        } catch (error) {
            toast.error("Sistem Ralat! Sila hubungi sistem pentadbir anda.")
        } finally {
            set_loading(false)
        }
    }

    const getExcel = async () => {
        set_modal(false)
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`excel-laporan-infaq?dateFrom=${excel.dateFrom}&dateTo=${excel.dateTo}&status=${excel.status}`, {}, "GET")
            if(api.status_code === 200) {
                // window.location.href = api.data
                const link = document.createElement('a');
                link.href = api.data;
                link.download = api.data; // Optional: suggest filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Ralat! Terdapat masalah untuk muat turun senarai transaksi ke fail Excel.")
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

    //if(loading) return <Loading />

    return (
        <div>

            <Modal
            centered={true}
            title='Tetapan Excel'
            themeClass='bg-green-600 text-white'
            activeModal={modal}
            onClose={() => set_modal(false)}
            footerContent={(
                <div className='flex justify-end items-center'>
                    <Button className=''>Tutup</Button>
                    <Button className='bg-teal-600 text-white' onClick={getExcel}>Muat Turun Excel</Button>
                </div>
            )}
            >
                <div className='space-y-3 gap-3'>
                    <div>
                        <label className="form-label" for="disabled-picker">Tarikh Mula</label>
                        <Flatpickr
                        value={excel.dateFrom}
                        id="disabled-picker"
                        className="form-control py-2"
                        onChange={(date) => set_excel({...excel, dateFrom: date})}
                        options={{
                            dateFormat: "Y-m-d",
                        }}
                        />
                    </div>
                    <div>
                        <label className="form-label" for="disabled-picker">Tarikh Hingga</label>
                        <Flatpickr
                        value={excel.dateTo}
                        id="disabled-picker"
                        className="form-control py-2"
                        onChange={(date) => set_excel({...excel, dateTo: date})}
                        options={{
                            dateFormat: "Y-m-d",
                        }}
                        />
                    </div>
                    <div>
                        <Select 
                        label={"Status Transaksi"}
                        placeholder='Contoh: Transaksi Berjaya'
                        defaultValue={excel.status}
                        options={[
                            {label: 'Semua Status', value: ''},
                            {label: 'Transaksi Berjaya', value: '1'},
                            {label: 'Sedang Diproses', value: '2'},
                            {label: 'Transaksi Gagal', value: '3'},
                            {label: 'Transaksi Tidak Diketahui', value: '4'}
                        ]}
                        onChange={e => set_excel({...excel, status: e.target.value})}
                        />
                    </div>
                </div>
            </Modal>

            <HomeBredCurbs title={"Laporan Transaksi Sumbangan InfaqYIDE"} />

            <section className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-blue-600'>{toMYR(rumusan.JUMLAH_KESELURUHAN_INFAQ)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Kutipan Infaq</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-yellow-600'>{toMYR(rumusan.JUMLAH_KOMISEN_DAGANGTEK)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Komisen DT</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-violet-600'>{toMYR(rumusan.JUMLAH_KOMISEN_INFAQYIDE)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Komisen YIDE</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-emerald-600'>{toMYR(rumusan.JUMLAH_AGIHAN_KEPADA_YIDE)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Agihan Ke YIDE</p>
                        </div>
                    </Card>
                    <Card>
                        <div className='text-start'>
                        <p className='font-semibold text-2xl text-red-600'>{toMYR(rumusan.JUMLAH_AGIHAN_KEPADA_INSTITUSI)}</p>
                        <p className='font-normal text-sm text-black-500'>Jumlah Agihan Ke Institusi</p>
                        </div>
                    </Card>
                </div>
            </section>

            <section className='mt-6'>
                <Card
                title={"Senarai Transaksi Sumbangan Infaq"}
                subtitle={"Klik pada transaksi di bawah untuk melihat maklumat terperinci."}
                className='overflow-scroll'
                headerslot={(
                    <Button 
                    text={"Download Excel"}
                    icon={'heroicons:arrow-down-tray'}
                    className='btn btn-sm bg-green-600 text-white'
                    onClick={() => set_modal(true)}
                    />
                )}
                >
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-1'>
                            <Textinput 
                            className='w-[300px]'
                            defaultValue={search}
                            placeholder='Carian transaksi sumbangan infaq...'
                            onChange={e => {
                                set_search(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                            />
                            {/* <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Tahun Rekod --'
                            defaultValue={year}
                            onChange={e => set_year(e.target.value)}
                            options={getListYear()}
                            /> */}
                        </div>
                        <Select 
                        placeholder='-- Had Rekod --'
                        defaultValue={metadata.limit}
                        onChange={e => set_metadata({...metadata, limit: e.target.value})}
                        options={[
                            {label: 10, value: 10},
                            {label: 20, value: 20},
                            {label: 30, value: 30},
                            {label: 50, value: 50},
                            {label: 100, value: 100}
                        ]}
                        />
                    </div>
                    <div className='mt-6'>
                        <Table className='mt-6 overflow-scroll'>
                            <Table.Head>
                                <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                                <Table.HeaderCell>Jenis Transaksi</Table.HeaderCell>
                                <Table.HeaderCell>No. Transaksi</Table.HeaderCell>
                                <Table.HeaderCell>Jumlah Transaksi (RM)</Table.HeaderCell>
                                <Table.HeaderCell>Komisen DagangTEK (RM)</Table.HeaderCell>
                                <Table.HeaderCell>Komisen YIDE (RM)</Table.HeaderCell>
                                <Table.HeaderCell>Agihan Ke YIDE (30%)</Table.HeaderCell>
                                <Table.HeaderCell>Agihan Ke Transaksi (70%)</Table.HeaderCell>
                                <Table.HeaderCell>Status Transaksi</Table.HeaderCell>
                                <Table.HeaderCell>Tarikh</Table.HeaderCell>
                                <Table.HeaderCell>Tindakan</Table.HeaderCell>
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
                                    (!loading && metadata.total === 0) && (
                                        <Table.Row flex={1} textAlign="center">
                                            <Table.Cell flex={1} fontSize="small" colSpan={9}>
                                                <td className='flex w-full justify-center items-center'>
                                                    Tiada senarai transaksi sumbangan infaq.
                                                </td>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                                {
                                    (!loading && metadata.total > 0) && transaksi.map((item, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(metadata.page - 1) * metadata.limit + index + 1}.</Table.Cell>
                                            <Table.Cell fontSize="small">
                                                {item.billpayment_type === "Infaq" && <Badge className='bg-teal-50 border border-teal-100 text-teal-900'>Infaq Am</Badge>}
                                                {(item.billpayment_type === "Auto-infaq" || item.billpayment_type === "Auto-Infaq" ) && <Badge className='bg-blue-50 border border-blue-100 text-blue-900'>Auto Infaq</Badge>}
                                                {item.billpayment_type === "Topup" && <Badge className='bg-purple-50 border border-purple-100 text-purple-900'>Tambah Nilai</Badge>}
                                                {item.billpayment_type === "Kempen" && <Badge className='bg-orange-50 border border-orange-100 text-orange-900'>Kempen</Badge>}
                                            </Table.Cell>
                                            <Table.Cell fontSize="small">{item.billpayment_invoiceNo}</Table.Cell>
                                            <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayment_amount)}</Table.Cell>
                                            <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayment_commission_dagangtek)}</Table.Cell>
                                            <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayment_commission_yide)}</Table.Cell>
                                            <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayemnt_amountSplitYIDE)}</Table.Cell>
                                            <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayemnt_amountSplitInstitusi)}</Table.Cell>
                                            <Table.Cell fontSize="small">
                                                {item.billpayment_status == "1" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Transaksi Berjaya</Badge>}
                                                {item.billpayment_status == "2" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses</Badge>}
                                                {item.billpayment_status == "3" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pembayaran Gagal</Badge>}
                                                {item.billpayment_status == "4" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                            </Table.Cell>
                                            <Table.Cell fontSize="small">{moment(item.billpayment_createdDate).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                            <Table.Cell>
                                                <div className='flex flex-row justify-center items-center gap-1'>
                                                    <Link to={"/pengurusan/maklumat-transaksi"} state={{ data:item }}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>
                        <Pane className='flex flex-row justify-center items-center p-6'>
                            <Pagination 
                            page={metadata.page}
                            onPageChange={e => set_metadata({...metadata, page: e})}
                            totalPages={metadata.totalPages}
                            />
                        </Pane>
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default LaporanTransaksi;