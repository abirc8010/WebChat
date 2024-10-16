import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../services/socket";
import {
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import NoteIcon from "@mui/icons-material/Note";
import GifBoxIcon from "@mui/icons-material/GifBox";
import SendIcon from "@mui/icons-material/Send";
import VideoCameraIcon from "@mui/icons-material/VideoCameraFront";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import { cloudinaryUpload } from "../../services/cloudinary";
import "./composer.css";
import { selectMessages } from "../../redux/slices/messagesSlice";
import GifStickerDialog from "../Dialogs/GifStickerDialog/gifStickerDialog";
const Composer = ({ reply, setReply }) => {
  const currentEmail = useSelector((state) => state.contacts.currentEmail);
  const currentContactType = useSelector(
    (state) => state.contacts.currentContactType
  );
  const currentChatId = useSelector((state) => state.contacts.currentChatId);
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const chats = useSelector(selectMessages);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  console.log(chats);
  const handleSendMessage = async () => {
    if ((currentEmail || currentChatId) && (message || mediaUrl)) {
      const content = mediaUrl ? `${mediaType}` : message;

      const messageData = {
        senderEmail: user.email,
        receiverEmail: currentEmail,
        content,
        mediaUrl,
        groupId: currentContactType === "Group" ? currentChatId : null,
        replyTo: reply ? reply : null,
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
    if (type === "GIF") {
      setMediaType(type);
      console.log("GIF");
      setOpen(true);
    } else if (type === "Sticker") {
      setMediaType(type);
      console.log("Sticker");
      setOpen(true);
    } else {
      try {
        const url = await cloudinaryUpload(file);
        setMediaUrl(url);
        setMediaType(type);
        setAnchorEl(null);
        handleSendMessage();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleClickAttachFile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  let replyMessageContent = reply
    ? chats.find((msg) => msg._id === reply)
    : null;
  const handleClearReply = () => {
    setReply(null);
  };
  return (
    <>
      <GifStickerDialog
        type={mediaType}
        setMediaUrl={setMediaUrl}
        open={open}
        setOpen={setOpen}
        handleSendMessage={handleSendMessage}
      />
      {replyMessageContent && (
        <div>
          <Box className="reply-box">
            <div className="reply-header">
              <div>{replyMessageContent.sender.username}</div>
              <IconButton onClick={handleClearReply} sx={{ marginLeft: "8px" }}>
                <CloseIcon fontSize="small" sx={{ color: "#ffffff" }} />
              </IconButton>
            </div>

            <Typography variant="body2" className="reply-content">
              {replyMessageContent.content}
            </Typography>
          </Box>
        </div>
      )}
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
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            marginLeft: "10px",
          }}
          color="primary"
        >
          <ListIcon sx={{ color: "#ffffff" }} />
        </IconButton>

        <SendIcon
          onClick={handleSendMessage}
          sx={{ marginLeft: "8px", color: "#ffffff", cursor: "pointer" }}
        >
          Send
        </SendIcon>

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
          <MenuItem onClick={() => handleFileUpload(null, "GIF")}>
            <GifBoxIcon sx={{ marginRight: "10px" }} /> GIF
          </MenuItem>
          <MenuItem onClick={() => handleFileUpload(null, "Sticker")}>
            <NoteIcon sx={{ marginRight: "10px" }} /> Sticker
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default Composer;
