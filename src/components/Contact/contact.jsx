import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentEmail,
  setCurrentUsername,
  setCurrentProfilePic,
  setCurrentChatId,
  setCurrentContactType,
} from "../../redux/slices/contactsSlice";
import "./contact.css";
const Contact = ({ user }) => {
  const { username, profilePicture, email, _id, type } = user;
  const dispatch = useDispatch();
  const handleSelect = () => {
    dispatch(setCurrentContactType(type || "Group"));
    dispatch(setCurrentChatId(_id));
    dispatch(setCurrentEmail(email));
    dispatch(setCurrentUsername(username));
    dispatch(setCurrentProfilePic(profilePicture));
  };

  return (
    <div className="contact" onClick={handleSelect}>
      <img
        src={profilePicture}
        alt={`${username}'s profile`}
        className="profile-pic"
      />
      <div className="contact-info">
        <div>{username}</div>
      </div>
    </div>
  );
};

export default Contact;
