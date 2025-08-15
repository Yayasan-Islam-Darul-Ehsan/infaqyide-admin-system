import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import { toast } from 'react-toastify';
import { SYSADMIN_API } from '@/utils/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Select from '@/components/ui/Select';
import { debounce } from 'lodash';
import { Pagination, Pane, Spinner, Table } from 'evergreen-ui';
import Badge from '@/components/ui/Badge';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Icons from '@/components/ui/Icon';

KreditInstitusi.propTypes = {
    
};

function KreditInstitusi(props) {

    const [loading, set_loading]    = useState(true)
    const [data, set_data]          = useState({ row: [], total: 0, totalPages: 0})
    const [page, set_page]          = useState(1)
    const [limit, set_limit]        = useState(10)
    const [search, set_search]      = useState("")

    const getData = async (string = "") => {
        set_loading(true)
        try {
            let api = await SYSADMIN_API(`pengurusan/kredit/institusi?page=${page}&limit=${limit}&search=${string}`, {}, "GET", true)
            if(api.status_code == 200) {
                set_data(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! Terdapat masalah pada pangkalan data. Sila hubungi pentadbir sistem anda.")
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
    }, [page, limit])

    return (
        <div>
            <section>
                <div className="flex justify-between flex-wrap items-center mb-6">
                    <p className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                        {`Senarai Maklumat Akaun Kredit Institusi InfaqYIDE`}
                    </p>
                    <div className='flex flex-row items-center gap-3'>
                        <Button 
                        icon={"heroicons:plus"} 
                        text={"Tambah Akaun Kredit"}
                        className='bg-teal-600 text-white'
                        />
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card title={"Senarai Akaun Kredit Institusi"} subtitle={"Klik pada senarai akaun kredit Institusi di bawah untuk melihat maklumat terperinci."}>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-1'>
                            <Textinput 
                            className='w-[300px]'
                            defaultValue={search}
                            placeholder='Carian akaun kredit...'
                            onChange={e => {
                                set_search(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                            />
                            {/* <Select 
                             className='w-[200px] text-center'
                            placeholder='-- Status Akaun --'
                            defaultValue={status}
                            onChange={e => set_status(e.target.value)}
                            options={[
                                {label: "Semua", value: ""},
                                {label: "Akaun Aktif", value: "1"},
                                {label: "Akaun Nyahaktif", value: "9"},
                            ]}
                            /> */}
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
                            {/* <Table.HeaderCell>Nama Institusi</Table.HeaderCell> */}
                            <Table.HeaderCell flexBasis={350} flexShrink={0} flexGrow={0}>Nama Penuh Institusi</Table.HeaderCell>
                            <Table.HeaderCell>No. Akaun Kredit</Table.HeaderCell>
                            <Table.HeaderCell>Baki Terkini (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Baki Apungan (RM)</Table.HeaderCell>
                            <Table.HeaderCell>Tarikh Daftar</Table.HeaderCell>
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
                                (!loading && data.total === 0) && (
                                    <Table.Row flex={1} textAlign="center">
                                        <Table.Cell flex={1} fontSize="small" colSpan={9}>
                                            <td className='w-full'>
                                                Tiada senarai maklumat akaun kredit institusi buat masa ini.
                                            </td>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {
                                (!loading && data.total > 0) && data.row.map((item, index) => (
                                    <Table.Row key={index} className='p-3' alignItems="center">
                                        <Table.Cell flexBasis={50} flexShrink={0} flexGrow={0} fontSize="small">{(page - 1) * limit + index + 1}.</Table.Cell>
                                        {/* <Table.Cell fontSize="small">{item.organizationUsername}</Table.Cell> */}
                                        <Table.Cell flexBasis={350} flexShrink={0} flexGrow={0} fontSize="small" className='line-clamp-1'>{item.organizationName || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" className='line-clamp-1'>{item.organizationWalletAccountNumber || <span className='text-red-600'>-- tiada maklumat --</span>}</Table.Cell>
                                        <Table.Cell fontSize="small" flex="1">
                                            <p className='mx-auto'>{Intl.NumberFormat("ms-MY", {style:'currency',currency:'myr'}).format(item.organizationWalletBalance)}</p>
                                        </Table.Cell>
                                        <Table.Cell fontSize="small" flex="1">
                                            <p className='mx-auto'>{Intl.NumberFormat("ms-MY", {style:'currency',currency:'myr'}).format(item.organizationWalletFloat)}</p>
                                        </Table.Cell>
                                        <Table.Cell fontSize="small">{item.organizationWalletCreatedDate ? moment(item.organizationWalletCreatedDate).format("DD MMM YYYY, hh:mm A") : "--"}</Table.Cell>
                                        <Table.Cell flexBasis={150} flexShrink={0} flexGrow={0} fontSize="small">{
                                            item.organizationWalletStatus == "1" ? 
                                            <Badge className='bg-emerald-50 border border-emerald-100 text-emerald-900'>Akaun Aktif</Badge> : 
                                            <Badge className='bg-red-50 border border-red-100 text-red-900'>Akaun Nyahaktif</Badge>
                                        }</Table.Cell>
                                        <Table.Cell flexBasis={120} flexShrink={0} flexGrow={0} fontSize="larger" textAlign="center" justifyItems="center" alignItems="center">
                                            <div className='flex flex-row justify-center items-center gap-1'>
                                                <Link to={"/pengurusan/akaun-kredit/maklumat-kredit-institusi"} state={item}><Icons icon={"heroicons-outline:pencil-square"} className={"text-yellow-500"} /></Link>
                                                <Link to={"/pengurusan/akaun-kredit/maklumat-kredit-institusi"} state={item}><Icons icon={"heroicons-outline:trash"} className={"text-red-600"} /></Link>
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
    );
}

export default KreditInstitusi;