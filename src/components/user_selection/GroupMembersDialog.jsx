import React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  IconButton
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const MemberListDialog = ({ socket, contacts, open, setOpen, admin, receiver, email }) => {
  const [chatReceiver, setChatReceiver] = useState(contacts);

  useEffect(() => {
    setChatReceiver(contacts);
  }, [contacts]);

  useEffect(() => {
    socket.on("userRemovedFromGroup", ({ success, removedUserEmail }) => {
      if (success) {
        setChatReceiver(prevState => ({
          ...prevState,
          members: prevState.members.filter(member => member.email !== removedUserEmail)
        }));
      } else {
        console.error("Error removing user from group");
      }
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("userRemovedFromGroup");
    };
  }, [socket, setChatReceiver]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            minWidth: '300px',
            maxWidth: '600px',
            height: '400px'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundImage: "linear-gradient(135deg, rgb(23, 7, 63), rgb(32, 1, 32)90%)",
            color: "rgba(225,225,225,0.8)",
            textAlign: "center",
              borderBottom: "1px solid rgba(225, 225, 225, 0.3)" 
          }}>
          Members
        </DialogTitle>
        <DialogContent sx={{ backgroundImage: "linear-gradient(135deg, rgb(23, 7, 63), rgb(32, 1, 32)90%)", opacity: "0.95", color: "white" }}>
          <List>
            {chatReceiver.members.map((member, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar sx={{ marginRight: 2 }} src={member.profilePicture} />
                </ListItemAvatar>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <span>{member.username} {member.isAdmin && "(Admin)"}</span>
                      </React.Fragment>
                    }
                    secondary={<span style={{ color: "white", opacity: "0.7" }}>{member.email}</span>}
                  />
                  {(!member.isAdmin && admin) && (
                    <IconButton edge="end" size="small" style={{ color: "red" }} onClick={() => socket.emit("removeUserFromGroup", { userEmail: member.email, groupId: receiver })}>
                      <RemoveCircleOutlineIcon sx={{ fontSize: "medium" }} />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberListDialog;
