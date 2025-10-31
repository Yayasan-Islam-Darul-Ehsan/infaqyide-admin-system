import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icons from '@/components/ui/Icon'
import Select from '@/components/ui/Select'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { SYSADMIN_API } from '@/utils/api'
import { Pagination, Pane, Spinner, Table } from 'evergreen-ui'
import { debounce } from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function PengurusanTransaksi2024() {

    const [data, set_data] = useState({
        row: [],
        total: 0,
        totalPages: 0
    })

    const [loading, set_loading]    = useState(true)
    const [page, set_page]          = useState(1)
    const [limit, set_limit]        = useState(10)
    const [search, set_search]      = useState("")
    const [status, set_status]      = useState("")
    const [year, set_year] 			= useState("2024")

    const getData = async (_search = "", _year = year, _status = status) => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/transaksi?page=${page}&limit=${limit}&search=${_search}&status=${_status}&year=${_year}`, {}, "GET", true)
            if(api.status_code === 200) {
                let { data } = api
                set_data({
                    row: data.row,
                    total: data.total,
                    totalPages: data.totalPages
                })
            }   
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pengkalan data. Sila hubungi sistem pentadbir anda.")
        } finally {
            set_loading(false)
        }
    }

    const getExcel = async () => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`excel-laporan-transaksi?year=${year}`, {}, "GET")
            if(api.status_code === 200) {
                window.location.href = api.data
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
        debounce((val, year, status) => {
            getData(val, year, status), 1000
        }),
        []
    );

    useEffect(() => {
        getData()
    }, [page, limit, status, year])
    
    return (
        <div>
            <HomeBredCurbs title={`Senarai Transaksi Sumbangan InfaqYIDE - Tahun ${year}`} />

            <section className='mt-6'>
                <Card 
                    title={"Senarai Transaksi"} 
                    subtitle={"Klik pada senarai transaksi di bawah untuk melihat maklumat terperinci."}
                    headerslot={(
                        <Button 
                        className='bg-green-600 text-white'
                        onClick={getExcel}
                        text={"Muat Turun Excel"}
                        icon={'heroicons:arrow-down-tray'}
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
                                debouncedSearch(e.target.value, year, status)
                            }}
                            />
                            {/* <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Tahun Rekod --'
                            defaultValue={year}
                            onChange={e => set_year(e.target.value)}
                            
                            options={getListYear()}
                            /> */}
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Status Transaksi --'
                            defaultValue={status}
                            onChange={e => set_status(e.target.value)}
                            // options={[
                            //     {label: "2022", value: "2022"},
                            //     {label: "2023", value: "2023"},
                            //     {label: "2024", value: "2024"},
                            // 	{label: "2025", value: "2025"},
                            // 	{label: "2026", value: "2026"},
                            // ]}
                            options={[
                                {label: 'Berjaya', value: '1'},
                                {label: 'Sedang Diproses', value: '2'},
                                {label: 'Transaksi Gagal', value: '3'},
                                {label: 'Lain-lain', value: '4'}
                            ]}
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
                            <Table.HeaderCell>Jenis Transaksi</Table.HeaderCell>
                            <Table.HeaderCell>No. Transaksi</Table.HeaderCell>
                            <Table.HeaderCell>Jumlah Transaksi (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Nama Pembayar</Table.HeaderCell>
                            <Table.HeaderCell>E-Mel Pembayar</Table.HeaderCell>
                            <Table.HeaderCell>No. Telefon Pembayar</Table.HeaderCell>
                            <Table.HeaderCell>Status Transaksi</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Transaksi</Table.HeaderCell>
                            {/* <Table.HeaderCell flexBasis={120} flexShrink={0} flexGrow={0}>Tindakan</Table.HeaderCell> */}
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
                                (!loading && data.total === 0) && (
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
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        <Table.Cell fontSize="small">
                                            {item.billpayment_type === "Infaq" && <Badge className='bg-teal-50 border border-teal-100 text-teal-900'>Infaq Am</Badge>}
                                            {(item.billpayment_type === "Auto-infaq" || item.billpayment_type === "Auto-Infaq" ) && <Badge className='bg-blue-50 border border-blue-100 text-blue-900'>Auto Infaq</Badge>}
                                            {item.billpayment_type === "Topup" && <Badge className='bg-purple-50 border border-purple-100 text-purple-900'>Tambah Nilai</Badge>}
                                            {item.billpayment_type === "Kempen" && <Badge className='bg-orange-50 border border-orange-100 text-orange-900'>Kempen</Badge>}
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{item.billpayment_invoiceNo}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR"}).format(item.billpayment_amount)}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.billpayment_payorName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.billpayment_payorEmail || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.billpayment_payorPhone || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">
                                            {item.billpayment_status == "1" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Transaksi Berjaya</Badge>}
                                            {item.billpayment_status == "2" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-600'>Dalam Proses</Badge>}
                                            {item.billpayment_status == "3" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pembayaran Gagal</Badge>}
                                            {item.billpayment_status == "4" && <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Lain-Lain Status</Badge>}
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{moment(item.billpayment_createdDate).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                        {/* <Table.Cell flexBasis={120} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/maklumat-transaksi"} state={{year, data:item }}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <Link to={"/pengurusan/maklumat-transaksi"} state={{year, data:item }}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></Link>
                                            </div>
                                        </Table.Cell> */}
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                    <Pane className='flex flex-row justify-center items-center p-6'>
                        <Pagination 
                        page={page}
                        onPageChange={set_page}
                        totalPages={data.totalPages}
                        />
                    </Pane>
                </Card>
            </section>
        </div>
    )
}

export default PengurusanTransaksi2024