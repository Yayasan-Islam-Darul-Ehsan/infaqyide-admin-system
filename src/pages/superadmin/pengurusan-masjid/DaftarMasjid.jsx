import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API, SYSADMIN_API } from '@/utils/api';
import Loading from '@/components/Loading';
import { NEGERI, POSTCODE } from '@/pages/asset/constant-senarai-negeri-dan-daerah';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textinput from '@/components/ui/Textinput';
import { Spinner } from 'evergreen-ui';
import Textarea from '@/components/ui/Textarea';
import Icons from '@/components/ui/Icon';
import InputGroup from '@/components/ui/InputGroup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DropZone from '@/pages/forms/file-input/DropZone';
import { useDropzone } from 'react-dropzone';

import uploadSvgImage from "@/assets/images/svg/upload.svg";


function DaftarMasjid(props) {

    const navigation                = useNavigate()
    const [loading, set_loading]    = useState(false)
    const [masjid, set_masjid]      = useState({
        organizationUsername: "",
        organizationPassword: "",
        organizationRegistrationNo: "",
        organizationName: "",
        organizationType: "",
        organizationPermalink: "",
        organizationCode: "",
        organizationEmail: "",
        organizationPhone: "",
        organizationAddress: "",
        organizationCity: "",
        organizationState: "",
        organizationPostcode: "",
        organizationPICName: "",
        organizationPICPhone: "",
        organizationPICEmail: "",
        organizationBankName: "",
        organizationBankNumber: "",
        organizationBankAccName: "",
        organizationImage: "",
        organizationGallery: [],
        organizationDocument: [],
        organizationData: [],
        isDraft: "No",
        isMigrated: "No"
    })

    const [modal, set_modal]    = useState(false)
    const open_modal            = () => set_modal(true)
    const close_modal           = () => set_modal(false)

    const [loading_address, set_loading_address]        = useState(false)
    const [category_option, set_category_option]        = useState([])

    const [opt_for_negeri, set_opt_for_negeri]          = useState(NEGERI)
    const [opt_for_daerah, set_opt_for_daerah]          = useState([])
    const [opt_for_postcode, set_opt_for_postcode]      = useState([])

    const [addressLine1, setAddressLine1]               = useState('');
    const [addressLine2, setAddressLine2]               = useState('');
    const [addressLine3, setAddressLine3]               = useState('');

    const [files, setFiles] = useState([])

    const fetch_organization_category = async () => {
        set_loading(true)
        let api = await API("reference?title=Organization+Type", {}, "GET", false)
        if(api.status === 200) {
            let array   = []
            let data    = api.data
            for (let i = 0; i < data.length; i++) {
                array.push({ label: data[i]["ref_name"], value: data[i]["ref_id"] })
            }
            set_category_option(array)
        }
        set_loading(false)
    }

    const handleAddressChange = (value, line) => {
        if (line === 1) setAddressLine1(value);
        if (line === 2) setAddressLine2(value);
        if (line === 3) setAddressLine3(value);

        // Combine all address lines into one string, separated by commas
        const combinedAddress = [addressLine1, addressLine2, addressLine3]
            .map((lineValue, index) => (index + 1 === line ? value : lineValue))
            .filter(lineValue => lineValue.trim() !== '') 
            .join(', ');

        set_masjid({...masjid, organizationAddress: combinedAddress});
    };

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

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const addNewMaklumat = () => {
        //setOrgData([...orgData, { title: '', data: '' }]);
        set_masjid({
            ...masjid,
            organizationData: [...masjid.organizationData, { title: '', data: '' }]
        })
    };

    const updateMaklumat = (index, field, value) => {
        const updatedData = masjid.organizationData.map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
        );
        set_masjid({
            ...masjid,
            organizationData: updatedData
        })
    };

    const removeMaklumat = (indexToRemove) => {
        const updatedData = masjid.organizationData.filter((_, idx) => idx !== indexToRemove);
        set_masjid({
            ...masjid,
            organizationData: updatedData
        })
    };

    const register__masjid = async () => {
    
            close_modal()
    
            if(validateEmail(masjid.organizationEmail) === false) {
                toast.error("Format e-mel untuk e-mel institusi anda tidak sah. Sila pastikan format e-mel anda betul.")
                return false
            }
    
            if(validateEmail(masjid.organizationEmail) === false || validateEmail(masjid.organizationPICEmail) === false) {
                toast.error("Format e-mel untuk e-mel pegawai anda tidak sah. Sila pastikan format e-mel anda betul.")
                return false
            }
    
            if(validateUrl(masjid.organizationCode)) {
    
                set_loading(true)
                let json = {
                    ...masjid, 
                    organizationCode: convertToHyphenString(masjid.organizationCode),
                    organizationAddress: masjid.organizationAddress + ", " + masjid.organizationPostcode + ", " + masjid.organizationCity + ", " + masjid.organizationState 
                }
                console.log("Log Final JSON : ", json)
        
                let api = await SYSADMIN_API(`pengurusan/institusi`, json, "POST", true)
                console.log("Log Api Update Maklumat Institusi : ", api)
        
                set_loading(false)
    
                if(api.status_code === 200 || api.status === 200) {
                    toast.success("Maklumat institusi telah berjaya dikemasini.")
                    setTimeout(() => {
                        navigation("/pengurusan/pengurusan-institusi")
                    }, 1000);
                } else {
                    toast.error(api.message)
                }
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
                set_masjid({...masjid, organizationImage: res })
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

        await fetch(`${window.location.origin}/admin/file-uploader`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            set_masjid({...masjid, organizationImage: result.data })
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
    
    useEffect(() => {
        fetch_organization_category()
    }, [])

    if(loading || category_option.length === 0) return <Loading />

    return (
        <div>
            <HomeBredCurbs title={"Daftar Institusi Baharu"} />

            <section>
                <div>
                    <Modal
                    title='Pengesahan Pendaftaran Institusi Baharu'
                    themeClass='bg-teal-600 text-white'
                    activeModal={modal}
                    centered={true}
                    onClose={close_modal}
                    footerContent={(
                        <>
                        <div className='flex justify-end items-center gap-3'>
                            <Button className='' onClick={close_modal}>Tidak</Button>
                            <Button className='bg-teal-600 text-white' onClick={register__masjid}>Ya, Teruskan</Button>
                        </div>
                        </>
                    )}
                    >
                        <p className='text-sm text-gray-500'>Anda pasti untuk mendaftar institusi baharu dengan maklumat di bawah?</p>
                    </Modal>
                    
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
                                {
                                    (
                                        <Select 
                                        placeholder='Contoh: Masjid'
                                        description={'Klik pada pilihan di atas untuk memilih jenis kategori institusi anda.'}
                                        defaultValue={masjid.organizationType}
                                        options={category_option}
                                        onChange={e => set_masjid({...masjid, organizationType: e.target.value})}
                                        />
                                    )
                                }
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
                                        defaultValue={masjid.organizationUsername}
                                        onChange={e => set_masjid({...masjid, organizationUsername: e.target.value})}
                                        enableWhiteSpace={false}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        name={"Password"}
                                        label={'Kata Laluan'}
                                        placeholder='••••••••••'
                                        defaultValue={masjid.organizationPassword}
                                        onChange={e => set_masjid({...masjid, organizationPassword: e.target.value})}
                                        type={"password"}
                                        hasicon={true}
                                        register={() => {}}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        label={'E-mel'}
                                        placeholder='Contoh: masjidsgbesi@email.com'
                                        defaultValue={masjid.organizationEmail}
                                        onChange={e => set_masjid({...masjid, organizationEmail: e.target.value })}
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
                                    defaultValue={masjid.organizationBankName}
                                    onChange={e => set_masjid({...masjid, organizationBankName: e.target.value })}
                                    options={malaysiaBanks}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        label={'Nama Pemegang Bank'}
                                        placeholder='Contoh: Akaun Bank Institusi A'
                                        defaultValue={masjid.organizationBankAccName}
                                        onChange={e => set_masjid({...masjid, organizationBankAccName: e.target.value })}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        label={'No. Akaun Bank'}
                                        placeholder='Contoh: 155059129123123'
                                        defaultValue={masjid.organizationBankNumber}
                                        onChange={e => set_masjid({...masjid, organizationBankNumber: e.target.value })}
                                        enableWhiteSpace={false}
                                        isNumberOnly
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
                                        defaultValue={masjid.organizationRegistrationNo}
                                        onChange={e => set_masjid({...masjid, organizationRegistrationNo: e.target.value })}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        label={'Nama Institusi'}
                                        placeholder='Contoh: MASJID SUNGAI BESI'
                                        defaultValue={masjid.organizationName}
                                        onChange={e => set_masjid({
                                            ...masjid, 
                                            organizationName: e.target.value,
                                            organizationCode: convertToHyphenString(e.target.value).toLowerCase()
                                        })}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        name={"No. Phone"}
                                        isMask={true}
                                        register={() => {}}
                                        label={'No. Telefon'}
                                        placeholder='Contoh: 60123456789'
                                        defaultValue={masjid.organizationPhone}
                                        onChange={e => set_masjid({...masjid, organizationPhone: e.target.value })}
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
                                        defaultValue={masjid.organizationAddress.split(',')[0] || ''}
                                        onChange={e => handleAddressChange(e.target.value, 1)}
                                    />
                                    <Textinput
                                        label={'Alamat 2'}
                                        placeholder='Contoh: Datuk Panglima Garang'
                                        defaultValue={masjid.organizationAddress.split(',')[1] || ''}
                                        onChange={e => handleAddressChange(e.target.value, 2)}
                                    />
                                    <Textinput
                                        label={'Alamat 3'}
                                        placeholder='Contoh: Hulu Selangor, 12345 Selangor, Malaysia'
                                        defaultValue={masjid.organizationAddress.split(',')[2] || ''}
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
                                                    label={'Negeri'}
                                                    placeholder='-- Sila Pilih Negeri --'
                                                    defaultValue={masjid.organizationState}
                                                    options={opt_for_negeri}
                                                    onChange={e => {

                                                        set_loading_address(true)
                                                        set_masjid({
                                                            ...masjid, 
                                                            organizationState: e.target.value,
                                                            organizationCity: "",
                                                            organizationPostcode: ""
                                                        })

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
                                                <Select 
                                                    label={'Daerah'}
                                                    placeholder='-- Sila Pilih Daerah --'
                                                    defaultValue={masjid.organizationCity}
                                                    options={opt_for_daerah}
                                                    onChange={e => {

                                                        set_loading_address(true)

                                                        let array_postcode  = []
                                                        let city            = e.target.value

                                                        set_masjid({
                                                            ...masjid, 
                                                            organizationCity: city,
                                                            organizationPostcode: ""
                                                        })
                                                        
                                                        
                                                        let basic       = POSTCODE.state.filter(item => item.name === masjid.organizationState)[0].city
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
                                                    label={'Poskod'}
                                                    placeholder='-- Sila Pilih Poskod --'
                                                    defaultValue={masjid.organizationPostcode}
                                                    options={opt_for_postcode}
                                                    onChange={e => set_masjid({
                                                        ...masjid, 
                                                        organizationPostcode: e.target.value 
                                                    })}
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
                                        defaultValue={masjid.organizationPICName}
                                        onChange={e => set_masjid({...masjid, organizationPICName: e.target.value })}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        label={'E-mel Pegawai'}
                                        placeholder='Contoh: safiuddinshahroh@email.com'
                                        defaultValue={masjid.organizationPICEmail}
                                        onChange={e => set_masjid({...masjid, organizationPICEmail: e.target.value })}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <Textinput 
                                        name={"No. Phone"}
                                        isMask={true}
                                        register={() => {}}
                                        label={'No. Telefon Pegawai'}
                                        placeholder='Contoh: 0123456789'
                                        defaultValue={masjid.organizationPICPhone}
                                        onChange={e => set_masjid({...masjid, organizationPICPhone: e.target.value })}
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
                                                src={uploadSvgImage}
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
                            <div>
                                <span className='text-xs text-slate-600 italic'>{masjid.organizationImage}</span>
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
                            {(
                                <Button className='bg-teal-600 text-white' onClick={addNewMaklumat}>Tambah Maklumat</Button>
                            )}
                        </div>

                        <div className='mt-3'>
                            {masjid.organizationData && masjid.organizationData.length > 0 && masjid.organizationData.map((data, index) => (
                                <div key={index}>
                                    <div>
                                        <Textinput
                                            label={"Tajuk"}
                                            placeholder='Contoh: Penubuhan Masjid'
                                            defaultValue={data.title}
                                            onChange={(e) => updateMaklumat(index, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <Textarea
                                            label={"Keterangan"}
                                            dvalue={data.data}
                                            onChange={(e) => updateMaklumat(index, 'data', e.target.value)}
                                        />
                                    </div>
                                    {(
                                        <div className='flex justify-end items-center mt-3 mb-4'>
                                            <div className='flex flex-direction gap-3'>
                                                <Button 
                                                    className=' text-white' 
                                                    onClick={() => removeMaklumat(index)}
                                                >
                                                    <Icons className={"text-lg text-red-500"} icon={"heroicons:trash"} />
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
                                        defaultValue={masjid.organizationPermalink}
                                        onChange={e => set_masjid({...masjid, organizationPermalink: e.target.value })}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <InputGroup 
                                    prepend={ process.env.NODE_ENV === "production" ? "https://infaqyide.com.my/institusi/" : "https://dev.infaqyide.xyz/institusi/"}
                                    label={"Permalink (Pautan Ke Halaman InfaqYIDE)"}
                                    placeholder={"masjid-klana-jaya-seksyen-17"}
                                    defaultValue={masjid.organizationCode}
                                    onChange={e => set_masjid({...masjid, organizationCode: e.target.value })}
                                    />
                                </div>
                            </div>
                        </Card>
                    </section>

                    {
                        (
                            <>
                            <section className='mt-6'>
                                <div className='flex justify-end items-center gap-3'>
                                    {/* <Button className='btn btn-md bg-teal-600 text-white' onClick={update__draft__institusi}>Simpan Draf</Button> */}
                                    <Button className='btn btn-md bg-teal-600 text-white' onClick={open_modal}>Hantar Kemaskini</Button>
                                </div>
                            </section>
                            </>
                        )
                    }
                </div>
            </section>
        </div>
    );
}

export default DaftarMasjid;