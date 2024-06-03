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
        localStorage.removeItem('uid');
        window.location.reload();
        setAuthenticUser(false);
    }

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result);
                // Emit profile picture data to the server using Socket.IO
                if (socket) {
                    const fileData = reader.result.split(',')[1]; // Remove data URL prefix
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
                            {[1,2,3,4,5,6].map((index) => (
                                <Grid item xs={4} key={index} style={{ transform: 'perspective(500px) rotateY(15deg) scale(1.1)',animation: `slidein${index} 1s ease-in-out infinite alternate` }}>
                                    <img
                                        src={`chat${index}.jpg`}
                                        alt={`Chat Background ${index}`}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: selectedBackground === `Background${index}` ? '2px solid blue' : 'none'
                                        }}
                                        onClick={() => setImgUrl(`chat${index}.jpg`)}
                                    />
                                </Grid>
                            ))}
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
