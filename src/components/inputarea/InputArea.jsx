import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import MoodIcon from '@mui/icons-material/Mood';
import SendIcon from '@mui/icons-material/Send';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoIcon from '@mui/icons-material/Photo';
import VideocamIcon from '@mui/icons-material/Videocam';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import { Button, IconButton, Typography } from '@mui/material';
import MicrophoneIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import './InputArea.css';
import { styled } from '@mui/system';
const API_TOKEN = import.meta.env.VITE_GIPHY_API_KEY;


const CustomEditIcon = styled(EditIcon)({
  fontSize: 22,
});
const CustomSpeedDialIcon = styled(SpeedDialIcon)({
  fontSize: 20,
});
const OpenIconSpeedDial = ({setUploadSelection,handleFileUpload}) => {
  const actions = [
  {
    icon:  <IconButton             
              onClick={(event) => {  setUploadSelection('pdf') }}
              component="label"
            >
              <PictureAsPdfIcon sx={{color:"red"}}/>
              <input type="file" accept="pdf/*" style={{ display: 'none' }}  onChange={handleFileUpload} />

            </IconButton>, name: 'Pdf'
  },
  { icon: <IconButton             
              onClick={(event) => {  setUploadSelection('image') }}
              component="label"
            >
              <PhotoIcon sx={{color:"green"}} />
              <input type="file" accept="image/*" style={{ display: 'none' }}  onChange={handleFileUpload} />

            </IconButton>
  , name: 'Image' },
  { icon: <IconButton             
              onClick={(event) => {  setUploadSelection('pdf') }}
              component="label"
            >
              <VideocamIcon sx={{color:"black"}}/>
              <input type="file" accept="video/*" style={{ display: 'none' }}  onChange={handleFileUpload} />

            </IconButton>, name: 'Video' },
];
  return (
    <Box sx={{ zIndex: 5, height: 320, width: 70, transform: 'translateZ(0px)', flexGrow: 1, mb: 11 }}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        icon={<CustomSpeedDialIcon openIcon={<CustomEditIcon />} />}

        sx={{
          '& .MuiFab-primary': {
            width: 40,
            height: 40,
          }
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction

            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}

          />
        ))}
      </SpeedDial>
    </Box>
  );
}
const TextFieldWithIcon = ({ setMessage, message, sendChat, socket, receiver, userEmail, setChats, chats, setReply, reply, setTyping, msgtype, userName }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEmojiDialog, setOpenEmojiDialog] = useState(false);
  const [openGifsDialog, setOpenGifsDialog] = useState(false);
  const [openStickersDialog, setOpenStickersDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [listening, setListening] = useState(false); // State to track whether speech recognition is active
  const [speechRecognition, setSpeechRecognition] = useState(null); // State to hold the SpeechRecognition object
  const [uploadSelection, setUploadSelection] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
 
  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      sendChat(event);
    }
  }
  const handleInput = (e) => {
    setMessage(e.target.value); // Update the message state

  };
  // Function to handle starting and stopping speech recognition
  const toggleSpeechRecognition = () => {
    if (!listening) {
      // Start speech recognition
      speechRecognition.start();
      setListening(true);
    } else {
      // Stop speech recognition
      speechRecognition.stop();
      setListening(false);
    }
  };
  const receiverRef = useRef(receiver);

  // Update the receiverRef when receiver changes
  useEffect(() => {
    receiverRef.current = receiver;
  }, [receiver]);
  useEffect(() => {
    const inputMsg = document.querySelector(".input-msg");

    if (inputMsg) {
      inputMsg.addEventListener("keydown", (event) => {

        socket.emit("typing", { userEmail, userName, receiver, msgtype });

      });
      inputMsg.addEventListener("keyup", () => {
        socket.emit("stopTyping", "");
      });
    }
  }, [message]);
  useEffect(() => {


    const handleTyping = (data) => {

      if (data.receiver === userEmail && data.userEmail === receiverRef.current) {
        if (data.msgtype !== "group")
          setTyping('Typing..');
      }
    };

    // Event listener for receiving stopTyping notification
    const handleStopTyping = () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout); // Clear the existing timeout
      }
      setTypingTimeout(setTimeout(() => {
        setTyping('');
      }, 2000));
    };

    // Attach event listeners
    socket.on("notifyTyping", handleTyping);
    socket.on("notifyStopTyping", handleStopTyping);

    // Detach event listeners when component unmounts
    return () => {
      socket.off("notifyTyping", handleTyping);
      socket.off("notifyStopTyping", handleStopTyping);
    };
  }, []); // Include socket dependency to prevent re-subscribing on each render

  useEffect(() => {
    // Check if the SpeechRecognition API is available in the browser
    if ('webkitSpeechRecognition' in window) {
      // Create a new SpeechRecognition object
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false; // Stop listening after a single speech input
      recognition.lang = 'en-US'; // Language for speech recognition

      // Event listener for receiving speech recognition results
      recognition.onresult = (event) => {
        // Concatenate the transcript to the existing message
        const transcript = event.results[0][0].transcript;
        setMessage(prevMessage => prevMessage + ' ' + transcript);
      };

      // Save the SpeechRecognition object to state
      setSpeechRecognition(recognition);
    } else {
      // SpeechRecognition API not available, handle accordingly (e.g., display error message)
      console.error('Speech recognition not supported in this browser');
    }
  }, []); // Run only once on component mount


  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuOptionClick = (option) => {
    handleCloseMenu();
    switch (option) {
      case 'emoji':
        setOpenEmojiDialog(true);
        setSearchType('emoji');
        break;
      case 'gifs':
        setOpenGifsDialog(true);
        setSearchType('gifs');
        break;
      case 'stickers':
        setOpenStickersDialog(true);
        setSearchType('stickers');
        break;
      default:
        break;
    }
  };

  const handleCloseEmojiDialog = () => {
    setOpenEmojiDialog(false);
  };

  const handleCloseGifsDialog = () => {
    setOpenGifsDialog(false);
  };

  const handleCloseStickersDialog = () => {
    setOpenStickersDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      let apiUrl = '';
      if (searchType === 'gifs') {
        apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${API_TOKEN}`;
      } else if (searchType === 'stickers') {
        apiUrl = `https://api.giphy.com/v1/stickers/search?q=${searchTerm}&api_key=${API_TOKEN}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSendChat = (type, selectedUrl) => {

    if (selectedUrl) {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const Time = day + '/' + month + '/' + year + "  ,  " + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();

      const message = uploadSelection;
      const url = selectedUrl;

      if (receiver != "You")
        socket.emit("send privateMessage", { receiver: (msgtype === "group" ? userEmail : receiver), message: uploadSelection || type, email: (msgtype === "group" ? receiver : userEmail), Time, url, reply, type: msgtype, name: (msgtype === "group" ? userName : null) });
      const updatedChats = { ...chats };
      if (!updatedChats[receiver]) {
        updatedChats[receiver] = [];
      }
      updatedChats[receiver].push({ receiver: (msgtype === "group" ? userEmail : receiver), message: uploadSelection || type, email: (msgtype === "group" ? receiver : userEmail), Time, url, reply, type: msgtype, name: (msgtype === "group" ? userName : null) });
      setReply([]);
      setChats(updatedChats);
      console.log("Chats: ", updatedChats);
      setMessage('');
      handleCloseEmojiDialog();
      handleCloseGifsDialog();
      handleCloseStickersDialog();
      setSearchResults([]);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // If no file is selected, do nothing


    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${uploadSelection}/upload`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      const imageUrl = responseData.secure_url;
      handleSendChat(uploadSelection, imageUrl);

      // Further processing or storing the URL as needed

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <>
      <div className='input-container'>

        <OpenIconSpeedDial handleFileUpload={handleFileUpload} setUploadSelection={setUploadSelection}/>

        <TextField
          variant="outlined"
          placeholder="Enter your message"
          value={message}
          onInput={handleInput}
          onKeyDown={handleKeypress}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      cursor: "pointer",
                      fontSize: {
                        xs: '20px', // font size for extra small screens
                        sm: '25px', // font size for small screens
                        md: '30px', // font size for medium screens
                        lg: '31px'  // font size for large screens
                      },
                      '@media (max-width: 600px)': {
                        fontSize: '20px' // font size for very small screens
                      }
                    }}
                    onClick={handleClickMenu} // Replace with your handleClickMenu function
                  >
                    <MoodIcon />
                  </IconButton>
               
                  <IconButton

                    onClick={toggleSpeechRecognition}
                    sx={{
                      cursor: "pointer",
                      fontSize: {
                        xs: '20px', // font size for extra small screens
                        sm: '25px', // font size for small screens
                        md: '30px', // font size for medium screens
                        lg: '31px'  // font size for large screens
                      },
                      '@media (max-width: 600px)': {
                        fontSize: '20px' // font size for very small screens
                      }
                    }}>
                    <span
                      className="microphone-icon"
                    >
                      {listening ? (
                        <StopIcon />
                      ) : (
                        <MicrophoneIcon />
                      )}
                    </span>
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
          multiline
          minRows={1}
          maxRows={4}
          className="input-msg"
          sx={{ overflowY: 'auto' }}
        />

        {/* Send button */}
        <button type="submit" className="submit-btn" onClick={(message) ?sendChat : null}>
          <SendIcon sx={{ fontSize: "30px" }} />
        </button>

        {/* Menu for smile icon */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => { handleMenuOptionClick('emoji'); }}>Emoji</MenuItem>
          <MenuItem onClick={() => { handleMenuOptionClick('gifs'); }}>GIFs</MenuItem>
          <MenuItem onClick={() => { handleMenuOptionClick('stickers'); }}>Stickers</MenuItem>
        </Menu>
        

        {/* Dialogs for emoji, GIFs, and stickers */}
        {/* Emoji dialog */}
        <Dialog open={openEmojiDialog} onClose={handleCloseEmojiDialog} fullWidth maxWidth="sm">
          <div className='add'>
            <DialogContent title="Select an Emoji">
              {/* Emoji picker content goes here */}
              <p>This is the Emoji picker dialog.</p>
            </DialogContent>
          </div>
        </Dialog>

        {/* GIFs dialog */}
        <Dialog open={openGifsDialog} onClose={handleCloseGifsDialog} fullWidth maxWidth="sm">
          <div className='add'>
            <DialogContent>
              <Typography variant="h6" sx={{ color: "rgb(225,225,225)", mb: 1 }}>Search For GIFs</Typography>
              <TextField
                sx={{ mb: 2, backgroundColor: 'white', borderRadius: '50px' }}
                variant="outlined"
                placeholder="Search for GIFs"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button sx={{ backgroundColor: "rgb(0,0,225)", color: "white", mt: 1, ml: 2 }} onClick={handleSearchSubmit}>Search</Button>
              {/* Display GIF results */}
              <div className="gif-grid">
                {/* Map through searchResults and display each GIF */}
                {searchResults.map((result, index) => (
                  <img
                    key={index}
                    src={result.images.original.url}
                    alt={`GIF ${index}`}
                    className="gif-item"
                    onClick={() => { handleSendChat("Sticker", result.images.original.url); }}
                  />
                ))}
              </div>
            </DialogContent>
          </div>
        </Dialog>

        {/* Stickers dialog */}
        <Dialog open={openStickersDialog} onClose={handleCloseStickersDialog} fullWidth maxWidth="sm">
          <div className='add'>
            <DialogContent >
              <Typography variant="h6" sx={{ color: "rgb(225,225,225)", mb: 1 }}>Search For Stickers</Typography>

              <TextField
                sx={{ mb: 2, backgroundColor: 'white', borderRadius: '50px' }}
                variant="outlined"
                placeholder="Search for stickers"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button sx={{ backgroundColor: "rgb(0,0,225)", color: "white", mt: 1, ml: 2 }} onClick={handleSearchSubmit}>Search</Button>
              {/* Display sticker results */}
              <div className="sticker-grid">
                {/* Map through searchResults and display each sticker */}
                {searchResults.map((result, index) => (
                  <img
                    key={index}
                    src={result.images.original.url}
                    alt={`Sticker ${index}`}
                    className="sticker-item"
                    onClick={
                      () => {
                        handleSendChat("Sticker", result.images.original.url);
                      }
                    }
                  />
                ))}
              </div>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </>
  );
};

const DialogContent = ({ title, children }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default TextFieldWithIcon;
