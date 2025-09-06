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
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { toast } from 'react-toastify'

function SenaraiPengesahanInstitusi() {

    const navigate = useNavigate()

    const [data, set_data] = useState({ row: [], total: 0, totalPages: 0})
    const [loading, set_loading]    = useState(true)
    const [page, set_page]          = useState(1)
    const [limit, set_limit]        = useState(10)
    const [search, set_search]      = useState("")
    const [status, set_status]      = useState("")

    const getData = async (_search = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/institusi/pengesahan?page=${page}&limit=${limit}&search=${_search}&status=${status}`, {}, "GET", true)
            if(api.status_code === 200) {
                let {data} = api
                set_data({
                    row: data.row,
                    total: data.total,
                    totalPages: data.totalPages
                })
            }   
        } catch (e) {
            console.log(e)
            toast.error("Harap maaf! Terdapat masalah pada pengkalan data. Sila hubungi sistem pentadbir anda.")
        } finally {
            set_loading(false)
        }
    }

    const debouncedSearch = useCallback(
        debounce((val) => getData(val), 1000),
        []
    );

    const [modal_loading, set_modal_loading]    = useState(true)
    const [modal_comment, set_modal_comment]    = useState(false)
    const [comment, set_comment]                = useState({
        organizationId: "",
        approvalTitle: "",
        approvalDescription: "",
        approvalStatus: ""
    })

    const createComment = async () => {
        //close_modal()
        set_modal_loading(true)
        try {
            let api = await SYSADMIN_API("pengesahan/institusi", comment, "POST")
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
            organizationId: item.organizationId,
        })
        setTimeout(() => {
            set_modal_comment(true)
            set_modal_loading(false)
        }, 500);
    }

    const close_modal = () => {
        set_comment({
            organizationId: "",
            approvalTitle: "",
            approvalDescription: "",
            approvalStatus: ""
        })
        set_modal_comment(false)
    }

    useEffect(() => {
        getData()
    }, [page, limit, status])

    //if(loading) return <Loading />

    return (
        <div>
            <Modal
            title='Komplen Pengesahan Institusi'
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
                                    title={`Komplen Pengesahan Institusi`} 
                                    subtitle={`Sila isi ruangan komplen pengesahan institusi anda di bawah.`}
                                >
                                    <div className='grid grid-col-1'>
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
                                        placeholder='Contoh: Maklumat institusi tidak lengkap'
                                        defaultValue={comment.approvalTitle}
                                        options={[
                                            { label: 'Institusi Sah', value: 'Institusi Sah' },
                                            { label: 'Maklumat Tidak Lengkap', value: 'Maklumat Tidak Lengkap' },
                                            { label: 'Tiada Gambar Institusi', value: 'Tiada Gambar Institusi' },
                                            { label: 'Tidak Patuh Shariah', value: 'Tidak Patuh Shariah' },
                                            { label: 'Tidak Patuh Syarat Institusi', value: 'Tidak Patuh Syarat Institusi' },
                                            { label: 'Institusi Tidak Sah', value: 'Institusi Tidak Sah' },
                                            { label: 'Lain-lain', value: 'Lain-lain' },
                                        ]}
                                        onChange={e => set_comment({...comment, approvalTitle: e.target.value})}
                                        />

                                        <Textarea 
                                        label={"Keterangan Komen"}
                                        placeholder={"Contoh: Institusi ini tidak mematuhi syarat yang telah ditetapkan oleh pihak pengurusan Yayasan Islam Darul Ehsan."}
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
                            <Table.HeaderCell flexBasis={200}>Nama Penuh Institusi</Table.HeaderCell>
                            <Table.HeaderCell>Jenis Institusi</Table.HeaderCell>
                            <Table.HeaderCell>E-mel Institusi</Table.HeaderCell>
                            <Table.HeaderCell>No. Tel Institusi</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Daftar</Table.HeaderCell>
                            <Table.HeaderCell flexBasis={150} flexShrink={0} flexGrow={0} textAlign="center">Status</Table.HeaderCell>
                            <Table.HeaderCell >Tindakan</Table.HeaderCell>
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
                                        <Table.Cell flexBasis={200} fontSize="small" textAlign="left" justifyContent="start" alignItems="center" flexDirection="column">
                                            <p>{item.organizationName || <span className='text-red-600'>-- tiada maklumat --</span>}</p>
                                            <p className='text-xs text-slate-500'>{item.organizationCode.toLowerCase()}</p>
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{item.referenceTitle || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationEmail || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationPhone || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationCreatedDate ? moment(item.organizationCreatedDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0} fontSize="small">{
                                            item.organizationStatus == "ACTIVE" ? 
                                            <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Akaun Aktif</Badge> : 
                                            <Badge className='bg-red-50 border border-red-100 text-red-900'>Akaun Nyahaktif</Badge>
                                        }</Table.Cell>
                                        <Table.Cell>
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Button className='text-lg' onClick={() => open_modal(item)}>
                                                    <Icons icon={"heroicons-outline:eye"} className={"text-blue-600"} />
                                                </Button>
                                                <Link to={"/pengurusan/maklumat-institusi"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
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

export default SenaraiPengesahanInstitusi