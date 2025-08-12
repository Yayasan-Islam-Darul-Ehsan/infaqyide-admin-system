import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';

import LottieCheck from '@/assets/lottie/lottie-check.json'
import LottieError from '@/assets/lottie/lottie-error.json'

AnimatedLotties.propTypes = {
    
};

function AnimatedLotties({ title = "", description = "", status = true || false }) {

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: status === true ? LottieCheck : LottieError,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='w-full justify-center items-center'>
            <Lottie 
                options={defaultOptions}
                height={150}
                width={150} 
            />
            {
                title && description && (
                <div className='bg-white mx-auto text-center max-w-md mt-3'>
                    <p className='font-semibold text-gray-600 text-sm'>{title}</p>
                    <p className='text-gray-500 text-xs'>{description}</p>
                </div>
                )
            }
        </div>
    );
}

export default AnimatedLotties;