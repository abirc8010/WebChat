import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../services/socket";
import {
  fetchMessages,
  addMessage,
  selectMessages,
  selectLoading,
} from "../../redux/slices/messagesSlice";
import { fetchGroupMembers } from "../../redux/slices/groupSlice";
import Media from "./Media/media";
import MessageDropDown from "./MessageDropDown/messageDropDown";
import "./messages.css";

const Messages = ({ setReply }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectLoading);
  const currentChatId = useSelector((state) => state.contacts.currentChatId);
  const currentContactType = useSelector(
    (state) => state.contacts.currentContactType
  );
  const user = useSelector((state) => state.auth.user);
  const email = user.email;
  const currentEmail = useSelector((state) => state.contacts.currentEmail);
  const members = useSelector((state) => state.group.members);
  const endOfMessagesRef = useRef(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  useEffect(() => {
    if (currentChatId && currentContactType === "Group") {
      dispatch(fetchGroupMembers(currentChatId));
    }
  }, [currentChatId, currentContactType, dispatch]);

  useEffect(() => {
    dispatch(
      fetchMessages({ email, currentEmail, currentChatId, currentContactType })
    );
  }, [dispatch, email, currentEmail, currentChatId, currentContactType]);

  useEffect(() => {
    const handleReceiveMessage = (savedMessage) => {
      dispatch(addMessage(savedMessage));
      if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();

    if (
      messageDate.getFullYear() === today.getFullYear() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getDate() === today.getDate()
    ) {
      return "Today";
    } else {
      const day = String(messageDate.getDate()).padStart(2, "0");
      const month = String(messageDate.getMonth() + 1).padStart(2, "0");
      const year = messageDate.getFullYear();

      return `${day}/${month}/${year}`;
    }
  };
  const groupedMessages = messages.reduce((acc, message) => {
    const date = formatDate(message.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  const filteredGroupedMessages = Object.entries(groupedMessages).reduce(
    (acc, [date, msgs]) => {
      const filteredMsgs = msgs.filter((message) => {
        return (
          (currentChatId === message.receiver.id &&
            user._id === message.sender._id) ||
          (message.receiver.id === user._id &&
            currentChatId === message.sender._id) ||
          (message.receiver.id === currentChatId &&
            currentContactType === "Group")
        );
      });
      if (filteredMsgs.length > 0) {
        acc[date] = filteredMsgs;
      }
      return acc;
    },
    {}
  );

  const renderMediaContent = (mediaType, mediaUrl) => {
    if (!mediaUrl) return null;
    return <Media mediaUrl={mediaUrl} mediaType={mediaType} />;
  };

  const scrollToMessage = (replyToId) => {
    const messageElement = document.getElementById(replyToId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth" });
      setHighlightedMessageId(replyToId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  const convert = (utcDate) => {
    const date = new Date(utcDate);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    const hours = istDate.getUTCHours().toString().padStart(2, "0");
    const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const findMemberById = (id) => {
    return members.find((member) => member._id === id);
  };

  return (
    <div className="message-container">
      {Object.entries(filteredGroupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="message-divider">
            <div className="bulge"></div>
            <span>{date}</span>
          </div>
          <div className="message-group">
            {msgs.map((message) => {
              const member = findMemberById(message.sender._id);
              const profilePicture = member ? member.profilePicture : null;

              return (
                <div
                  key={message._id}
                  id={message._id}
                  className={`message ${
                    message.sender.email === email ? "sent" : "received"
                  } ${highlightedMessageId === message._id ? "highlight" : ""}`}
                >
                  <div className="message-sender-info">
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        marginLeft: "5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {profilePicture && (
                        <img
                          src={profilePicture}
                          alt={message.sender.username}
                          className="sender-profile-picture"
                        />
                      )}
                      {message.sender.email == user.email
                        ? "You"
                        : message.sender.username}
                    </div>
                    <div>
                      <MessageDropDown
                        messageId={message._id}
                        onReply={setReply}
                      ></MessageDropDown>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "rgba(255,255,255,1)",
                    }}
                  >
                    {message.replyTo?._id && (
                      <div
                        className="message-reply-box"
                        onClick={() => scrollToMessage(message.replyTo._id)}
                      >
                        <span className="message-reply">
                          {message.replyTo.content}
                        </span>
                      </div>
                    )}
                    {message.mediaUrl ? null : message.content}
                  </div>
                  {renderMediaContent(message.content, message.mediaUrl)}
                  <div
                    style={{
                      textAlign: "right",
                      width: "100%",
                      fontSize: "0.7rem",
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {convert(message.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Messages;
