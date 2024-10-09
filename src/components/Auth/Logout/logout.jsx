
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('email'); 
        navigate('/');
    };

    return (
        <button onClick={handleLogout} style={{ background: 'red', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
            Logout
        </button>
    );
};

export default LogoutButton;
