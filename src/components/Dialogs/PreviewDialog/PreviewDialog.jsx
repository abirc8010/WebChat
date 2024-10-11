import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export default function MediaDialog({ open, onClose, mediaUrl, mediaType }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <ResizableBox
        width={250}
        height={250}
        minConstraints={[300, 300]}
        maxConstraints={[1200, 800]}
        resizeHandles={["se"]}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <DialogTitle>Media</DialogTitle>

        <DialogContent
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {mediaType === "video" ? (
            <video
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt="media"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </ResizableBox>
    </Dialog>
  );
}

MediaDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mediaUrl: PropTypes.string.isRequired,
  mediaType: PropTypes.oneOf(["image", "video"]).isRequired,
};
