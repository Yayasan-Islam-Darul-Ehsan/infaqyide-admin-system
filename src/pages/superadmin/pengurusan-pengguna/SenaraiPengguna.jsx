import Loading from '@/components/Loading'
import Badge from '@/components/ui/Badge'
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

function SenaraiPengguna() {

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

    const getData = async (_search = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/pengguna?page=${page}&limit=${limit}&search=${_search}&status=${status}`, {}, "GET", true)
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
    }, [page, limit, status])

    //if(loading) return <Loading />

    return (
        <div>
            <HomeBredCurbs title={"Senarai Pengguna Berdaftar InfaqYIDE"} />

            <section className='mt-6'>
                <Card title={"Senarai Pengguna"} subtitle={"Klik pada senarai pengguna di bawah untuk melihat maklumat terperinci."}>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-1'>
                            <Textinput 
                            className='w-[300px]'
                            defaultValue={search}
                            placeholder='Carian pengguna infaqYIDE...'
                            onChange={e => {
                                set_search(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                            />
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Status Akaun --'
                            defaultValue={status}
                            onChange={e => set_status(e.target.value)}
                            options={[
                                {label: "Semua", value: ""},
                                {label: "Akaun Aktif", value: "1"},
                                {label: "Akaun Nyahaktif", value: "9"},
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
                            <Table.HeaderCell>Nama Pengguna</Table.HeaderCell>
                            <Table.HeaderCell>Nama Penuh Pengguna</Table.HeaderCell>
                            <Table.HeaderCell>E-mel Pengguna</Table.HeaderCell>
                            <Table.HeaderCell>No. Telefon</Table.HeaderCell>
                            <Table.HeaderCell>Status Pengecualian Cukai LHDN</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Daftar</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0} textAlign="center">Status Akaun</Table.HeaderCell>
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
                                                Tiada senarai maklumat pengguna.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{index + 1}.</Table.Cell>
                                        <Table.Cell fontSize="small">{item.account_username}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.account_fullname || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.account_email || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.account_phone || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{
                                            item.account_lhdn == "0" ? <Badge className='bg-slate-50 border border-slate-100 text-slate-900'>Tiada Pengecualian Cukai</Badge> : <Badge className='bg-blue-50 border border-blue-100 text-blue-900'>Pengecualian Cukai Aktif</Badge>
                                        }</Table.Cell>
                                        <Table.Cell fontSize="small">{moment(item.account_created_date).format("DD MMM YYYY, hh:mm A")}</Table.Cell>
                                        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0} fontSize="small">{
                                            item.account_verified == "2" ? <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Akaun Aktif</Badge> : <Badge className='bg-red-50 border border-red-100 text-red-900'>Akaun Nyahaktif</Badge>
                                        }</Table.Cell>
                                        <Table.Cell flexBasis={120} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/maklumat-pengguna"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <Link to={"/pengurusan/maklumat-pengguna"} state={item}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></Link>
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

export default SenaraiPengguna