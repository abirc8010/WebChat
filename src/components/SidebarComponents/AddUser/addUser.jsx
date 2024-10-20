import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import apiClient from "../../../services/axiosConfig";
import socket from "../../../services/socket";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addContactToState } from "../../../redux/slices/contactsSlice";
import "./addUser.css";

export default function AddUser() {
  const dispatch = useDispatch();
  const [addedEmail, setAddedEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const userEmail = useSelector((state) => state.auth.user.email);
  const contactList = useSelector((state) => state.contacts.contacts);

  useEffect(() => {
    socket.on("contactAdded", (addedUser) => {
      dispatch(addContactToState(addedUser));
      setFeedbackMessage(`Contact ${addedUser.email} added successfully!`);
      setOpenSnackbar(true);
    });

    socket.on("error", (errorMessage) => {
      setFeedbackMessage(`Error: ${errorMessage}`);
      setOpenSnackbar(true);
    });
  }, []);

  useEffect(() => {
    if (addedEmail) {
      const searchUsers = async () => {
        try {
          const response = await apiClient.get("/api/v1/users/search", {
            params: { query: addedEmail },
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [addedEmail]);

  const handleAddContact = (addedEmail) => {
    const exists = Object.entries(contactList.contacts).some(
      ([, contact]) => contact.email === addedEmail
    );

    if (exists) {
      setFeedbackMessage("User already exists in your contacts");
      setOpenSnackbar(true);
      return;
    }

    if (userEmail === addedEmail) {
      setFeedbackMessage("You cannot add yourself as a contact");
      setOpenSnackbar(true);
      return;
    }

    if (!addedEmail || !userEmail) {
      setFeedbackMessage("Please enter a valid email");
      setOpenSnackbar(true);
      return;
    }

    socket.emit("addContact", { adderEmail: userEmail, addedEmail });
    setAddedEmail("");
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "rgba(255,255,255,0.8)" }}>
        Add User
      </h1>
      <div className="search-box">
        <TextField
          label="Enter email to add"
          variant="outlined"
          value={addedEmail}
          onChange={(e) => setAddedEmail(e.target.value)}
          required
          margin="normal"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            width: "95%",
          }}
        />
      </div>
      {searchResults.length > 0 && (
        <List>
          {searchResults.map((result) => (
            <ListItem
              key={result._id}
              className="list-item"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="add"
                  onClick={() => handleAddContact(result.email)}
                >
                  <AddIcon style={{ color: "#ffffff" }} />
                </IconButton>
              }
            >
              <Avatar alt={result.username} src={result.profilePicture} />
              <Box style={{ marginLeft: "16px" }}>
                <ListItemText
                  primary={result.username}
                  secondary={result.email}
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  secondaryTypographyProps={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={feedbackMessage}
      />
    </div>
  );
}
