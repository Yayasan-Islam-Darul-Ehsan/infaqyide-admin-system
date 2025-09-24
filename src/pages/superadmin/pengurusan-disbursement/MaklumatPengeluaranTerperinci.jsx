import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import { SYSADMIN_API } from '@/utils/api';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { FileUploader, Pagination, Pane, Spinner, Table } from 'evergreen-ui';
import Icons from '@/components/ui/Icon';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import DropZone from '@/pages/forms/file-input/DropZone';
import Modal from '@/components/ui/Modal';
import axios from 'axios';
import Loading from '@/components/Loading';

MaklumatPengeluaranTerperinci.propTypes = {
    
};

function MaklumatPengeluaranTerperinci(props) {

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

     const [selectedFile, setSelectedFile] = useState(null);

    const getData = async (_search = "") => {
        try {
            let api = await SYSADMIN_API(`disbursement/${state.disburse_id}?page=${metadata.page}&limit=${metadata.limit}&search=${_search}&status=${metadata.status}`, {}, "GET", true)
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

    const getURL = () => {
        let env = process.env.NODE_ENV
        if(env === "development") {
            return `http://localhost:30001/sysadmin/disbursement/fail-pengeluaran/settlement?batch_id=${state.disburse_id}`
        } else if(env === "staging") {
            return `https://infaqyide.xyz/sysadmin/disbursement/fail-pengeluaran/settlement?batch_id=${state.disburse_id}`
        } else if(env === "production") {
            return `https://infaqyide.com.my/sysadmin/disbursement/fail-pengeluaran/settlement?batch_id=${state.disburse_id}`
        } 
    }

    const downloadSettlement = async () => {
    try {

        set_loading(true)

        const res   = await axios.get(getURL(), { responseType: "blob" });
        const blob  = new Blob([res.data], { type: "text/plain" });
        const url   = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Bulk Settlement InfaqYIDE - ${state.disburse_batch_no}.txt`); // filename
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Download failed:", err);
    } finally {
        set_loading(false)
    }
    };

    const debouncedSearch = useCallback(
        debounce((val) => {
            getData(val), 1000
        }),
        []
    );

    useEffect(() => {
        getData()
    }, [metadata.page, metadata.limit])

    const [modal, set_modal]    = useState(false)
    const open_modal            = () => set_modal(true)
    const close_modal           = () => set_modal(false)

    if(loading) return <Loading />

    return (
        <div>

            <Modal
            title='Muat Naik Fail Statement E-Banker'
            themeClass='bg-teal-600 text-white'
            centered={true}
            activeModal={modal}
            onClose={close_modal}
            footerContent={(<>
            <div className='flex justify-end items-center gap-1'>
                <Button className='btn btn-sm' onClick={close_modal} text={"Tutup"} />
                <Button className='btn btn-sm bg-teal-600 text-white' text={"Muat Naik"} />
            </div>
            </>)}
            >
                <div>
                    <label htmlFor="" className='form-label'>Muat Naik Fail</label>
                    <DropZone />
                </div>
            </Modal>

            <section>
                <HomeBredCurbs title={`Maklumat Pengeluaran Terperinci - ${state.disburse_batch_no}`} />
            </section>

            <section className='mt-6'>
                <div className='grid grid-cols-12 gap-3'>
                    <Card title={"Maklumat Batch Settlement"} className='col-span-4'>
                        <div className='space-y-1'>
                            <div className='flex justify-between items-center'>
                                <p className='text-sm text-black-500 font-semibold'>ID.</p>
                                <p className='text-sm text-black-500'>{state.disburse_id}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-sm text-black-500 font-semibold'>No. Batch</p>
                                <p className='text-sm text-black-500'>{state.disburse_batch_no}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-sm text-black-500 font-semibold'>Tarikh Settlement</p>
                                <p className='text-sm text-black-500'>{state.disburse_settlement_date}</p>
                            </div>
                        </div>
                    </Card>
                    <Card title={"Muat Turun EFT"} className='col-span-4'>
                        <div className='flex justify-center items-center'>
                        <Button className='flex flex-col justify-center items-center gap-1' onClick={downloadSettlement}>
                            <Icons icon={"heroicons:arrow-down-tray"} className={"text-3xl"} />
                            <p className='text-sm text-black-500'>Muat Turun Fail EFT</p>
                        </Button>
                        </div>
                    </Card>
                    <Card title={"Muat Naik Status E-Banker"} className='col-span-4'>
                        <div className='flex justify-center items-center'>
                        <Button className='flex flex-col justify-center items-center gap-1' onClick={open_modal}>
                            <Icons icon={"heroicons:arrow-up-tray"} className={"text-3xl"} />
                            <p className='text-sm text-black-500'>Muat Naik Fail E-Banker</p>
                        </Button>
                        </div>
                    </Card>
                </div>
            </section>

            <section className='mt-6'>
                <Card
                title={`Rekod Settlement Kepada Institusi - ${state.disburse_batch_no}`}
                subtitle={`Berikut adalah rekod senarai transaksi agihan kewangan kepada institusi-institusi infaqYIDE.`}
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
                    <Table className='mt-6 overflow-scroll'>
                        <Table.Head>
                            <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                            <Table.HeaderCell>No. EFT</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Settlement</Table.HeaderCell>
                            <Table.HeaderCell>Jumlah Agihan (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Nama Institusi</Table.HeaderCell>
                            <Table.HeaderCell>Nama Bank</Table.HeaderCell>
                            <Table.HeaderCell>No. Akaun Bank</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Rekod Dijana</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={80} flexShrink={0} flexGrow={0}>Tindakan</Table.HeaderCell>
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
                                    <Table.Cell className='font-semibold text-teal-600 text-sm underline'>{item.disbursement_eft_no}</Table.Cell>
                                    <Table.Cell fontSize="small">{item.dd_settlement_date ? moment(item.dd_settlement_date).format("DD MMM YYYY") : '-- tiada maklumat --'}</Table.Cell>
                                    <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.dd_amount)}</Table.Cell>
                                    <Table.Cell fontSize="small"><span className='line-clamp-1'>{item.organizationName}</span></Table.Cell>
                                    <Table.Cell fontSize="small">{item.organizationBankName}</Table.Cell>
                                    <Table.Cell fontSize="small">{item.organizationBankNumber}</Table.Cell>
                                    <Table.Cell fontSize="small">
                                        {item.dd_settlement_status == "Approved" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Pengeluaran Berjaya</Badge>}
                                        {item.dd_settlement_status == "Pending" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses Pengeluaran</Badge>}
                                        {item.dd_settlement_status == "Rejected" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pengeluaran Gagal</Badge>}
                                        {item.dd_settlement_status == "Others" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                    </Table.Cell>
                                    <Table.Cell fontSize="small">{moment(item.created_date).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                    <Table.Cell flexBasis={80} flexShrink={0} flexGrow={0}>
                                        <div className='flex flex-row justify-center items-center gap-1'>
                                            <Link to={`${item.dd_id}`} state={item}>
                                                <Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} />
                                            </Link>
                                        </div>
                                    </Table.Cell>
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

export default MaklumatPengeluaranTerperinci;