import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ListLoading from '@/components/skeleton/ListLoading';
import { Alert } from 'evergreen-ui';
import Loading from '@/components/Loading';
import useWidth from '@/hooks/useWidth';
import { Link } from 'react-router-dom';

InfoMaklumatKariah.propTypes = {
    
};

function InfoMaklumatKariah(props) {

    const [loading, set_loading]    = useState(true)
    const [isKariah, setIsKariah]   = useState(false)
    const { width, breakpoints }    = useWidth();

    useEffect(() => {
        setTimeout(() => {
            set_loading(false)
        }, 1000);
    }, [])

    return (
        <div>
            {
                loading && <Loading />
            }        

            {
                !loading && (
                    <section>
                        <div className='flex flex-row items-center gap-4'>
                            <p className={`font-semibold text-gray-900 ${width <= breakpoints.md ? 'text-sm' : 'text-2xl'}`}>Maklumat Ahli Kariah</p>
                            <Link to={"/ahli-kariah/register"} className='btn bg-teal-500 px-5 py-3 rounded shadow-sm text-white'>Daftar Ahli Kariah</Link>
                        </div>

                        <div className='mt-6'>
                            {
                                isKariah === false && 
                                <Alert intent='danger' title="Bukan Ahli Kariah">
                                    Harap maaf! Anda bukan salah seorang daripada ahli kariah. Sila klik pada butang di atas untuk mendaftar sebagai ahli kariah.
                                </Alert>
                            }
                        </div>
                    </section>
                )
            }
        </div>
    );
}

export default InfoMaklumatKariah;