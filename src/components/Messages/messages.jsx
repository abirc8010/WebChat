import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import socket from "../../services/socket";
import apiClient from "../../services/axiosConfig";
import "./messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const email = user.email;
  const currentEmail = useSelector((state) => state.contacts.currentEmail);

  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.get("/api/v1/users/messages", {
          params: {
            senderEmail: email,
            receiverEmail: currentEmail,
          },
        });
        setMessages(response.data);
      } catch (err) {
        console.log("Error fetching messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [email, currentEmail]);

  useEffect(() => {
    const handleReceiveMessage = (savedMessage) => {
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

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

  return (
    <div className="message-container">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="message-divider">
            <div className="bulge"></div>
            <span>{date}</span>
          </div>
          <div className="message-group">
            {msgs.map((message) => (
              <div
                key={message._id}
                className={`message ${
                  message.sender.email === email ? "sent" : "received"
                }`}
              >
                <strong>{message.sender.username}:</strong> {message.content}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Messages;
