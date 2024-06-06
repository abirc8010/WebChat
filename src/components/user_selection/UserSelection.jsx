import React from 'react';
import { Dialog, DialogContent, Checkbox, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Avatar, ListItemAvatar } from '@mui/material';

const ForwardDialog = ({ payload, sendChat, open, onClose, contacts, currentUser, setChats, socket }) => {

    const [selectedUsers, setSelectedUsers] = React.useState([]);


    const handleCheckboxChange = (email) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(email)) {
                return prevSelected.filter((id) => id !== email);
            } else {
                return [...prevSelected, email];
            }
        });
    };

    const handleDone = () => {
            selectedUsers.forEach(user => {
                const modifiedPayload = {
                    ...payload,
                    receiver: user ,
                    reply:[]
                };
                socket.emit("send privateMessage", modifiedPayload);

                setChats(prevChats => {
                    const updatedChats = { ...prevChats };
                    if (!updatedChats[user]) {
                        updatedChats[user] = [];
                    }
                    updatedChats[user].push(modifiedPayload);
                    return updatedChats;
                });
            });
            onClose(); 

    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent >
                <List style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {Object.keys(contacts).map((email) => (
                          (
                            <ListItem key={email}>
                                <ListItemAvatar>
                                    <Avatar alt={contacts[email].username} src={contacts[email].profilePicture} />
                                </ListItemAvatar>
                                <ListItemText primary={contacts[email].username} secondary={email} />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        onChange={() => handleCheckboxChange(email)}
                                        checked={selectedUsers.includes(email)}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>)
                    ))}
                </List>
            </DialogContent>
            <DialogContent>
                <Button variant="contained" onClick={handleDone}>
                    Done
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ForwardDialog;
