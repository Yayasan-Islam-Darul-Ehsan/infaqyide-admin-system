import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';
import Button from '@/components/ui/Button';
import { API } from '@/utils/api';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import Loading from '@/components/Loading';
import { useSelector } from 'react-redux';
import Textarea from '@/components/ui/Textarea';
import InputGroup from '@/components/ui/InputGroup';
import { EditIcon, Spinner, SquareIcon, TrashIcon } from 'evergreen-ui';
import moment from 'moment';
import Badge from '@/components/ui/Badge';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';
import { DISTRICT, NEGERI, POSTCODE } from './constant-senarai-negeri-dan-daerah';
import LoaderCircle from '@/components/Loader-circle';
import { validateEmail } from '@/constant/global_function';
import Icons from '@/components/ui/Icon';

import uploadSvgImage from "@/assets/images/svg/upload.svg";
import { useDropzone } from 'react-dropzone';


MaklumatInstitusi.propTypes = {
    
};

function MaklumatInstitusi(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    
    const [disabled_forever, set_disable_forever]       = useState(true)
    const [disabled_editing, set_disable_editing]       = useState(true)

    const [loading, set_loading]                        = useState(false)
    const [loading_category, set_loading_category]      = useState(true)
    const [loading_maklumat, set_loading_maklumat]      = useState(true)
    const [loading_status, set_loading_status]          = useState([])

    const [loading_address, set_loading_address]        = useState(false)
    const [category_option, set_category_option]        = useState([])

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
    const [orgPermalink, setOrgPermalink]               = useState("");
    const [orgUsername, setOrgUsername]                 = useState("");
    const [newMaklumat, setNewMaklumat] = useState({ title: '', data: '' });

    const [list_status_pengesahan, set_list_status_pengesahan] = useState([])

    const [opt_for_negeri, set_opt_for_negeri]      = useState(NEGERI)
    const [opt_for_daerah, set_opt_for_daerah]      = useState([])
    const [opt_for_postcode, set_opt_for_postcode]  = useState([])

    const [files, setFiles]                             = useState([])


    const [modal, set_modal] = useState(false)
    const open_modal    = () => set_modal(true)
    const close_modal   = () => set_modal(false)

    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [addressLine3, setAddressLine3] = useState('');

    const handleAddressChange = (value, line) => {
        if (line === 1) setAddressLine1(value);
        if (line === 2) setAddressLine2(value);
        if (line === 3) setAddressLine3(value);

        // Combine all address lines into one string, separated by commas
        const combinedAddress = [addressLine1, addressLine2, addressLine3]
            .map((lineValue, index) => (index + 1 === line ? value : lineValue))
            .filter(lineValue => lineValue.trim() !== '') 
            .join(', ');

        setOrgAddress(combinedAddress);
    };

    const fetch_organization_category = async () => {
        set_loading_category(true)
        let api = await API("reference?title=Organization+Type", {}, "GET", true)
        if(api.status === 200) {
            let array   = []
            let data    = api.data
            for (let i = 0; i < data.length; i++) {
                array.push({
                    label: data[i]["ref_name"],
                    value: data[i]["ref_id"],
                })
            }
            set_category_option(array)
        }
    }

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
            setOrgData(data.org_data ?? [])
            setOrgDocument(data.org_document ?? [])
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

            if(data.org_city) {
                //set_opt_for_daerah(POSTCODE[data.org_state].name)
                
                let array_city      = []
                let array_postcode  = []

                let basic = POSTCODE.state.filter(item => item.name === data.org_state)[0].city

                for (let i = 0; i < basic.length; i++) {
                    array_city.push({
                        label: basic[i].name,
                        values: basic[i].name,
                    })

                    if(data.org_city === basic[i].name) {
                        let default_arr = basic.filter(item => item.name === data.org_city)
                        for (let j = 0; j < default_arr[0].postcode.length; j++) {
                            array_postcode.push(default_arr[0].postcode[j])                        
                        }
                    }
                }

                set_opt_for_daerah(array_city)
                set_opt_for_postcode(array_postcode)
            }
        }

        setTimeout(() => {
            set_loading_maklumat(false)
        }, 1000);
    }

    const fetch_list_status_pengesahan = async () => {
        set_loading_status(true)
        let api = await API("getInstitusiStatus", { org_id: user.id }, "POST", true)

        if(api.status === 200) {
            set_list_status_pengesahan(api.data)
        }

        set_loading_status(false)
    }

    function convertToHyphenString(input) {
        // Remove extra spaces and replace spaces with hyphens
        return input.trim().replace(/\s+/g, '-').toUpperCase();
    }

    function validateUrl(url) {
        const invalidPatterns = ["http://", "https://", "://", "//", "/", "?", "&", "."];
        
        // Check if the URL contains any invalid pattern
        const hasInvalidPattern = invalidPatterns.some(pattern => url.includes(pattern));
      
        if (hasInvalidPattern) {
            toast.error("Permalink tidak boleh mengandungi 'http://', 'https://', atau '://' atau perkataan yang tidak dibernarkan.")
            return false
        }
        
        return true
    }

    const update__institusi = async () => {

        close_modal()

        if(validateEmail(orgEmail) === false) {
            toast.error("Format e-mel untuk e-mel institusi anda tidak sah. Sila pastikan format e-mel anda betul.")
            return false
        }

        if(orgPicEmail && validateEmail(orgPicEmail) === false) {
            toast.error("Format e-mel untuk e-mel pegawai anda tidak sah. Sila pastikan format e-mel anda betul.")
            return false
        }

        if(validateUrl(orgCode)) {

            set_loading_maklumat(true)

            let json = {
                orgId: user.id,
                orgRegistrationNo: orgRegisterNo,
                orgName: orgName,
                orgType: orgType,
                orgPhone: orgPhone,
                orgEmail: orgEmail,
                orgUrl: orgUrl,
                orgCode: convertToHyphenString(orgCode),
                orgAddress: orgAddress,
                orgCity: orgCity,
                orgState: orgState,
                orgPostcode: orgPostcode,
                orgPICName: orgPicName,
                orgPICPhone: orgPicPhone,
                orgPICEmail: orgPicEmail,
                orgData : orgData,
                orgBankAccName,
                orgBankName,
                orgBankNumber
            }
    
            let api = await API(`updateInstitusi`, json)
            console.log("Log Api Update Institusi : ", api)
    
            set_loading_maklumat(false)

            if(api.status_code === 200 || api.status === 200) {
                toast.success("Maklumat institusi telah berjaya dikemasini.")
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            } else {
                toast.error(api.message)
            }
        }
    }

    const update__draft__institusi = async () => {

        close_modal()

        if(validateEmail(orgEmail) === false) {
            toast.error("Format e-mel untuk e-mel institusi anda tidak sah. Sila pastikan format e-mel anda betul.")
            return false
        }

        if(orgPicEmail && validateEmail(orgPicEmail) === false) {
            toast.error("Format e-mel untuk e-mel pegawai anda tidak sah. Sila pastikan format e-mel anda betul.")
            return false
        }

        if(validateUrl(orgCode)) {

            set_loading_maklumat(true)

            let json = {
                orgId: user.id,
                orgRegistrationNo: orgRegisterNo,
                orgName: orgName,
                orgUsername: orgUsername,
                orgType: orgType,
                orgPhone: orgPhone,
                orgEmail: orgEmail,
                orgUrl: orgUrl,
                orgCode: convertToHyphenString(orgCode),
                orgAddress: orgAddress,
                orgCity: orgCity,
                orgState: orgState,
                orgPostcode: orgPostcode,
                orgPICName: orgPicName,
                orgPICPhone: orgPicPhone,
                orgPICEmail: orgPicEmail,
                orgData : orgData,
                orgBankAccName,
                orgBankName,
                orgBankNumber
            }
    
            let api = await API(`updateDraftInstitusi`, json)
            console.log("Log Api Update Institusi : ", api)
    
            set_loading_maklumat(false)

            if(api.status_code === 200 || api.status === 200) {
                toast.success("Maklumat institusi telah berjaya dikemasini.")
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            } else {
                toast.error(api.message)
            }
        }
    }


    const addNewMaklumat = () => {
        setOrgData([...orgData, { title: '', data: '' }]);
    };

    const updateMaklumat = (index, field, value) => {
        const updatedData = orgData.map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
        );
        setOrgData(updatedData);
    };

    const removeMaklumat = (indexToRemove) => {
        const updatedData = orgData.filter((_, idx) => idx !== indexToRemove);
        setOrgData(updatedData);
    };

    useEffect(() => {
        fetch_organization_category()
        fetch_maklumat_institusi()
        fetch_list_status_pengesahan()
    }, [])

    const get__status__badge = (status) => {
        if(status === "Lulus") {
            return <Badge className='bg-emerald-600 text-white'>{status} Pengesahan</Badge>
        }
        else if(status === "Dalam Semakan") {
            return <Badge className='bg-yellow-500 text-white'>{status}</Badge>
        }
        else {
            return <Badge className='bg-red-600 text-white'>{status}</Badge>
        }
    }

    const { getRootProps, getInputProps, isDragAccept } = useDropzone({
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log("Log Accepted File : ", acceptedFiles)
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
            );

            await uploadFileToServer(acceptedFiles).then(res => {
                console.log("Log Res Upload File : ", res)
                set_file_url = res
                setOrgImage(res)
            })
        },
    });

    const uploadFileToServer = async (fileInput) => {

        console.log("Log Filter File Before Upload : ", fileInput)
        let file_url 	= ""
        const formdata 	= new FormData();
        formdata.append("file", fileInput[0]);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        await fetch(`${window.location.origin.includes('localhost') ? 'https://admin-stg.infaqyide.com.my' : window.location.origin.includes('localhost')}/admin/file-uploader`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            setOrgImage(result.data)
        })
        .catch((error) => {
            console.error(error)
        });

        return file_url
    }

    const malaysiaBanks = [
    {
        label: "Malayan Banking Berhad (Maybank)",
        value: "MBBEMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "CIMB Bank Berhad",
        value: "CIBBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Public Bank Berhad",
        value: "PBBEMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "RHB Bank Berhad",
        value: "RHBBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Hong Leong Bank Berhad",
        value: "HLBBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "AmBank (M) Berhad",
        value: "ARBKMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "United Overseas Bank (Malaysia) Bhd",
        value: "UOVBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "OCBC Bank (Malaysia) Berhad",
        value: "OCBCMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "HSBC Bank Malaysia Berhad",
        value: "HBMBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Standard Chartered Bank Malaysia Berhad",
        value: "SCBLMYKX",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Citibank Berhad",
        value: "CITIMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Bank Islam Malaysia Berhad",
        value: "BIMBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Bank Muamalat Malaysia Berhad",
        value: "BMMBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Affin Bank Berhad",
        value: "PHBMMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Alliance Bank Malaysia Berhad",
        value: "MFBBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Bank Rakyat",
        value: "BKRMMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Bank Simpanan Nasional",
        value: "BSNAMYK1",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Agrobank / Bank Pertanian Malaysia Berhad",
        value: "AGOBMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Al Rajhi Banking & Investment Corporation (Malaysia) Berhad",
        value: "RJHIMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Kuwait Finance House (Malaysia) Berhad",
        value: "KFHOMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Bank of China (Malaysia) Berhad",
        value: "BKCHMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Industrial and Commercial Bank of China (Malaysia) Berhad",
        value: "ICBKMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Bank of America Malaysia Berhad",
        value: "BOFAMY2X",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Deutsche Bank (Malaysia) Berhad",
        value: "DEUTMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "J.P. Morgan Chase Bank Berhad",
        value: "CHASMYKX",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Sumitomo Mitsui Banking Corporation Malaysia Berhad",
        value: "SMBCMYKL",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "MUFG Bank (Malaysia) Berhad",
        value: "BOTKMYKX",
        branch: "Head Office",
        city: "Kuala Lumpur"
    },
    {
        label: "Mizuho Bank (Malaysia) Berhad",
        value: "MHCBMYKA",
        branch: "Head Office",
        city: "Kuala Lumpur"
    }
    ];

    if(loading_maklumat) return <Loading />
    
    return (
        <div>

            <Modal
            title='Pengesahan Mengemaskini Maklumat Institusi'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            centered={true}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end items-center gap-3'>
                    <Button className='' onClick={close_modal}>Tidak</Button>
                    <Button className='bg-teal-600 text-white' onClick={update__institusi}>Ya</Button>
                </div>
                </>
            )}
            >
                <p className='text-sm text-gray-500'>Anda pasti untuk mengemaskini maklumat institusi?</p>
            </Modal>

            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Institusi</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah maklumat mengenai institusi anda. Klik pada butang kemaskini di bawah untuk mengemaskini maklumat institusi anda.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        {
                            disabled_editing && (<Button onClick={() => set_disable_editing(!disabled_editing)} className='bg-teal-600 font-medium text-sm text-white'>Aktifkan Kemaskini</Button>)
                        }
                        {
                            !disabled_editing && (<Button onClick={() => set_disable_editing(!disabled_editing)} className='bg-white text-gray-600 font-medium text-sm'>Nyahaktif Kemaskini</Button>)
                        }
                    </div>
                </div>
            </section>
            
            <section className='mt-6'>
                <div className='bg-yellow-50 px-5 py-3 rounded-lg border border-yellow-600 shadow-md'>
                    <div>
                        <p className='font-semibold text-lg text-gray-600'>Peringatan!</p>
                    </div>
                    <div className='mt-3'>
                        <ul className=''>
                            <li className='text-sm text-gray-600'>1. Semua medan dibawah adalah wajib diisi.</li>
                            <li className='text-sm text-gray-600'>2. Sila pastikan semua maklumat yang diisi adalah tepat dan benar.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Kategori Institusi</p>
                        <p className='text-sm font-normal text-gray-600'>Sila pilih kategori institusi anda untuk dikemaskini.</p>
                    </div>
                    <div className='mt-3'>
                        <Select 
                        placeholder='Contoh: Masjid'
                        description={'Klik pada pilihan di atas untuk memilih jenis kategori institusi anda.'}
                        defaultValue={orgType}
                        options={category_option}
                        disabled={disabled_editing}
                        onChange={e => setOrgType(e.target.value)}
                        />
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Akaun</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi tentang akaun yang akan disimpan.</p>
                    </div>
                    <div className='mt-3'>
                        <div>
                            <Textinput 
                                label={'Nama Pengguna'}
                                placeholder='Contoh: Masjid Sungai Besi'
                                defaultValue={orgUsername}
                                disabled={disabled_forever}
                                onChange={e => setOrgUsername(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                label={'E-mel'}
                                placeholder='Contoh: masjidsgbesi@email.com'
                                defaultValue={orgEmail}
                                disabled={disabled_forever}
                                onChange={e => setOrgEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Perbankan</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi tentang perbankan yang akan disimpan.</p>
                    </div>
                    <div className='mt-3'>
                        <div>
                            <Select 
                            label={"Bank"}
                            placeholder='Contoh: Maybank'
                            defaultValue={orgBankName}
                            onChange={e => setOrgBankAccName(e.target.value)}
                            options={malaysiaBanks}
                            disabled={disabled_editing}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                label={'Nama Pemegang Bank'}
                                placeholder='Contoh: Akaun Bank Institusi A'
                                defaultValue={orgBankAccName}
                                onChange={e => setOrgBankAccName(e.target.value)}
                                disabled={disabled_editing}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                label={'No. Akaun Bank'}
                                placeholder='Contoh: 155059129123123'
                                defaultValue={orgBankNumber}
                                onChange={e => setOrgBankNumber(e.target.value)}
                                enableWhiteSpace={false}
                                isNumberOnly
                                disabled={disabled_editing}
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Terperinci Institusi</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi tentang maklumat institusi yang akan disimpan.</p>
                    </div>
                    <div className='mt-3'>
                        <div>
                            <Textinput 
                                label={'No. Pendaftaran Institusi (ROC/ROB/ROS)'}
                                placeholder='Contoh: A612355D'
                                defaultValue={orgRegisterNo}
                                disabled={disabled_editing}
                                onChange={e => setOrgRegisterNo(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                label={'Nama Institusi'}
                                placeholder='Contoh: MASJID SUNGAI BESI'
                                defaultValue={orgName}
                                disabled={disabled_editing}
                                onChange={e => setOrgName(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                name={"No. Phone"}
                                isMask={true}
                                register={() => {}}
                                label={'No. Telefon'}
                                placeholder='Contoh: 60123456789'
                                defaultValue={orgPhone}
                                disabled={disabled_editing}
                                onChange={e => {
                                    setOrgPhone(e.target.value)
                                }}
                                type={"number"}
                                pattern="^[0-9]{1,12}$" 
                                inputMode="numeric" 
                                maxLength={12} 
                                max={12}
                                isNumberOnly
                            />
                        </div>
                        <div className='mt-3 grid grid-cols-1 md:grid-cols-1 gap-3'>
                            <Textinput
                                label={'Alamat 1'}
                                placeholder='Contoh: Jalan 11'
                                defaultValue={orgAddress ? orgAddress.split(',')[0] : ''}
                                disabled={disabled_editing}
                                onChange={e => handleAddressChange(e.target.value, 1)}
                            />
                            <Textinput
                                label={'Alamat 2'}
                                placeholder='Contoh: Datuk Panglima Garang'
                                defaultValue={orgAddress ? orgAddress.split(',')[1] : ''}
                                disabled={disabled_editing}
                                onChange={e => handleAddressChange(e.target.value, 2)}
                            />
                            <Textinput
                                label={'Alamat 3'}
                                placeholder='Contoh: Hulu Selangor, 12345 Selangor, Malaysia'
                                defaultValue={orgAddress ? orgAddress.split(',')[2] : ''}
                                disabled={disabled_editing}
                                onChange={e => handleAddressChange(e.target.value, 3)}
                            />
                        </div>

                        <div className='mt-3'>
                            
                        </div>

                        <div className='mt-3 grid grid-cols-1 md:grid-cols-3 gap-3'>

                            {
                                loading_address && (
                                <>
                                    <div className='col-span-1 justify-center items-center'>
                                        <Spinner />
                                    </div>
                                </>
                                )
                            }

                            {
                                !loading_address && (
                                    <>
                                        <Select 
                                            label={'Poskod'}
                                            placeholder='-- Sila Pilih Poskod --'
                                            defaultValue={orgPostcode}
                                            options={opt_for_postcode}
                                            disabled={disabled_editing}
                                            onChange={e => setOrgPostcode(e.target.value)}
                                        />
                                        
                                        <Select 
                                            label={'Daerah'}
                                            placeholder='-- Sila Pilih Daerah --'
                                            defaultValue={orgCity}
                                            disabled={disabled_editing}
                                            options={opt_for_daerah}
                                            onChange={e => {

                                                set_loading_address(true)

                                                let array_postcode  = []
                                                let city            = e.target.value

                                                setOrgCity(city)
                                                setOrgPostcode("")
                                                
                                                let basic       = POSTCODE.state.filter(item => item.name === orgState)[0].city
                                                let default_arr = basic.filter(item => item.name === city)
                                                console.log("Log Change City For Postcode : ", default_arr)
                                                
                                                array_postcode.push({
                                                    label: "-- Sila Pilih --",
                                                    value: ""
                                                })
                                                for (let j = 0; j < default_arr[0].postcode.length; j++) {
                                                    array_postcode.push(default_arr[0].postcode[j])                        
                                                }

                                                set_opt_for_postcode(array_postcode)

                                                setTimeout(() => {
                                                    set_loading_address(false)
                                                }, 500);
                                            }}
                                        />

                                        <Select 
                                            label={'Negeri'}
                                            placeholder='-- Sila Pilih Negeri --'
                                            defaultValue={orgState}
                                            disabled={disabled_editing}
                                            options={opt_for_negeri}
                                            onChange={e => {

                                                set_loading_address(true)

                                                setOrgState(e.target.value)
                                                setOrgCity("")
                                                setOrgPostcode("")

                                                let array = []
                                                let basic = POSTCODE.state.filter(item => item.name === e.target.value)[0]
                                                console.log("Log List Daerah : ", basic)

                                                array.push({
                                                    label: "-- Sila Pilih --",
                                                    value: ""
                                                })
                                                for (let i = 0; i < basic.city.length; i++) {
                                                    array.push({
                                                        label: basic.city[i].name,
                                                        value: basic.city[i].name
                                                    })
                                                    
                                                }
                                                set_opt_for_daerah(array)

                                                setTimeout(() => {
                                                    set_loading_address(false)
                                                }, 500);
                                            }}
                                        />
                                        
                                    </>
                                )
                            }
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Pegawai Untuk Dihubungi</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi tentang pengawai untuk dihubungi.</p>
                    </div>
                    <div className='mt-3'>
                        <div>
                            <Textinput 
                                label={'Nama Pegawai'}
                                placeholder='Contoh: Ahmad Safiuddin Bin Shahrom'
                                defaultValue={orgPicName}
                                disabled={disabled_editing}
                                onChange={e => setOrgPicName(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                label={'E-mel Pegawai'}
                                placeholder='Contoh: safiuddinshahroh@email.com'
                                defaultValue={orgPicEmail}
                                disabled={disabled_editing}
                                onChange={e => setOrgPicEmail(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <Textinput 
                                name={"No. Phone"}
                                isMask={true}
                                register={() => {}}
                                label={'No. Telefon Pegawai'}
                                placeholder='Contoh: 0123456789'
                                defaultValue={orgPicPhone}
                                disabled={disabled_editing}
                                onChange={e => setOrgPicPhone(e.target.value)}
                                type={"number"}
                                pattern="^[0-9]{1,12}$" 
                                inputMode="numeric" 
                                maxLength={12} 
                                max={12}
                                isNumberOnly
                            />
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
                <Card title={"Gambar Institusi"} subtitle={"Klik pada ruangan di bawah untuk muatnaik gambar institusi."}>
                    <div>
                        <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center">
                            {files.length === 0 && (
                                <div {...getRootProps({ className: "dropzone" })}>
                                    <input className="hidden" {...getInputProps()} />
                                    <img
                                        src={orgImage || uploadSvgImage}
                                        alt=""
                                        className="mx-auto mb-4"
                                    />
                                    {isDragAccept ? (
                                        <p className="text-sm text-slate-500 dark:text-slate-300 ">
                                            Drop the files here ...
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-500 dark:text-slate-300 f">
                                            Drop files here or click to upload.
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="flex space-x-4">
                                {files.map((file, i) => (
                                    <div key={i} className="mb-4 flex-none">
                                        <div className="h-[300px] w-[300px] mx-auto mt-6 rounded-md">
                                            <img
                                                src={file.preview}
                                                className=" object-contain h-full w-full block rounded-md"
                                                onLoad={() => {
                                                    URL.revokeObjectURL(file.preview);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <section className='mt-6'>
            <Card>
                <div className='flex flex-row items-center justify-between'>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Tambahan Institusi</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi mengenai maklumat tambahan yang akan disimpan.</p>
                    </div>
                    {!disabled_editing && (
                        <Button className='bg-teal-600 text-white' onClick={addNewMaklumat}>Tambah Maklumat</Button>
                    )}
                </div>

                <div className='mt-3'>
                    {orgData && orgData.length > 0 && orgData.map((data, index) => (
                        <div key={index}>
                            <div>
                                <Textinput
                                    label={"Tajuk"}
                                    placeholder='Contoh: Penubuhan Masjid'
                                    defaultValue={data.title}
                                    disabled={disabled_editing}
                                    onChange={(e) => updateMaklumat(index, 'title', e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <Textarea
                                    label={"Keterangan"}
                                    dvalue={data.data}
                                    disabled={disabled_editing}
                                    onChange={(e) => updateMaklumat(index, 'data', e.target.value)}
                                />
                            </div>
                            {!disabled_editing && (
                                <div className='flex justify-end items-center mt-3 mb-4'>
                                    <div className='flex flex-direction gap-3'>
                                        <Button 
                                            className=' text-white' 
                                            onClick={() => removeMaklumat(index)}
                                        >
                                            <Icons className={"text-lg text-red-500"} icon={"heroicons:trash"} />
                                            {/* <TrashIcon /> */}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </section>

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Laman Sesawang</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi tentang laman sesawang yang akan disimpan.</p>
                    </div>
                    <div className='mt-3'>
                        <div>
                            <Textinput 
                                label={'Pautan Laman Sesawang'}
                                placeholder='Contoh: https://masjidklanajaya.com.my'
                                defaultValue={orgUrl}
                                disabled={disabled_editing}
                                onChange={e => setOrgUrl(e.target.value)}
                            />
                        </div>
                        <div className='mt-3'>
                            <InputGroup 
                            prepend={ process.env.NODE_ENV === "production" ? `${window.location.origin}/institusi/` : `${window.location.origin}/institusi/`}
                            label={"Permalink (Pautan Ke Halaman InfaqYIDE)"}
                            placeholder={`${window.location.origin}/masjid/masjid-klana-jaya`}
                            defaultValue={orgCode}
                            disabled={disabled_editing}
                            onChange={e => setOrgCode(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {
                !disabled_editing && (
                    <>
                    <section className='mt-6'>
                        <div className='flex justify-end items-center gap-3'>
                            <Button className='btn btn-md bg-teal-600 text-white' onClick={update__draft__institusi}>Simpan Draf</Button>
                            <Button className='btn btn-md bg-teal-600 text-white' onClick={open_modal}>Hantar Kemaskini</Button>
                        </div>
                    </section>
                    </>
                )
            }

            <section className='mt-6'>
                <Card>
                    <div>
                        <p className='text-lg font-semibold text-gray-900'>Maklumat Pengesahan Akaun Institusi</p>
                        <p className='text-sm font-normal text-gray-600'>Informasi tentang status terkini institusi.</p>
                    </div>
                    <div className='mt-3'>
                        {
                            list_status_pengesahan.length < 1 && (
                                <><p className='font-base text-sm text-gray-600'>Anda tidak mempunyai senarai pengesahan.</p></>
                            )
                        }

                        {
                            list_status_pengesahan.length > 0 && (
                                <>
                                <div>
                                    <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 rounded-md'>
                                        <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                            <td width={'5%'} className='p-3 font-semibold text-sm'>No.</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Tarikh</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Status</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Nota</td>
                                            <td width={'20%'} className='p-3 font-semibold text-sm'>Pengesah</td>
                                        </thead>
                                        <tbody className='text-sm p-3'>
                                            {
                                                list_status_pengesahan.length > 0 && list_status_pengesahan.map((data, index) => (
                                                    <tr key={index} className='border border-gray-100 p-3'>
                                                        <td width={'5%'} className='p-3 font-normal text-sm'>{index + 1}</td>
                                                        <td width={'20%'} className='p-3 font-semibold text-sm'>{moment(data.org_status_date).format("DD MMM, YYYY hh:mm A")}</td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm'>{get__status__badge(data.org_status)}</td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm'>{data.org_status_reason}</td>
                                                        <td width={'20%'} className='p-3 font-normal text-sm'>{data.user_approve}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                </>
                            )
                        }
                    </div>
                </Card>
            </section>

        </div>
    );
}

export default MaklumatInstitusi;