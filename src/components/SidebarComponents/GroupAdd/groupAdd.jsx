import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContactToState } from "../../../redux/slices/contactsSlice";
import { Snackbar, Button, TextField } from "@mui/material";
import socket from "../../../services/socket";
import ContactCheckbox from "../../ContactsCheckBox/contactsCheckBox"; // Import the ContactCheckbox component

export default function GroupAdd() {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.contacts.contacts);
  const user = useSelector((state) => state.auth.user);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCheckboxChange = (contactId) => {
    setSelectedMembers((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateGroup = () => {
    if (selectedMembers.length < 2) {
      setSnackbarMessage("At least 2 members should be selected.");
      setSnackbarOpen(true);
      return;
    }

    const members = contacts
      .filter((contact) => selectedMembers.includes(contact._id))
      .map((contact) => ({
        _id: contact._id,
        email: contact.email,
      }));

    const groupData = {
      groupName,
      admin: user._id,
      adminEmail: user.email,
      members,
    };

    socket.emit("createGroup", groupData, (response) => {
      if (response.success) {
        setSnackbarMessage("Successful group creation!");
        setSnackbarOpen(true);
        setGroupName("");
        setSelectedMembers([]);
      } else {
        setSnackbarMessage(response.message || "Error creating group.");
        setSnackbarOpen(true);
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    socket.on("contactAdded", (groupObject) => {
      dispatch(addContactToState(groupObject));
    });

    return () => {
      socket.off("contactAdded");
    };
  }, [dispatch]);

  return (
    <div>
      <h1>Group Add</h1>
      <TextField
        label="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <h2>Contact List</h2>
      <ContactCheckbox
        contacts={contacts}
        selectedMembers={selectedMembers}
        onCheckboxChange={handleCheckboxChange}
      />
      <Button variant="contained" color="primary" onClick={handleCreateGroup}>
        Create Group
      </Button>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      />
    </div>
  );
}
