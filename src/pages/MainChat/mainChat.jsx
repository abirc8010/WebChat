
import React from 'react';
import Sidebar from '../../components/Sidebar/sidebar';
import ChatLayout from '../../components/ChatLayout/chatLayout';
import './mainChat.css';

function MainChat() {
   

    return (
        <div className='container'>
            <Sidebar />
            <ChatLayout />
        </div>
    );
}

export default MainChat;
