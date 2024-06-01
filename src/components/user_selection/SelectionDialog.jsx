import React from 'react';
import { Dialog, DialogContent, TextField, Checkbox, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Avatar, ListItemAvatar } from '@mui/material';

const SelectionDialog= ({ open, onClose, contacts, currentUser,socket }) => {
    const [groupName, setGroupName] = React.useState('');
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
        if (groupName && selectedUsers.length > 0) {
            const data = {
                groupName,
                adminEmail: currentUser,
                memberEmails: selectedUsers
            };
            console.log(data);
            socket.emit('createGroup', data);
            socket.on('groupCreated', (res) => {
                if(res.success)
                {
                    console.log("Group Created");
                    onClose();
                }
            });
        } else {
            // Handle validation error (e.g., show a validation message)
            console.error('Group name or selected users are missing');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <TextField
                    label="Group Name"
                    fullWidth
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <List style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {Object.keys(contacts).map((email) => (
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
                        </ListItem>
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

export default SelectionDialog;
