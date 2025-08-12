import React from 'react';
import PropTypes from 'prop-types';

import ErrorImage from "@/assets/images/all-img/404-2.svg";
import { Link } from 'react-router-dom';

function Expired(props) {
    return (
        <div>
            <div className="min-h-screen flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900">
            <img src={ErrorImage} alt="" />
            <div className="max-w-[546px] mx-auto w-full mt-12">
                <h4 className="text-slate-900 mb-4">Sesi Anda Telah Tamat</h4>
                <div className="dark:text-white text-base font-normal mb-10">Sila klik butang di bawah untuk log masuk semula.</div>
            </div>
            <div className="max-w-[300px] mx-auto w-full">
                <Link to="/" className="btn bg-teal-600 block text-center text-white">Log Masuk</Link>
            </div>
            </div>
        </div>
    );
}

export default Expired;