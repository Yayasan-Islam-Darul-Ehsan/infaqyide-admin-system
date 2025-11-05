import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { SYSADMIN_API } from '@/utils/api';
import { toast } from 'react-toastify';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Loading from '@/components/Loading';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import { Dialog, Pagination, Pane, Table } from 'evergreen-ui';
import Badge from '@/components/ui/Badge';
import Icons from '@/components/ui/Icon';
import moment from 'moment';
import Select from '@/components/ui/Select';
import { debounce } from 'lodash';

MaklumatKreditInstitusi.propTypes = {
    
};

function MaklumatKreditInstitusi(props) {

    const navigate      = useNavigate()
    const { state }     = useLocation()

    const [loading, set_loading]    = useState(false)
    const [loading2, set_loading2]  = useState(true)
    const [akaun_id, set_akaun_id]  = useState(state.organizationWalletOrgId || null)
    const [kredit, set_kredit]      = useState(state)

    const [transaksi, set_transaksi]    = useState({row: [], total: 0, totalPages: 0})
    const [page, set_page]              = useState(1)
    const [limit, set_limit]            = useState(10)
    const [search, set_search]          = useState("")
    const [type, set_type]              = useState("")
    const [status, set_status]          = useState("")

    const [dialog, set_dialog]  = useState(false)
    const open_dialog           = () => set_dialog(true)
    const close_dialog          = () => set_dialog(false)

    const getData = async (_search = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kredit/institusi/${akaun_id}`, {}, "GET", true)   
            if(api.status_code === 200) {
                set_kredit(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk memperoleh maklumat akaun kredit institusi.")
        } finally {
            set_loading(false)
        }
    }

    const getTransaction = async (_search = "", _type = type, _status = status) => {
        set_loading2(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kredit/institusi/${akaun_id}/transaction?page=${page}&limit=${limit}&search=${_search}&type=${_type}&status=${_status}`, {}, "GET", true)   
            if(api.status_code === 200) {
                set_transaksi(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk memperoleh maklumat transaksi akaun kredit institusi.")
        } finally {
            set_loading2(false)
        }
    }

    const UpdateMaklumatKredit = async () => {
        close_dialog()
        set_loading(true)

        try {
            let json = {
                organizationWalletId: kredit.organizationWalletId,
                organizationWalletBalance: kredit.organizationWalletBalance,
                organizationWalletFloat: kredit.organizationWalletFloat
            }
            let api = await SYSADMIN_API(`pengurusan/kredit/institusi/${akaun_id}`, json, "PATCH", true)
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate(-1)
                }, 500);
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkala data untuk mengemaskini maklumat akaun kredit ini.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [state])

    useMemo(() => {
        getTransaction()
    }, [page, limit, type, status])

    const debouncedSearch = useCallback(
        debounce((val) => {
            getTransaction(val, type, status), 1000
        }),
        []
    );

    if(loading) return <Loading />

    const opt_type = [
        {label: 'Infaq', value: 'Infaq'},
        {label: 'Auto-Infaq', value: 'Auto-Infaq'},
        {label: 'Kempen', value: 'Kempen'},
    ]

    const opt_status = [
        {label: 'Semua Transaksi', value: ''},
        {label: 'Sumbangan Berjaya', value: '1'},
        {label: 'Sumbangan Gagal', value: '3'},
        {label: 'Lain-lain', value: '4'},
    ]

    return (
        <div>
            <HomeBredCurbs title={`Maklumat Akaun Kredit Institusi - ${state.organizationName || state.organizationUsername}`} />

            <Dialog
            isShown={dialog}
            title="Pengesahan Kemaskini Maklumat Akaun Kredit"
            cancelLabel='Tutup'
            confirmLabel='Ya, Teruskan'
            onCancel={close_dialog}
            onConfirm={UpdateMaklumatKredit}
            onCloseComplete={close_dialog}
            >
                <div>
                    <p className='font-normal text-sm text-slate-600'>Anda pasti untuk mengemaskini maklumat akaun kredit institusi ini?</p>
                </div>
            </Dialog>

            <section>
                <Card title={"Maklumat Akaun Kredit"} subtitle={"Sila pastikan semua maklumat adalah tepat dan benar untuk membuat sebarang ubahsuai."}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <Textinput 
                        label={"No. Akaun Kredit"}
                        placeholder='Contoh: 98192831283'
                        defaultValue={kredit.organizationWalletAccountNumber}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Nama Pemilik"}
                        placeholder='Contoh: Zahari Azar'
                        defaultValue={kredit.organizationName || kredit.organizationUsername}
                        />
                    </div>
                    <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <InputGroup 
                        prepend={"RM"}
                        label={"Baki Semasa"}
                        placeholder='Contoh: 10.00'
                        defaultValue={Intl.NumberFormat("ms-MY", {style: 'decimal', minimumFractionDigits: 2}).format(kredit.organizationWalletBalance)}
                        onChange={e => {
                            set_kredit({...kredit, organizationWalletBalance: e.target.value})
                        }}
                        isNumberOnly
                        enableWhiteSpace={false}
                        disabled={true}
                        />
                        <InputGroup 
                        prepend={"RM"}
                        label={"Baki Apungan"}
                        placeholder='Contoh: 10.00'
                        defaultValue={Intl.NumberFormat("ms-MY", {style: 'decimal', minimumFractionDigits: 2}).format(kredit.organizationWalletFloat)}
                        onChange={e => {
                            set_kredit({...kredit, organizationWalletFloat: e.target.value})
                        }}
                        isNumberOnly
                        enableWhiteSpace={false}
                        disabled={true}
                        />
                    </div>
                </Card>
                <div className='mt-3 flex flex-row justify-end items-center'>
                    <Button onClick={open_dialog} icon={"heroicons:inbox-arrow-down"} text={"Kemaskini Akaun Kredit"} className='bg-teal-600 text-white' />
                </div>
            </section>

            <section className='mt-6'>
                <Card title={"Transaksi Akaun Kredit"} subtitle={"Klik pada senarai transaksi akaun kredit institusi di bawah untuk melihat maklumat terperinci."}>

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
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Jenis Transaksi --'
                            defaultValue={type}
                            onChange={e => set_type(e.target.value)}
                            options={opt_type}
                            />
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Status Transaksi --'
                            defaultValue={status}
                            onChange={e => set_status(e.target.value)}
                            options={opt_status}
                            />
                        </div>
                        <Select 
                        placeholder='-- Had Rekod --'
                        defaultValue={limit}
                        onChange={e => set_limit(e.target.value)}
                        options={[
                            {label: 10, value: 10},
                            {label: 20, value: 20},
                            {label: 30, value: 30},
                            {label: 50, value: 50},
                            {label: 100, value: 100}
                        ]}
                        />
                    </div>

                    <Table className='mt-6'>
                        <Table.Head>
                            <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                            <Table.HeaderCell>Nama Penyumbang</Table.HeaderCell>
                            <Table.HeaderCell>Emel Penyumbang</Table.HeaderCell>
                            <Table.HeaderCell>No. Rujukan Transaksi</Table.HeaderCell>
                            <Table.HeaderCell>Jenis Transaksi</Table.HeaderCell>
                            <Table.HeaderCell>Jumlah Transaksi (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Bayaran</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0} textAlign="center">Status</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={120} flexShrink={0} flexGrow={0}>Tindakan</Table.HeaderCell>
                        </Table.Head>
                        <Table.Body>
                            {
                                (loading) && (
                                    <tr>
                                        <td colSpan={9}>
                                            <Spinner size={30} />
                                        </td>
                                    </tr>
                                )
                            }
                            {
                                (!loading && transaksi.total === 0) && (
                                    <Table.Row flex={1} textAlign="center">
                                        <Table.Cell flex={1} fontSize="small" colSpan={9}>
                                            <td className='w-full'>
                                                Tiada senarai maklumat transaksi akaun kredit institusi buat masa ini.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && transaksi.total > 0) && transaksi.row.map((item, index) => (
                                    <Table.Row key={index} className='p-3' alignItems="center">
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        <Table.Cell fontSize="small">{item.billpayment_payorName}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.billpayment_payorEmail || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.billpayment_invoiceNo || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" alignSelf="center">
                                            {item.billpayment_type === "Infaq" && <Badge className='mx-auto bg-teal-50 border border-teal-100 text-teal-800'>Infaq Am</Badge>}
                                            {item.billpayment_type === "Kempen" && <Badge className='mx-auto bg-teal-50 border border-teal-100 text-teal-800'>Kempen</Badge>}
                                            {(item.billpayment_type === "Auto-infaq" || item.billpayment_type === "Auto-Infaq") && <Badge className='mx-auto bg-blue-50 border border-blue-100 text-blue-900'>Auto Infaq</Badge>}
                                            {item.billpayment_type === "Topup" && <Badge className='mx-auto bg-purple-50 border border-purple-100 text-purple-900'>Tambah Nilai</Badge>}
                                            {item.billpayment_type === "Pay" && <Badge className='mx-auto bg-lime-50 border border-lime-100 text-lime-900'>Bayaran Lain-lain</Badge>}
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", {style:'currency',currency:'myr'}).format(item.billpayment_amount)}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.billpayment_createdDate ? moment(item.billpayment_createdDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell fontSize="small">
                                            {item.billpayment_status == "1" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Transaksi Berjaya</Badge>}
                                            {item.billpayment_status == "2" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses</Badge>}
                                            {item.billpayment_status == "3" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pembayaran Gagal</Badge>}
                                            {item.billpayment_status == "4" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                        </Table.Cell>
                                        <Table.Cell flexBasis={120} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/maklumat-transaksi"} state={{ data: item }}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                    <Pane className='flex flex-row justify-center items-center p-6'>
                        <Pagination 
                        page={page}
                        onPageChange={set_page}
                        totalPages={transaksi.totalPages}
                        />
                    </Pane>
                </Card>
            </section>
        </div>
    );
}

export default MaklumatKreditInstitusi;