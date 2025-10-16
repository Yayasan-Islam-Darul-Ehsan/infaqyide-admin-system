import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Card from '@/components/ui/Card';
import { toast } from 'react-toastify';
import { SYSADMIN_API } from '@/utils/api';
import Select from "react-select";
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Dialog, Switch } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';

DaftarTabungMasjid.propTypes = {
    
};

const styles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: "12px"
    }),
};

function DaftarTabungMasjid(props) {

    const navigation = useNavigate()
    const [loading, set_loading]                = useState(false)
    const [loading_masjid, set_loading_masjid]  = useState(true)
    const [senarai_masjid, set_senarai_masjid]  = useState([])

    const [tabung, set_tabung]                  = useState({
        organizationId: '',
        tabungDefault: 1,
        tabungName: '',
        tabungDescription: '',
        tabungType: 'Infaq',
        tabungPermalink: "", 
        tabungGoals: 0.00,
        tabungCollection: 0.00,
        tabungBalance: 0.00,
        tabungFloat: 0.00,
        tabungStatus: 1,
        tabungVerified: 1
    })

    const [dialog, set_dialog]                              = useState(false)
    const open_dialog                                       = () => set_dialog(true)
    const close_dialog                                      = () => set_dialog(false)

    const getMasjid = async () => {
        set_loading_masjid(true)
        try {
            let ngo = await SYSADMIN_API("pengurusan/institusi?limit=2000", {}, "GET")
            if(ngo.status_code === 200) {
                if(ngo.data.row.length > 0) {
                    let data    = ngo.data.row
                    let arr     = []
                    for (let i = 0; i < data.length; i++) {
                        if(data[i]["organizationName"]) {
                            arr.push({
                                label: data[i]["organizationName"],
                                value: data[i]["organizationId"]
                            })
                        }
                    }
                    set_senarai_masjid(arr)
                }
            }
        } catch (e) {
            toast.error(e)
        } finally {
            set_loading_masjid(false)
        }
    }

    const CreateTabung = async () => {
        close_dialog()
        set_loading(true)

        try {

            if(!tabung.organizationId || tabung.organizationId == "" || tabung.organizationId == undefined) {
                toast.error("Sila buat pemilihan institusi tabung.")
            } else if(!tabung.tabungName || tabung.tabungName == "" || tabung.tabungName == undefined) {
                toast.error("Sila lengkapkan nama tabung di bawah.")
            } else if(!tabung.tabungDescription || tabung.tabungDescription == "" || tabung.tabungDescription == undefined) {
                toast.error("Sila lengkapkan keterangan tabung di bawah.")
            } else if(!tabung.tabungType || tabung.tabungType == "" || tabung.tabungType == undefined) {
                toast.error("Sila lengkapkan jenis tabung di bawah.")
            } else {
                let api = await SYSADMIN_API("pengurusan/tabung", tabung, "POST", true)
                if(api.status_code) {
                    toast.success(api.message)
                    setTimeout(() => {
                        navigation(-1)
                    }, 1000);
                } else {
                    toast.error(api.message)
                }
            }
            
        } catch (error) {
            toast.error(error)
        } finally {
            set_loading(false)
        }
    }

    useEffect(() => {
        getMasjid()
    }, [])

    if(loading_masjid || loading) {
        return <Loading />
    }

    return (
        <div>

            <Dialog
            isShown={dialog}
            intent='success'
            title="Pengesahan Pendaftaran Tabung Institusi"
            cancelLabel='Tutup'
            confirmLabel='Ya, Teruskan'
            onCloseComplete={close_dialog}
            onCancel={close_dialog}
            onConfirm={CreateTabung}
            >
                <p className='font-normal text-sm text-slate-600'>Anda pasti untuk daftar tabung institusi ini?</p>
            </Dialog>

            <section>
                <HomeBredCurbs title={"Daftar Tabung Institusi"} />
            </section>        

            <section>
                <Card
                title={"Maklumat Tabung Institusi"}
                subtitle={"Sila lengkapkan maklumat tabung institusi di bawah."}
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                            <label htmlFor=" hh" className="form-label ">Pilihan Institusi</label>
                            <Select 
                            required
                            className='text-sm text-slate-600'
                            classNamePrefix='select'
                            label={"Institusi Tabung"}
                            placeholder='-- Sila Pilih Institusi --'
                            description={"Sila pilih institusi yang diperlukan untuk daftar tabung."}
                            defaultValue={tabung.organizationId}
                            options={senarai_masjid}
                            onChange={async ({label, value}) => {
                                console.log("Log Val : ", value)
                                set_tabung({...tabung, organizationId: value})
                            }}
                            styles={styles}
                            />
                        </div>
                        <div className=''>
                            <label htmlFor=" hh" className="form-label ">Jenis Tabung</label>
                            <Select 
                            required
                            className='text-sm text-slate-600'
                            classNamePrefix='select'
                            label={"Jenis Tabung"}
                            placeholder='-- Sila Pilih Tabung --'
                            description={"Sila pilih jenis tabung yang diperlukan untuk daftar tabung."}
                            defaultValue={tabung.tabungType}
                            value={tabung.tabungType}
                            options={[
                                {label: 'Infaq', value: 'Infaq'},
                                {label: 'Kempen', value: 'Kempen'},
                            ]}
                            onChange={async ({label, value}) => {
                                set_tabung({...tabung, tabungType: value})
                            }}
                            styles={styles}
                            />
                        </div>
                    </div>

                    <div className='mt-3'>
                        <Textinput 
                        label={"Nama Tabung"}
                        placeholder='Contoh: Tabung Penubuhan Masjid'
                        defaultValue={tabung.tabungName}
                        onChange={e => set_tabung({...tabung, tabungName: e.target.value})}
                        />
                    </div>

                    <div className='mt-3'>
                        <Textarea
                        label={"Keterangan Tabung"}
                        placeholder='Contoh: Tabung Kutipan Dana Penubuhan Masjid'
                        dvalue={tabung.tabungDescription}
                        onChange={e => set_tabung({...tabung, tabungDescription: e.target.value})}
                        />
                    </div>

                    <div className='mt-3'>
                        <label htmlFor="" className='form-label'>Set Taraf</label>
                        <Switch 
                        checked={tabung.tabungDefault == 1 ? true : false}
                        onChange={e => {
                            console.log(e.target.checked)
                            set_tabung({...tabung, tabungDefault: e.target.checked ? 1 : 0})
                        }}
                        />
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <div className='flex justify-end'>
                    <Button 
                        className='bg-green-600 text-white' 
                        text={"Daftar Institusi"} 
                        icon={"herocions-outline:plus"}
                        onClick={open_dialog}
                    />
                </div>
            </section>
        </div>
    );
}

export default DaftarTabungMasjid;