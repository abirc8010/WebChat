import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./chatHeader.css";
export default function ChatHeader() {
  const dispatch = useDispatch();
  const currentUsername = useSelector(
    (state) => state.contacts.currentUsername
  );
  const setCurrentProfilePic = useSelector(
    (state) => state.contacts.setCurrentProfilePic
  );
  return (
    <div className="chat-header">
      <img
        src={setCurrentProfilePic || "you.webp"}
        alt="pic"
        className="current-pic"
      />
      <div className="current-username">{currentUsername}</div>
    </div>
  );
}
