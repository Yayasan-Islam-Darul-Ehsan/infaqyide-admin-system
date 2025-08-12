import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Icons from '@/components/ui/Icon';
import useWidth from '@/hooks/useWidth';
import { useNavigate } from 'react-router-dom';

SenaraiKhairatKematian.propTypes = {
    
};

function SenaraiKhairatKematian(props) {

    const navigate = useNavigate()
    const { width, breakpoints } = useWidth()

    return (
        <div>
            <section>
                <div className='flex flex-row justify-between items-center gap-4'>
                    <div>
                        <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Senarai Transaksi Khairat Kematian</p>  
                        <p className={`text-sm text-gray-500`}>Berikut adalah senarai ahli kariah yang berdaftar di bawah institusi anda. Klik pada senarai kariah di bawah untuk melihat maklumat lanjut.</p>  
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:folder-arrow-down'} className={'text-lg'}/>Muat Turun Senarai
                        </Button>
                        <Button className='bg-white border border-gray-200 shadow-sm items-center gap-2 font-medium text-sm'>
                            <Icons icon={'heroicons:printer'} className={'text-lg'}/>Cetak Senarai
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SenaraiKhairatKematian;