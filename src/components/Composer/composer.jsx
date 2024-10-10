import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../services/socket";
import { TextField, Button } from "@mui/material";
import "./composer.css";

const Composer = () => {
  const dispatch = useDispatch();
  const currentEmail = useSelector((state) => state.contacts.currentEmail);
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (currentEmail && message) {
      const messageData = {
        senderEmail: user.email,
        receiverEmail: currentEmail,
        content: message,
      };

      socket.emit("sendMessage", messageData);
      setMessage("");
    } else {
      console.log("Please select a contact and enter a message.");
    }
  };

  return (
    <div className="composer-container">
      <TextField
        variant="outlined"
        multiline
        minRows={1}
        maxRows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          sx: {
            fontSize: "12px",
            height: "35px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "white",
          },
        }}
        sx={{ overflowY: "auto" }}
        placeholder="Type your message..."
      />
      <Button
        onClick={handleSendMessage}
        variant="contained"
        size="small"
        sx={{ marginLeft: "5px" }}
      >
        Send
      </Button>
    </div>
  );
};

export default Composer;
