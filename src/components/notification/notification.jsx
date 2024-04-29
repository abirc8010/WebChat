
import { CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';

export default function Notification({ openDialog, handleCloseDialog }) {
    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Login Successful!"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <CircularProgress color="inherit" size={24} thickness={4} sx={{ color: 'green', marginRight: 2 }} />
                    Your login was successful. You will be redirected shortly.
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}
