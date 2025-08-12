import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';

MaklumatLainLain.propTypes = {
    
};

function MaklumatLainLain(props) {

    const { user }                                      = useSelector(user => user.auth)
    const navigate                                      = useNavigate()
    const { width, breakpoints }                        = useWidth()

    let [data, set_data]                                = useState([])

    const FETCH_DATA = async () => {

    }

    const UPDATE_DATA = async () => {
        
    }

    return (
        <div>
            
        </div>
    );
}

export default MaklumatLainLain;