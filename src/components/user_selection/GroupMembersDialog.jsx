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
const MemberListDialog = ({ socket, contacts, open, setOpen, admin, receiver }) => {
  const [chatReceiver, setChatReceiver] = useState(contacts);

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
        <DialogTitle sx={{ backgroundImage: " linear-gradient(135deg,rgb(63, 9, 122), rgba(40, 17, 99, 0.969), rgba(55, 0, 55, 0.969)90%)", color: "white" }}>Members</DialogTitle>
        <DialogContent sx={{ backgroundImage: "linear-gradient(135deg, rgba(63, 9, 122, 0.9), rgba(40, 17, 99, 0.9), rgba(55, 0, 55, 0.9))", color: "white" }}>
          <List>
            {chatReceiver.members.map((member, index) => (

              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar sx={{ marginRight: 2 }} src={member.profilePicture} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <span style={{ marginRight: "auto" }}>{member.username} {member.isAdmin && "(Admin)"}</span>
                      {(!member.isAdmin)&&admin && (
                        <IconButton edge="end" size="small" style={{ color: "red" }} onClick={() => socket.emit("removeUserFromGroup", { userEmail: member.email, groupId: receiver })}>
                          <RemoveCircleOutlineIcon sx={{ fontSize: "medium" }} />
                        </IconButton>
                      )}
                    </React.Fragment>
                  }
                  secondary={<span style={{ color: "white", opacity: "0.7" }}>{member.email}</span>}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberListDialog;
