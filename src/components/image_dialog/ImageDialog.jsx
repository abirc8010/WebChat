import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ImageDialog = ({ open, imageUrl, onClose }) => {
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleClose = () => {
    onClose();
  };

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = 'image.jpg';
    anchor.click();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>View Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <img src={imageUrl} alt="Selected Image" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleDownload} color="primary">
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
