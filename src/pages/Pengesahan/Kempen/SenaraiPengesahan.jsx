import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API } from '@/utils/api';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import { Pagination } from 'evergreen-ui';
import Select from '@/components/ui/Select';
import moment from 'moment';

function KomenPengesahanKempen(props) {
    const [loading, set_loading]    = useState(true)
    const [setting, set_setting]    = useState({ page: 1, limit: 10 })
    const [metadata, set_metadata]  = useState({ row: [], total: 0, totalPages: 0})

    const [modal, set_modal]        = useState(false)
    const open_modal                = () => set_modal(true)
    const close_modal               = () => set_modal(false)

    const getData = async () => {
        set_loading(true)
        try {
            let api = await API(`v2/pengesahan/kempen?page=${setting.page}&limit=${setting.limit}`, {}, "GET", true)
            if(api.status_code === 200) {
                set_metadata(api.data)
            } else {
                toast.error(api.message)
            }
        } catch (e) {
            toast.error("Harap maaf! terdapat masalah pada pangkalan data. Sila hubungi sistem pentadbir untuk keterangan lanjut.")
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [setting])

    if(loading) return <Loading />

    const GetStatus = (TransaksiStatus) => {
        if(TransaksiStatus === "Pending") {
            return <Badge className='bg-yellow-500 text-white justify-center'>Dalam Proses</Badge>
        }
        else if(TransaksiStatus === "Approved") {
            return <Badge className='bg-emerald-600 text-white justify-center'>Pengesahan Berjaya</Badge>
        }
        else  {
            return <Badge className='bg-red-500 text-white justify-center'>Gagal Pengesahan</Badge>
        }
    }

    return (
        <div>
            <Modal
            title='Komen Pengesahan'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div>
                    <Button className='' onClick={close_modal}>Tutup</Button>
                </div>
                </>
            )}
            >
                <p className='font-normal text-gray-600 text-sm'>Anda pasti untuk meneruskan proses pengeluaran?</p>
            </Modal>

            <section>
                <HomeBredCurbs title={"Senarai Komen Pengesahan Kempen"} />
            </section>

            <section className='mt-6'>
                <Card 
                    title={"Komen Pengesahan"}
                    subtitle={"Berikut adalah senarai komen pengesahan kempen anda. Klik senarai di bawah untuk melihat keterangan lanjut."}
                    className='overflow-scroll'
                >
                    <div className='mt-6 flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Papar {metadata.row.length} per {metadata.total} rekod.</p>
                        </div>
                        <div>
                            <Pagination
                                totalPages={metadata.totalPages}
                                currentPage={setting.page}
                                handlePageChange={(val) => {
                                    set_setting({...setting, page: val})
                                }}
                            />
                        </div>
                        <div>
                            <Select 
                            placeholder='-- Jumlah Rekod --'
                            defaultValue={setting.limit}
                            options={[
                                { label: 10, value: 10},
                                { label: 20, value: 20},
                                { label: 50, value: 50},
                                { label: 100, value: 100}
                            ]}
                            onChange={(e) => {
                                set_setting({...setting, limit: e.target.value})
                            }}
                            />
                        </div>
                    </div>

                    <div className='mt-3'>
                        <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                <td width={'5%'} className='p-3 font-semibold text-sm'>Bil.</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Status Pengesahan</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Sebab Pengesahan</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Keterangan Pengesahan</td>
                                <td width={'10%'} className='p-3 font-semibold text-sm'>Tarikh</td>
                            </thead>
                            <tbody className='text-sm p-3'>
                                {
                                    metadata.row.length < 1 && (
                                        <tr className='border border-gray-100 p-3'>
                                            <td colSpan={5} className='p-3 text-center'>Anda tidak mempunyai senarai komen pengesahan buat masa sementara waktu.</td>
                                        </tr>
                                    )
                                }
                                {
                                    metadata.row.length > 0 && metadata.row.map((data, index) => index < setting.limit && (
                                        <tr key={index} className='border border-gray-100 p-3'>
                                            <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}.</td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                <p className='font-semibold text-gray-900'>{GetStatus(data.approvalStatus)}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{data.approvalTitle}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{data.approvalDescription}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-semibold text-sm text-clip'>
                                                <p className='font-normal text-gray-900'>{moment(data.created_date).format("DD MMM YYYY, hh:mm A")}</p>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>  
                    {/* <pre>
                        <code>
                            {JSON.stringify(metadata, undefined, 4)}
                        </code>
                    </pre> */}
                </Card>
            </section>
        </div>
    );
}

export default KomenPengesahanKempen;