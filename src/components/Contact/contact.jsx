
import React, { useEffect } from 'react';
import './contact.css';
const Contact = ({ user }) => {
  const { username, profilePicture} = user;

  return (
    <div className="contact">
      <img src={profilePicture} alt={`${username}'s profile`} className="profile-pic" />
      <div className="contact-info">
        <div>{username}</div>
      </div>
    </div>
  );
};

export default Contact;
