import React, { useEffect, useState } from 'react';
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

MaklumatKreditPengguna.propTypes = {
    
};

function MaklumatKreditPengguna(props) {

    const navigate      = useNavigate()
    const { state }     = useLocation()

    const [loading, set_loading]    = useState(true)
    const [loading2, set_loading2]  = useState(true)
    const [akaun_id, set_akaun_id]  = useState(state.credit_account_id || null)
    const [kredit, set_kredit]      = useState(null)

    const [transaksi, set_transaksi]    = useState({row: [], total: 0, totalPages: 0})
    const [page, set_page]              = useState(1)
    const [limit, set_limit]            = useState(10)
    const [search, set_search]          = useState("")

    const [dialog, set_dialog]  = useState(false)
    const open_dialog           = () => set_dialog(true)
    const close_dialog          = () => set_dialog(false)

    const getData = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kredit/pengguna/${akaun_id}`, {}, "GET", true)   
            if(api.status_code === 200) {
                set_kredit(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk memperoleh maklumat akaun kredit pengguna.")
        } finally {
            set_loading(false)
        }
    }

    const getTransaction = async () => {
        set_loading2(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kredit/pengguna/${akaun_id}/transaction?page=${page}&limit=${limit}`, {}, "GET", true)   
            if(api.status_code === 200) {
                set_transaksi(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data untuk memperoleh maklumat transaksi akaun kredit pengguna.")
        } finally {
            set_loading2(false)
        }
    }

    const UpdateMaklumatKredit = async () => {
        close_dialog()
        set_loading(true)

        try {
            let json = {
                credit_account_id: kredit.credit_account_id,
                credit_account_balance: kredit.credit_account_balance,
                credit_account_float: kredit.credit_account_float
            }
            let api = await SYSADMIN_API(`pengurusan/kredit/pengguna/${akaun_id}`, json, "PATCH", true)
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
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

    useEffect(() => {
        getTransaction()
    }, [page, limit])

    if(loading) return <Loading />

    return (
        <div>
            <HomeBredCurbs title={`Maklumat Akaun Kredit Pengguna - ${state.account_fullname || state.account_username}`} />

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
                    <p className='font-normal text-sm text-slate-600'>Anda pasti untuk mengemaskini maklumat akaun kredit pengguna ini?</p>
                </div>
            </Dialog>

            <section>
                <Card title={"Maklumat Akaun Kredit"} subtitle={"Sila pastikan semua maklumat adalah tepat dan benar untuk membuat sebarang ubahsuai."}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <Textinput 
                        label={"No. Akaun Kredit"}
                        placeholder='Contoh: 98192831283'
                        defaultValue={kredit.credit_account_no}
                        disabled={true}
                        />
                        <Textinput 
                        label={"Nama Pemilik"}
                        placeholder='Contoh: Zahari Azar'
                        defaultValue={kredit.account_fullname || kredit.account_username}
                        />
                    </div>
                    <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <InputGroup 
                        prepend={"RM"}
                        label={"Baki Semasa"}
                        placeholder='Contoh: 10.00'
                        defaultValue={Intl.NumberFormat("ms-MY", {style: 'decimal', minimumFractionDigits: 2}).format(kredit.credit_account_balance)}
                        onChange={e => {
                            set_kredit({...kredit, credit_account_balance: e.target.value})
                        }}
                        isNumberOnly
                        enableWhiteSpace={false}
                        />
                        <InputGroup 
                        prepend={"RM"}
                        label={"Baki Apungan"}
                        placeholder='Contoh: 10.00'
                        defaultValue={Intl.NumberFormat("ms-MY", {style: 'decimal', minimumFractionDigits: 2}).format(kredit.credit_account_float)}
                        onChange={e => {
                            set_kredit({...kredit, credit_account_float: e.target.value})
                        }}
                        isNumberOnly
                        enableWhiteSpace={false}
                        />
                    </div>
                </Card>
                <div className='mt-3 flex flex-row justify-end items-center'>
                    <Button onClick={open_dialog} icon={"heroicons:inbox-arrow-down"} text={"Kemaskini Akaun Kredit"} className='bg-teal-600 text-white' />
                </div>
            </section>

            <section className='mt-6'>
                <Card title={"Transaksi Akaun Kredit"} subtitle={"Klik pada senarai transaksi akaun kredit pengguna di bawah untuk melihat maklumat terperinci."}>
                    <Table className='mt-6'>
                        <Table.Head>
                            <Table.HeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>Bil.</Table.HeaderCell>
                            <Table.HeaderCell>Nama Pengguna</Table.HeaderCell>
                            <Table.HeaderCell>Nama Institusi</Table.HeaderCell>
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
                                                Tiada senarai maklumat transaksi akaun kredit pengguna buat masa ini.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && transaksi.total > 0) && transaksi.row.map((item, index) => (
                                    <Table.Row key={index} className='p-3' alignItems="center">
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        <Table.Cell fontSize="small">{item.account_username}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.organizationName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.creditTransInvoiceNo || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" alignSelf="center">
											{item.creditTransType === "Infaq" && <Badge className='mx-auto bg-teal-50 border border-teal-100 text-teal-900'>Infaq Am</Badge>}
											{item.creditTransType === "Auto-infaq" && <Badge className='mx-auto bg-blue-50 border border-blue-100 text-blue-900'>Auto Infaq</Badge>}
											{item.creditTransType === "Topup" && <Badge className='mx-auto bg-purple-50 border border-purple-100 text-purple-900'>Tambah Nilai</Badge>}
                                            {item.creditTransType === "Pay" && <Badge className='mx-auto bg-lime-50 border border-lime-100 text-lime-900'>Bayaran Lain-lain</Badge>}
										</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", {style:'currency',currency:'myr'}).format(item.creditTransAmount)}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.creditTransCreatedDate ? moment(item.creditTransCreatedDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell fontSize="small">
											{item.creditTransStatus == "1" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Transaksi Berjaya</Badge>}
											{item.creditTransStatus == "2" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses</Badge>}
											{item.creditTransStatus == "3" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pembayaran Gagal</Badge>}
											{item.creditTransStatus == "4" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
										</Table.Cell>
                                        <Table.Cell flexBasis={120} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/akaun-kredit/maklumat-kredit-pengguna"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <Link to={"/pengurusan/akaun-kredit/maklumat-kredit-pengguna"} state={item}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></Link>
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

export default MaklumatKreditPengguna;