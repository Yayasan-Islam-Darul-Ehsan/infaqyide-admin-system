import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';
import HomeBredCurbs from '@/pages/dashboard/HomeBredCurbs';
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../../../fb'
import { Heading, majorScale, Switch } from 'evergreen-ui';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';

AppSetting.propTypes = {
    
};

function AppSetting(props) {

    const [loading, set_loading] = useState(true)
    const [setting, set_setting] = useState([])

    useEffect(() => {

        const q     = query(collection(db, "sys_setting"), orderBy("setting_name", "asc"));
        const unsub = onSnapshot(q, (snapshot) => {
			const data = snapshot.docs.map((doc) => ({
				id: doc.id, ...doc.data()
			}));
			set_setting(data);
            
		});

        setTimeout(() => {
            set_loading(false)
        }, 500);
		return () => unsub(); // cleanup listener
    }, [])

    async function updateSetting(docId, newStatus) {
        try {
            const ref = doc(db, "sys_setting", docId); // doc reference by ID
            await updateDoc(ref, {
                setting_status: newStatus, // update specific field
                last_modified: new Date().toISOString()
            });
            console.log("Document updated successfully ✅");
        } catch (err) {
            console.error("Error updating document:", err);
        }
    }

    async function createSetting() {
        set_modal(false)
        try {
            await addDoc(collection(db, "sys_setting"), {
                ...new_setting,
                created_date: new Date().toISOString(),
                last_modified: new Date().toISOString()
            })
            console.log("Document created successfully ✅");
            toast.success("Document created successfully ✅")
        } catch (e) {
            console.error("Error cteating document:", e);
            toast.error("Error cteating document")
        }
    }

    const [new_setting, set_new_setting] = useState({
        setting_name: "",
        setting_description: "",
        setting_device: ["Device"],
        setting_status: true
    })
    const [modal, set_modal] = useState(false)
    const open_modal = () => {
        set_new_setting({
            setting_name: "",
            setting_description: "",
            setting_device: ["Device"],
            setting_status: true
        })
        set_modal(true)
    }

    const close_modal = () => {
        set_new_setting({
            setting_name: "",
            setting_description: "",
            setting_device: ["Device"],
            setting_status: true
        })
        set_modal(false)
    }

    if(loading) return <Loading />

    return (
        <div>
            <HomeBredCurbs title={"Tetapan"} />

            <Modal
            title='Tambah Tetapan'
            themeClass='bg-teal-600 text-white'
            activeModal={modal}
            onClose={close_modal}
            footerContent={(
                <>
                <div className='flex justify-end'>
                    <Button className='btn btn-sm bg-teal-600 text-white' text={"Tambah Tetapan"} icon={"heroicons:plus"} onClick={createSetting} />
                </div>
                </>
            )}
            >
                <div className='space-y-6'>
                    <Textinput 
                    label={"Setting Name"}
                    placeholder='Contoh: Status Kaedah Bayaran'
                    defaultValue={new_setting.setting_name}
                    onChange={e => set_new_setting({...new_setting, setting_name: e.target.value})}
                    />
                    <Textarea 
                    label={"Setting Description"}
                    placeholder={'Contoh: Status Kaedah Bayaran. Nyahaktif fungsi ini akan memberi kesan terhadap pengguna anda untuk membuat bayaran sumbangan.'}
                    dvalue={new_setting.setting_description}
                    onChange={e => set_new_setting({...new_setting, setting_description: e.target.value})}
                    />
                    <div className='flex justify-between items-center'>
                        <Heading>Status Tetapan</Heading>
                        <Switch 
                            height={24}  
                            marginBottom={majorScale(1)}
                            color="teal"
                            className='text-lg' 
                            checked={new_setting.setting_status}
                            onChange={e => set_new_setting({...new_setting, setting_status: e.target.checked})}
                        />
                    </div>
                </div>
            </Modal>

            <section className='mt-6 space-y-6'>
                {
                    (setting.length > 0) && setting.map((item, index) => (
                        <div index={index} className='grid grid-cols-1 md:grid-cols-2 gap-3 justify-between items-center'>
                            <div>
                                <p className='font-semibold text-black-500 text-base'>{item.setting_name}</p>
                                <p className='font-normal text-slate-500 text-sm'>{item.setting_description}</p>
                            </div>
                            <div className='flex justify-end'>
                                <Switch 
                                    height={24}  
                                    marginBottom={majorScale(1)}
                                    color="teal"
                                    className='text-lg' 
                                    checked={item.setting_status}
                                    onChange={e => updateSetting(item.id, e.target.checked)}
                                />
                            </div>
                        </div>
                    ))
                }
            </section>

            <section className='mt-6'>
                <div className='flex justify-end items-center'>
                    <Button 
                    text={"Tambah Tetapan"}
                    onClick={open_modal}
                    />
                </div>
            </section>
        </div>
    );
}

export default AppSetting;