import Loading from '@/components/Loading'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icons from '@/components/ui/Icon'
import Select from '@/components/ui/Select'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { API, SYSADMIN_API } from '@/utils/api'
import { Pagination, Pane, SearchInput, Spinner, Table } from 'evergreen-ui'
import { debounce } from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function SenaraiTabungMasjid() {

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
    const [jenis, set_jenis]        = useState("")

    const getData = async (_search = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/tabung?page=${page}&limit=${limit}&search=${_search}&status=${status}&type=${jenis}`, {}, "GET", true)
            if(api.status_code === 200) {
                let {data} = api
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

    const debouncedSearch = useCallback(
        debounce((val) => getData(val), 1000),
        []
    );

    useEffect(() => {
        getData()
    }, [page, limit, status, jenis])

    //if(loading) return <Loading />

    return (
        <div>
            <div className="flex justify-between flex-wrap items-center mb-6">
                <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                    {`Senarai Maklumat Tabung Institusi`}
                </p>
                <div className='flex flex-row items-center gap-3'>
                    <Button 
                    icon={"heroicons:plus"} 
                    text={"Daftar Tabung"}
                    className='bg-teal-600 text-white'
                    />
                </div>
            </div>

            <section className='mt-6'>
                <Card title={"Senarai Tabung"} subtitle={"Klik pada senarai tabung di bawah untuk melihat maklumat terperinci."}>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-1'>
                            <Textinput 
                            className='w-[300px]'
                            defaultValue={search}
                            placeholder='Carian tabung masjid...'
                            onChange={e => {
                                set_search(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                            />
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Status Tabung --'
                            defaultValue={status}
                            onChange={e => set_status(e.target.value)}
                            options={[
                                {label: "Semua", value: ""},
                                {label: "Tabung Aktif", value: "1"},
                                {label: "Tabung Nyahaktif", value: "9"},
                            ]}
                            />
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Jenis Tabung --'
                            defaultValue={jenis}
                            onChange={e => set_jenis(e.target.value)}
                            options={[
                                {label: "Semua", value: ""},
                                {label: "Infaq", value: "Infaq"},
                                {label: "Wakaf", value: "Wakaf"},
                                {label: "Kempen", value: "Kempen"},
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
                            <Table.HeaderCell flexBasis={300} flexShrink={0} flexGrow={0}>Nama Institusi</Table.HeaderCell>
                            <Table.HeaderCell>Nama Tabung</Table.HeaderCell>
                            <Table.HeaderCell>Jenis Tabung</Table.HeaderCell>
                            <Table.HeaderCell>Baki Tabung</Table.HeaderCell>
                            <Table.HeaderCell>Baki Apungan Tabung</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Daftar</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0} textAlign="center">Status</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={120} flexShrink={0} flexGrow={0}>Tindakan</Table.HeaderCell>
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
                                            <td className='w-full'>
                                                Tiada senarai maklumat tabung buat masa ini.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index} className='p-3 flex items-center'>
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        <Table.Cell flexBasis={300} flexShrink={0} flexGrow={0} fontSize="small" className='line-clamp-1'>{item.organizationName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.tabungName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.tabungType || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", {style:'currency', currency:'MYR'}).format(item.tabungBalance)}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", {style:'currency', currency:'MYR'}).format(item.tabungFloat)}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.tabungCreatedDate ? moment(item.tabungCreatedDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0} fontSize="small">{
                                            item.tabungStatus == "1" ? 
                                            <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Tabng Aktif</Badge> : 
                                            <Badge className='bg-red-50 border border-red-100 text-red-900'>Tabung Nyahaktif</Badge>
                                        }</Table.Cell>
                                        <Table.Cell flexBasis={120} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/maklumat-tabung"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <Link to={"/pengurusan/maklumat-tabung"} state={item}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></Link>
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
                        totalPages={data.totalPages}
                        />
                    </Pane>
                </Card>
            </section>
        </div>
    )
}

export default SenaraiTabungMasjid