import { useState } from "react";
import PreviewDialog from "../../Dialogs/PreviewDialog/PreviewDialog";
import "./media.css";

export default function Media({ mediaUrl, mediaType }) {
  const [open, setOpen] = useState(false);

  const handleMediaClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="message-media" onClick={handleMediaClick}>
        {mediaType === "video" ? (
          <video controls className="message-media">
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={mediaUrl} alt="media" />
        )}
      </div>

      <PreviewDialog
        open={open}
        onClose={() => setOpen(false)}
        mediaUrl={mediaUrl}
        mediaType={mediaType}
      />
    </>
  );
}
