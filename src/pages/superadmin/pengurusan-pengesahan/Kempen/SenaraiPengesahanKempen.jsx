import Loading from '@/components/Loading'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icons from '@/components/ui/Icon'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Textinput from '@/components/ui/Textinput'
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs'
import { API, SYSADMIN_API } from '@/utils/api'
import { Pagination, Pane, SearchInput, Spinner, Table } from 'evergreen-ui'
import { debounce } from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function SenaraiPengesahanKempen() {

    const navigate = useNavigate()
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
            let api = await SYSADMIN_API(`pengurusan/kempen/pengesahan?page=${page}&limit=${limit}&status=${status}&search=${_search}`, {}, "GET", true)
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

    const [modal_loading, set_modal_loading] = useState(true)
    const [modal_comment, set_modal_comment] = useState(false)
    const [comment, set_comment] = useState({
        campaignId: "",
        organizationId: "",
        approvalTitle: "",
        approvalDescription: "",
        approvalStatus: ""
    })

    const createComment = async () => {
        let json = comment
        //close_modal()
        set_modal_loading(true)
        try {
            let api = await SYSADMIN_API("pengesahan/kempen", comment, "POST")
            close_modal()
            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                toast.error(api.message)
            }
        } catch (error) {
            toast.error("Harap maaf! Terdapat masalah teknikal untuk membuat komen pengesahan kempen anda.")
        } finally {
            set_modal_loading(false)
        }
    }

    const open_modal = (item) => {
        console.log("Log Item : ", item)
        set_comment({
            ...comment,
            campaignId: item.campaignId,
            organizationId: item.organizationId,
        })
        setTimeout(() => {
            set_modal_comment(true)
            set_modal_loading(false)
        }, 500);
    }

    const close_modal = () => {
        set_comment({
            campaignId: "",
            organizationId: "",
            approvalTitle: "",
            approvalDescription: "",
            approvalStatus: ""
        })
        set_modal_comment(false)
    }


    useEffect(() => {
        getData()
    }, [page, limit, status, jenis])

    //if(loading) return <Loading />

    return (
        <div>

            <Modal
            title='Komplen Pengesahan Kempen'
            themeClass='bg-teal-600 text-white'
            activeModal={modal_comment}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Batal</Button>
                    <Button className='bg-teal-600 text-white' onClick={createComment}>Komen Pengesahan</Button>
                </div>
                </>
            )}
            >
                <div>
                    {
                        modal_loading ? 
                        (
                            <>
                            <div className='flex justify-center items-center'>
                                <Spinner />
                            </div>
                            </>
                        ) :
                        (
                            <>
                            <div>
                                <Card 
                                    title={`Komplen Pengesahan Kempen`} 
                                    subtitle={`Sila isi ruangan komplen pengesahan kempen anda di bawah.`}
                                >
                                    <div className='grid grid-col-1 md:grid-cols-2 gap-3'>
                                        <Textinput 
                                        label={"ID Kempen"}
                                        placeholder='Contoh: 1234'
                                        defaultValue={comment.campaignId}
                                        disabled={true}
                                        />
                                        <Textinput 
                                        label={"ID Institusi"}
                                        placeholder='Contoh: 12'
                                        defaultValue={comment.organizationId}
                                        disabled={true}
                                        />
                                    </div>

                                    <div className='mt-3 space-y-3'>
                                        <Select 
                                        label={"Jenis Komen"}
                                        placeholder='Contoh: Maklumat kempen tidak lengkap'
                                        defaultValue={comment.approvalTitle}
                                        options={[
                                            { label: 'Kempen Sah', value: 'Kempen Sah' },
                                            { label: 'Maklumat Tidak Lengkap', value: 'Maklumat Tidak Lengkap' },
                                            { label: 'Tiada Gambar Kempen', value: 'Tiada Gambar Kempen' },
                                            { label: 'Tidak Patuh Shariah', value: 'Tidak Patuh Shariah' },
                                            { label: 'Melebihi Had Dana Dikumpul', value: 'Melebihi Had Dana Dikumpul' },
                                            { label: 'Tidak Patuh Syarat Kempen', value: 'Tidak Patuh Syarat Kempen' },
                                            { label: 'Institusi Tidak Sah', value: 'Institusi Tidak Sah' },
                                            { label: 'Kempen Tidak Sah', value: 'Kempen Tidak Sah' },
                                            { label: 'Lain-lain', value: 'Lain-lain' },
                                        ]}
                                        onChange={e => set_comment({...comment, approvalTitle: e.target.value})}
                                        />

                                        <Textarea 
                                        label={"Keterangan Komen"}
                                        placeholder={"Contoh: Kempen ini tidak mematuhi syarat yang telah ditetapkan oleh pihak pengurusan Yayasan Islam Darul Ehsan."}
                                        dvalue={comment.approvalDescription}
                                        onChange={e => set_comment({...comment, approvalDescription: e.target.value})}
                                        />

                                        <Select 
                                        label={"Status Pengesahan"}
                                        placeholder='Contoh: Ditolak'
                                        defaultValue={comment.approvalStatus}
                                        options={[
                                            { label: 'Lulus Pengesahan', value: 'Approved' },
                                            { label: 'Pengesahan Ditolak', value: 'Rejected' },
                                            { label: 'Lain-lain', value: 'Others' },
                                        ]}
                                        onChange={e => set_comment({...comment, approvalStatus: e.target.value})}
                                        />

                                    </div>
                                </Card>
                            </div>
                            </>
                        )
                    }
                </div>
            </Modal>

            <div className="flex justify-between flex-wrap items-center mb-6">
                <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                    {`Senarai Pengesahan Kempen Institusi`}
                </p>
            </div>

            <section className='mt-6'>
                <Card title={"Senarai Kempen"} subtitle={"Klik pada senarai kempen di bawah untuk melihat maklumat terperinci."}>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-1'>
                            <Textinput 
                            className='w-[300px]'
                            defaultValue={search}
                            placeholder='Carian kempen masjid...'
                            onChange={e => {
                                set_search(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                            />
                            <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Status Kempen --'
                            defaultValue={status}
                            onChange={e => set_status(e.target.value)}
                            options={[
                                {label: "Semua", value: ""},
                                {label: "Nyahaktif", value: "INACTIVE"},
                                {label: "Dalam Proses Pengesahan", value: "PENDING"},
                                {label: "Kempen Khas", value: "PRIVATE"},
                                {label: "Pengesahan Ditolak", value: "REJECTED"},
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
                            {/* <Table.HeaderCell flexBasis={300} flexShrink={0} flexGrow={0}>Nama Institusi</Table.HeaderCell> */}
                            <Table.HeaderCell flexBasis={350} flexShrink={0} flexGrow={0}>Nama Kempen</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Mula</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Tamat</Table.HeaderCell>
                            <Table.HeaderCell>Jumlah Sasaran (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Jumlah Terkumpul (RM)</Table.HeaderCell>
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
                                                Tiada senarai maklumat kempen buat masa ini.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index} className='p-3 flex items-center'>
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        {/* <Table.Cell flexBasis={300} flexShrink={0} flexGrow={0} fontSize="small" className='line-clamp-1'>{item.organizationName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell> */}
                                        <Table.Cell flexBasis={350} flexShrink={0} flexGrow={0} fontSize="small" className='line-clamp-1'>{item.campaignTitle || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.campaignDateStart ? moment(item.campaignDateStart).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.campaignDeadline ? moment(item.campaignDeadline).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", {style:'currency', currency:'MYR'}).format(item.campaignTarget)}</Table.Cell>
                                        <Table.Cell fontSize="small">{Intl.NumberFormat("ms-MY", {style:'currency', currency:'MYR'}).format(item.campaignCollection)}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.campaignCreatedDate ? moment(item.campaignCreatedDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0} fontSize="small">
                                            {item.campaignStatus == "ACTIVE" && <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Kempen Aktif</Badge>}
                                            {item.campaignStatus == "INACTIVE" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Kempen Nyahaktif</Badge>}
                                            {item.campaignStatus == "REJECTED" && <Badge className='bg-red-50 border border-red-100 text-red-900'>Pengesahan Ditolak</Badge>}
                                            {item.campaignStatus == "PENDING" && <Badge className='bg-yellow-50 border border-yellow-100 text-yellow-900'>Dalam Pengesahan</Badge>}
                                            {item.campaignStatus == "PRIVATE" && <Badge className='bg-purple-50 border border-purple-100 text-purple-900'>Kempen Khas</Badge>}
                                        </Table.Cell>
                                        <Table.Cell flex="1" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center'>
                                                <Button className='text-lg' onClick={() => open_modal(item)}>
                                                    <Icons icon={"heroicons-outline:eye"} className={"text-blue-600"} />
                                                </Button>
                                                <Link to={"/pengurusan/maklumat-kempen"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                {/* <Link to={"/pengurusan/maklumat-kempen"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <Link to={"/pengurusan/maklumat-kempen"} state={item}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></Link> */}
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

export default SenaraiPengesahanKempen