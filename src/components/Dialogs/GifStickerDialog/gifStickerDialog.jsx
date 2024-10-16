import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import "./gifStickerDialog.css";

const GifStickerDialog = ({
  type,
  setMediaUrl,
  open,
  setOpen,
  handleSendMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
  const GIPHY_BASE_URL = "https://api.giphy.com/v1/";

  useEffect(() => {
    const fetchTrendingGifsOrStickers = async () => {
      const endpoint = type === "GIF" ? "gifs/trending" : "stickers/trending";
      const response = await fetch(
        `${GIPHY_BASE_URL}${endpoint}?api_key=${GIPHY_API_KEY}&limit=10`
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data.data);
      } else {
        console.error("Error fetching trending data from Giphy API");
      }
    };

    fetchTrendingGifsOrStickers();
  }, [type, GIPHY_API_KEY]);

  useEffect(() => {
    if (searchTerm) {
      const fetchGifsOrStickers = async () => {
        const endpoint = type === "GIF" ? "gifs/search" : "stickers/search";
        const response = await fetch(
          `${GIPHY_BASE_URL}${endpoint}?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=10`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data.data);
        } else {
          console.error("Error fetching data from Giphy API");
        }
      };

      fetchGifsOrStickers();
    } else {
      setResults([]);
    }
  }, [searchTerm, type, GIPHY_API_KEY]);

  const handleSelect = (url) => {
    setMediaUrl(url);
    if (url) handleSendMessage();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { maxHeight: "400px", overflowY: "auto" },
      }}
    >
      <DialogTitle>
        {type === "GIF" ? "Select a GIF" : "Select a Sticker"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`Search ${type === "GIF" ? "GIFs" : "Stickers"}`}
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="image-grid">
          {results.map((item) => (
            <div
              key={item.id}
              className="image-item"
              onClick={() => handleSelect(item.images.fixed_height.url)} // Adjust based on type
            >
              <img
                src={
                  type === "GIF"
                    ? item.images.fixed_height.url
                    : item.images.original.url
                }
                alt={item.title}
                className="image"
              />
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GifStickerDialog;
