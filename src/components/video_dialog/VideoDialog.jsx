import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const VideoDialog = ({ open, videoUrl, onClose }) => {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);

  const handleResize = (event, { size }) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={false} maxWidth={false}>
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Resizable
          width={width}
          height={height}
          onResize={handleResize}
          minConstraints={[400, 200]}
          maxConstraints={[1000, 800]}
        >
          <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
            <video controls autoPlay style={{ width: '100%', height: '100%' }}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              style={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Close />
            </IconButton>
          </div>
        </Resizable>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
