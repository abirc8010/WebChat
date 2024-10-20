import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContactsCheckbox from "../../ContactsCheckBox/contactsCheckBox";
import "./groupMembersDialog.css";
const GroupMembersDialog = ({ open, onClose, groupId, groupPicture }) => {
  const dispatch = useDispatch();
  const { admin, members, loading, error } = useSelector(
    (state) => state.group
  );
  const contacts = useSelector((state) => state.contacts.contacts.contacts);
  const user = useSelector((state) => state.auth.user);

  const [currentProfilePicture, setCurrentProfilePicture] =
    useState(groupPicture);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showContacts, setShowContacts] = useState(false);

  const handleChangePicture = () => {
    alert("Change picture functionality is not implemented yet.");
  };

  const handleAddMembers = () => {
    if (admin === user._id) setShowContacts(true);
  };

  const handleBackToMembers = () => {
    setShowContacts(false);
    setSelectedMembers([]);
  };

  const handleCheckboxChange = (memberId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(memberId)
        ? prevSelected.filter((id) => id !== memberId)
        : [...prevSelected, memberId]
    );
  };

  const handleConfirmAddMembers = () => {
    console.log("Adding members:", selectedMembers);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-title">Group Members</DialogTitle>
      <DialogContent className="dialog-content">
        {showContacts ? (
          <ContactsCheckbox
            contacts={contacts}
            selectedMembers={selectedMembers}
            onCheckboxChange={handleCheckboxChange}
          />
        ) : (
          <>
            <Box className="group-profile">
              <Avatar
                src={currentProfilePicture}
                alt="Group Profile"
                className="profile-avatar"
              />
              {user._id === admin && (
                <IconButton onClick={handleChangePicture}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                {members.map((member) => (
                  <Box key={member._id} className="member-box">
                    <Avatar
                      src={member.profilePicture}
                      alt={member.username}
                      className="member-avatar"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                        {member.username} {member._id === admin && "(Admin)"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {showContacts ? (
          <Button
            onClick={handleConfirmAddMembers}
            color="primary"
            disabled={selectedMembers.length === 0}
          >
            Confirm Add Members
          </Button>
        ) : (
          <Button onClick={handleAddMembers} color="primary">
            Add Members
          </Button>
        )}
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        {showContacts && (
          <Button onClick={handleBackToMembers} color="primary">
            Back
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GroupMembersDialog;
