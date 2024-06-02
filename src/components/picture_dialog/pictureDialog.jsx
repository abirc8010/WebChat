import React from 'react';
import { Dialog, DialogTitle, DialogContent, Avatar, Button } from '@mui/material';


const UploadPictureDialog = ({ open, onClose, currentPicture, onPictureUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onPictureUpload(file);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Picture</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Avatar alt="Profile Picture" src={currentPicture} sx={{ width: 150, height: 150 }} />
        </div>
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2, mx: 'auto', display: 'block', minWidth: 'auto', p: '6px 12px' }}
        >
          Change Picture
          <input
            accept="image/*"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPictureDialog;
