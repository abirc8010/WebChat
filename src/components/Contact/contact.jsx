
import React, { useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { setCurrentEmail,setCurrentUsername,setCurrentProfilePic } from '../../redux/slices/contactsSlice';
import './contact.css';
const Contact = ({ user }) => {
  const { username, profilePicture,email} = user;
  const dispatch = useDispatch();
  const handleSelect = () => {
     dispatch(setCurrentEmail(email));
     dispatch(setCurrentUsername(username));
     dispatch(setCurrentProfilePic(profilePicture));
  }

  return (
    <div className="contact" onClick={handleSelect}>
      <img src={profilePicture} alt={`${username}'s profile`} className="profile-pic" />
      <div className="contact-info">
        <div>{username}</div>
      </div>
    </div>
  );
};

export default Contact;
