import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../services/socket";
import { TextField, Button, Menu, MenuItem, IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VideoCameraIcon from "@mui/icons-material/VideoCameraFront";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { cloudinaryUpload } from "../../services/cloudinary";
import "./composer.css";

const Composer = () => {
  const dispatch = useDispatch();
  const currentEmail = useSelector((state) => state.contacts.currentEmail);
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const handleSendMessage = async () => {
    if (currentEmail && (message || mediaUrl)) {
      const content = mediaUrl ? `${mediaType}` : message;

      const messageData = {
        senderEmail: user.email,
        receiverEmail: currentEmail,
        content,
        mediaUrl,
      };

      socket.emit("sendMessage", messageData);
      setMessage("");
      setMediaUrl(null);
      setMediaType(null);
    } else {
      console.log("Please select a contact and enter a message.");
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      const url = await cloudinaryUpload(file);
      setMediaUrl(url);
      setMediaType(type);
      setAnchorEl(null);
      handleSendMessage();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleClickAttachFile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

      <IconButton
        onClick={handleClickAttachFile}
        sx={{ marginLeft: "10px" }}
        color="primary"
      >
        <AttachFileIcon />
      </IconButton>

      <Button
        onClick={handleSendMessage}
        variant="contained"
        size="small"
        sx={{ marginLeft: "5px" }}
      >
        Send
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => document.getElementById("file-upload-image").click()}
        >
          <PhotoCameraIcon sx={{ marginRight: "10px" }} /> Upload Image
          <input
            id="file-upload-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0], "image")}
          />
        </MenuItem>
        <MenuItem
          onClick={() => document.getElementById("file-upload-video").click()}
        >
          <VideoCameraIcon sx={{ marginRight: "10px" }} /> Upload Video
          <input
            id="file-upload-video"
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0], "video")}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Composer;
