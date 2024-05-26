import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import "./settings.css";
const SettingsDialog = ({ socket, openConfig, onClose, setImgUrl, userEmail, setProfilePicture, profilePicture,setAuthenticUser }) => {
    const [selectedBackground, setSelectedBackground] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
         localStorage.removeItem('currentUsername');
         window.location.reload();
        setAuthenticUser(false);
    }
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        console.log(socket);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result);
                // Emit profile picture data to the server using Socket.IO
                if (socket) {
                    const fileData = reader.result.split(',')[1]; // Remove data URL prefix
                    console.log(typeof (fileData));
                    socket.emit("uploadProfilePicture", { email:userEmail, fileData });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="setting">
            <div className="profile-pic" style={{ position: 'relative' }}>
                <img src={profilePicture} className='picture' alt="Profile Picture" />
                <IconButton
                    style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', borderRadius: '50%' }}
                    component="label"
                >
                    <PhotoCamera />
                    {/* Input field for selecting profile picture */}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePictureChange} />
                </IconButton>
            </div>
            <div style={{ padding: "10px 20px -1px 20px" }}>
                <div>
                    <p style={{ marginBottom: "10px", color: "white" }}>Select chat background:</p>
                    <Grid container spacing={2} sx={{ padding: "10px 10px 10px 10px" }}>
                        <Grid container spacing={2} sx={{ padding: "10px 10px 10px 10px" }}>
                            <Grid item xs={4}>
                                <img
                                    src="chat2.jpg"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: selectedBackground === "Background1" ? '2px solid blue' : 'none'
                                    }}
                                    onClick={() => setImgUrl("chat2.jpg")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <img
                                    src="chat.jpg"
                                    alt="Chat Background"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: selectedBackground === "Background1" ? '2px solid blue' : 'none'
                                    }}
                                    onClick={() => setImgUrl("chat.jpg")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <img
                                    src="chat5.jpg"
                                    alt="Chat Background"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: selectedBackground === "Background2" ? '2px solid blue' : 'none'
                                    }}
                                    onClick={() => setImgUrl("chat5.jpg")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <img
                                    src="chat4.jpg"
                                    alt="Chat Background"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: selectedBackground === "Background2" ? '2px solid blue' : 'none'
                                    }}
                                    onClick={() => setImgUrl("chat4.jpg")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <img
                                    src="chat1.jpg"
                                    alt="Chat Background"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: selectedBackground === "Background2" ? '2px solid blue' : 'none'
                                    }}
                                    onClick={() => setImgUrl("chat1.jpg")}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <img
                                    src="chat3.jpg"
                                    alt="Chat Background"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: selectedBackground === "Background3" ? '2px solid blue' : 'none'
                                    }}
                                    onClick={() => setImgUrl("chat3.jpg")}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<ExitToAppIcon />}
                sx={{padding:"5px 5px 5px 8px"}}   
                onClick={handleLogout}            
            >
                Logout
            </Button>
        </div>
    );
};

export default SettingsDialog;