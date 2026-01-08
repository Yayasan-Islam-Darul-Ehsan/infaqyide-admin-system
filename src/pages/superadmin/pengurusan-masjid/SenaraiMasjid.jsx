import Loading from '@/components/Loading'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icons from '@/components/ui/Icon'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { API, SYSADMIN_API } from '@/utils/api'
import { Pagination, Pane, SearchInput, Spinner, Table } from 'evergreen-ui'
import { debounce } from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { toast } from 'react-toastify'

function SenaraiMasjid() {

    const navigate = useNavigate()

    const [data, set_data] = useState({ row: [], total: 0, totalPages: 0})
    const [loading, set_loading]    = useState(true)
    const [page, set_page]          = useState(1)
    const [limit, set_limit]        = useState(10)
    const [search, set_search]      = useState("")
    const [status, set_status]      = useState("")

    const [selectedData, setSelectedData] = useState("")


    const debouncedSearch = useCallback(
        debounce((val) => getData(val), 1000),
        []
    );

    useEffect(() => {
        getData()
    }, [page, limit, status])

    const [modal, set_modal] = useState(false)

    const open_modal = (masjid_id) => {
        setSelectedData(masjid_id)
        set_modal(true)
    }

    const close_modal = () => {
        setSelectedData("")
        set_modal(false)
    }

    const getData = async (_search = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/institusi?page=${page}&limit=${limit}&search=${_search}&status=${status}`, {}, "GET", true)
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

    const deleteData = async (masjid_id) => {
        set_modal(false)
        set_loading(true)

        if(!masjid_id) return

        try {
            let api = await SYSADMIN_API(`pengurusan/institusi/${masjid_id}`, {}, "DELETE", true)
            set_loading(false)
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Ralat! Terdapat masalah teknikal untuk memadam akaun institusi")
        }
    }

    //if(loading) return <Loading />

    return (
        <div>
            
            <Modal
            title='Pengesahan Memadam Akaun Institusi'
            themeClass='bg-red-600 text-white'
            centered={true}
            activeModal={modal}
            onClose={close_modal}
            footerContent={<>
            <div className='flex justify-end items-center gap-3'>
                <Button className='text-sm' text={"Tutup"} onClick={close_modal} />
                <Button className='text-sm bg-red-600 text-white' text={"Ya, Teruskan"} onClick={() => deleteData(selectedData)}/>    
            </div>
            </>}
            >
                <div>
                    <p className='text-sm text-slate-600'>Anda pasti untuk nyahaktif dan padam akaun institusi ini? Tindakan ini tidak boleh dikembalikan.</p>
                </div>
            </Modal>

            <div className="flex justify-between flex-wrap items-center mb-6">
                <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                    {`Senarai Maklumat Institusi Berdaftar`}
                </p>
                <div className='flex flex-row items-center gap-3'>
                    <Button 
                    icon={"heroicons:plus"} 
                    text={"Daftar Institusi"}
                    className='bg-teal-600 text-white'
                    onClick={() => navigate("/pengurusan/daftar-institusi")}
                    />
                </div>
            </div>

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
                                {label: "Akaun Aktif", value: "ACTIVE"},
                                {label: "Akaun Nyahaktif", value: "INACTIVE"},
                                {label: "Pengesahan Ditolak", value: "REJECTED"}
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
                            {/* <Table.HeaderCell>Logo Institusi</Table.HeaderCell> */}
                            {/* <Table.HeaderCell>Nama Institusi</Table.HeaderCell> */}
                            <Table.HeaderCell flexBasis={350} flexShrink={0} flexGrow={0}>Nama Penuh Institusi</Table.HeaderCell>
                            <Table.HeaderCell>Kod Institusi</Table.HeaderCell>
                            <Table.HeaderCell>E-mel Institusi</Table.HeaderCell>
                            <Table.HeaderCell>No. Tel Institusi</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Daftar</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0} textAlign="center">Status</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={70} flexShrink={0} flexGrow={0}>Tindakan</Table.HeaderCell>
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
                                                Tiada senarai maklumat institusi buat masa ini.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index} className='p-3 flex items-center'>
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        {/* <Table.Cell fontSize="small">
                                            <img src={item.organizationImage} alt="" className='w-12 h-12 rounded-full shadow-lg'/>
                                        </Table.Cell> */}
                                        {/* <Table.Cell fontSize="small">{item.organizationUsername || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell> */}
                                        <Table.Cell flexBasis={350} flexShrink={0} flexGrow={0} fontSize="small" className='line-clamp-1'>{item.organizationName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.organizationCode || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationEmail || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationPhone || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationCreatedDate ? moment(item.organizationCreatedDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0} fontSize="small">{
                                            item.organizationStatus == "ACTIVE" ? 
                                            <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Akaun Aktif</Badge> : 
                                            <Badge className='bg-red-50 border border-red-100 text-red-900'>Akaun Nyahaktif</Badge>
                                        }</Table.Cell>
                                        <Table.Cell flexBasis={70} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/maklumat-institusi"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <button onClick={() => open_modal(item.organizationId)}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></button>
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

export default SenaraiMasjid