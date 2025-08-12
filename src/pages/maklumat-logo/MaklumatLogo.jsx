import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useWidth from '@/hooks/useWidth';
import { API, API_FORM_DATA_STAGING } from '@/utils/api';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Loading from '@/components/Loading';
import Button from '@/components/ui/Button';

MaklumatLogo.propTypes = {
    
};

function MaklumatLogo(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()
    const [loading_maklumat, set_loading_maklumat]      = useState(true)

    const [orgAddress, setOrgAddress]                   = useState("");
    const [orgBankAccName, setOrgBankAccName]           = useState("");
    const [orgBankName, setOrgBankName]                 = useState("");
    const [orgBankNumber, setOrgBankNumber]             = useState("");
    const [orgCity, setOrgCity]                         = useState("");
    const [orgCode, setOrgCode]                         = useState("");
    const [orgData, setOrgData]                         = useState([]); // replace with actual data
    const [orgDocument, setOrgDocument]                 = useState([]);
    const [orgEmail, setOrgEmail]                       = useState("");
    const [orgGallery, setOrgGallery]                   = useState([]); // replace with actual data
    const [orgImage, setOrgImage]                       = useState("");
    const [orgName, setOrgName]                         = useState("");
    const [orgPhone, setOrgPhone]                       = useState("");
    const [orgPicEmail, setOrgPicEmail]                 = useState("");
    const [orgPicName, setOrgPicName]                   = useState("");
    const [orgPicPhone, setOrgPicPhone]                 = useState("");
    const [orgPostcode, setOrgPostcode]                 = useState("");
    const [orgRegisterNo, setOrgRegisterNo]             = useState("");
    const [orgState, setOrgState]                       = useState("");
    const [orgStatus, setOrgStatus]                     = useState("");
    const [orgType, setOrgType]                         = useState("");
    const [orgUrl, setOrgUrl]                           = useState("");
    const [orgUsername, setOrgUsername]                 = useState("");

    const [file, set_file]                              = useState(null)
    const [select_file, set_select_file]                = useState(null)

    const fetch_maklumat_institusi = async () => {
        set_loading_maklumat(true)
        let api = await API("getInstitusiDetails", { org_id: user.id }, "POST", true)
        if(api.status === 200) {

            let data = api.data[0]

            setOrgAddress(data.org_address)
            setOrgBankAccName(data.org_bank_acc_name)
            setOrgBankName(data.org_bank_name)
            setOrgBankNumber(data.org_bank_number)
            setOrgCity(data.org_city)
            setOrgCode(data.org_code)
            setOrgData(data.org_data)
            setOrgDocument(data.org_document)
            setOrgEmail(data.org_email)
            setOrgGallery(data.org_gallery)
            setOrgImage(data.org_image)
            setOrgName(data.org_name)
            setOrgPhone(data.org_phone)
            setOrgPicEmail(data.org_pic_email)
            setOrgPicName(data.org_pic_name)
            setOrgPicPhone(data.org_pic_phone)
            setOrgPostcode(data.org_postcode)
            setOrgRegisterNo(data.org_register_no)
            setOrgState(data.org_state)
            setOrgStatus(data.org_status)
            setOrgType(data.org_type)
            setOrgUrl(data.org_url)
            setOrgUsername(data.org_username)
        }

        setTimeout(() => {
            set_loading_maklumat(false)
        }, 500);
    }

    const upload__file = async () => {

        let result = null 

        if(file === null) {

            toast.error("Sila pastikan anda sertakan gambar atau dokumen sokongan sebagai bukti.")
            result = null

        } else {

            let form_data = [
                { title: 'file', value: file[0] }
            ]

            let api = await API_FORM_DATA_STAGING("file-uploader", form_data)

            if(api.status_code === 200) {
                result = api.data
            } else {
                result = null
                toast.error(api.message)
            }
        }

        return result
    }

    const update__logo = async () => {

        set_loading_maklumat(true)

        let upload = await upload__file()
        console.log("Log Function Upload File : ", upload)

        if(upload) {

            let json = {
                org_id: user.id,
                org_logo: upload
            }

            let api = await API("updateLogoInstitusi", json)

            if(api.status_code === 200) {
                toast.success(api.message)
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            } else {
                toast.error(api.message)
            }

        } else {
            toast.error("Terdapat masalah semasa muatnaik gambar. Sila hubungi pihak sistem pentadbir anda untuk maklumat lanjut.")
        }

        set_loading_maklumat(false)
    }

    useEffect(() => {
        fetch_maklumat_institusi()
    }, [])

    if(loading_maklumat) return <Loading />

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Logo Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Anda boleh mengemaskini maklumat logo institusi anda.</p>  
                    </div>
                </div>
            </section>

            {/* <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-lg text-gray-900'>Gambar atau Logo Institusi Lama</p>
                        <p className='font-normal text-sm text-gray-600'>Sila sertakan gambar atau logo institusi yang baru untuk mengemaskini maklumat gambar institusi anda.</p>
                    </div>
                    <div className='mt-6'>
                        {
                            orgImage && <img src={orgImage} alt='image' className='mx-auto object-cover w-64 h-64 rounded-full bg-gray-100 border' />
                        }
                    </div>
                </Card>
            </section> */}

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='font-semibold text-lg text-gray-900'>Gambar atau Logo Institusi Baru</p>
                        <p className='font-normal text-sm text-gray-600'>Sila sertakan gambar atau logo institusi yang baru untuk mengemaskini maklumat gambar institusi anda.</p>
                    </div>
                    <div className='mt-6'>
                        <label htmlFor="" className='form-label' style={{ fontSize: "16px" }}>Gambar atau Logo Institusi</label>
                        <p className='font-normal text-sm text-gray-600 mb-3' style={{ fontSize: "11px" }}>Anda hanya boleh muatnaik 1 gambar sahaja. Saiz fail yang dibenarkan adalah tidak melebihi 10MB.</p>
                        <Fileinput 
                        name={'Click here to upload file'}
                        label='Tekan sini untuk muat naik gambar'
                        placeholder='Contoh: gambar_perabot_rosak_2024.jpeg'
                        selectedFile={select_file}
                        onChange={e => {
                            set_file(e.target.files)
                            set_select_file(e.target.files[0])
                        }}
                        />
                    </div>
                </Card>
            </section>
            
            {
                file && (
                    <>
                    <section className='mt-6'>
                        <div className='flex justify-end items-center'>
                            <Button className='bg-teal-600 text-white' onClick={update__logo}>Kemaskini</Button>
                        </div>
                    </section>
                    </>
                )
            }
        </div>
    );
}

export default MaklumatLogo;