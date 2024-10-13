import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../services/socket";
import {
  fetchMessages,
  addMessage,
  selectMessages,
  selectLoading,
} from "../../redux/slices/messagesSlice";
import Media from "./Media/media";
import MessageDropDown from "./MessageDropDown/messageDropDown";
import "./messages.css";

const Messages = () => {
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

  const endOfMessagesRef = useRef(null);

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

  if (loading) {
    return <div>Loading messages...</div>;
  }

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
      return messageDate.toLocaleDateString();
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

  const handleEdit = (messageId) => {
    console.log("Edit message:", messageId);
  };

  const handleDelete = (messageId) => {
    // dispatch(deleteMessage(messageId));
  };

  const handleReply = (messageId) => {
    console.log("Reply to message:", messageId);
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
            {msgs.map((message) => (
              <>
                <div
                  key={message._id}
                  className={`message ${
                    message.sender.email === email ? "sent" : "received"
                  }`}
                >
                  {currentContactType === "Group" ? (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                      }}
                    >
                      {message.sender.username}
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {message.mediaUrl ? null : message.content}
                  </div>
                  {renderMediaContent(message.content, message.mediaUrl)}
                </div>
              </>
            ))}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Messages;
