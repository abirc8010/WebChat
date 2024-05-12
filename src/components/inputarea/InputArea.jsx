import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MoodIcon from '@mui/icons-material/Mood';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import { Button } from '@mui/material';
import './InputArea.css';
const API_TOKEN = import.meta.env.VITE_GIPHY_API_KEY;
const TextFieldWithIcon = ({ setMessage, message, sendChat, socket, receiver,username,setChats,chats }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEmojiDialog, setOpenEmojiDialog] = useState(false);
  const [openGifsDialog, setOpenGifsDialog] = useState(false);
  const [openStickersDialog, setOpenStickersDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');

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

  const handleSendChat = (selectedUrl) => {
    console.log(selectedUrl);
    if (selectedUrl) {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const Time = day + '/' + month + '/' + year + "  ,  " + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
       
        const message = selectedUrl;
        const url=selectedUrl;
         socket.emit("private message", { receiver, message, username, Time,url });
        const updatedChats = { ...chats };
        if (!updatedChats[receiver]) {
            updatedChats[receiver] = [];
        }
        updatedChats[receiver].push({ receiver, message, username, Time ,url});

        console.log(updatedChats);
        setChats(updatedChats);
        setMessage('');
        handleCloseEmojiDialog();
        handleCloseGifsDialog();
        handleCloseStickersDialog();
         setSearchResults([]);
    }
  };

  return (
    <div className='input-container'>
      {/* Text field for message input */}
      <TextField
        variant="outlined"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <MoodIcon sx={{ cursor: "pointer" }} onClick={handleClickMenu} />
            </InputAdornment>
          ),
        }}
        className="input-msg"
      />
      
      {/* Send button */}
      <button type="submit" className="submit-btn" onClick={sendChat}>
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
      <Dialog open={openEmojiDialog} onClose={handleCloseEmojiDialog} fullWidth maxWidth="sm">
        <div className='add'>
        <DialogContent title="Select an Emoji">
          {/* Emoji picker content goes here */}
          <p>This is the Emoji picker dialog.</p>
        </DialogContent>
        </div>
      </Dialog>

      <Dialog open={openGifsDialog} onClose={handleCloseGifsDialog} fullWidth maxWidth="sm">
        <div className='add'>
        <DialogContent title="Search for GIFs">
          {/* GIF search content goes here */}
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
                onClick={() => {  handleSendChat(result.images.original.url);}}
              />
            ))}
          </div>
        </DialogContent>
        </div>
      </Dialog>

      <Dialog open={openStickersDialog} onClose={handleCloseStickersDialog} fullWidth maxWidth="sm">
        <div className='add'>
        <DialogContent title="Search for Stickers">
          {/* Sticker search content goes here */}
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
                  () =>{
                   handleSendChat(result.images.original.url);
                   }
                }
              />
            ))}
          </div>
        </DialogContent>
        </div>
      </Dialog>
    </div>
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
