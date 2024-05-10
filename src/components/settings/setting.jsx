import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import "./settings.css";
const SettingsDialog = ({ openConfig, onClose,setImgUrl }) => {
    const [selectedBackground, setSelectedBackground] = useState('');

    const handleChange = (background) => {
        setSelectedBackground(background);

        setImgUrl(selectedBackground);
    };

    return (
        <Dialog open={openConfig} onClose={onClose} >
            <DialogTitle >Settings</DialogTitle>
            <DialogContent >
                <p>Select chat background:</p>
                <Grid container spacing={2}>
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
                            onClick={() => handleChange("chat2.jpg")}
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
                            onClick={() => handleChange("chat.jpg")}
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
                            onClick={() => handleChange("chat5.jpg")}
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
                            onClick={() => handleChange("chat4.jpg")}
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
                            onClick={() => handleChange("chat1.jpg")}
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
                            onClick={() => handleChange("chat3.jpg")}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;
