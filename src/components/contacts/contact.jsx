// Import useState and useEffect from React
import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import NotificationBadge from './badge';
import "./contact.css";

export default function Contact({ socket, setReceiver, chats, setChatCount, chatCount, receiver, handleDrawerClose, mobileOpen, username,profilePicture,setPic,users,setUsers}) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [profilePictures, setProfilePictures] = useState({});
    useEffect(() => {
        socket.emit("getContactList", username);
        socket.on("contactList", (data) => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }
            const contactList = data.contacts;
            setUsers(contactList);
            // Fetch profile pictures for all users in the contact list
            contactList.forEach(user => {
                console.log("Fetching profile picture for user:", user);
                socket.emit('getPicture', { username: user });
            });
        });
        return () => {
            socket.off("contactList");
        };
    }, [username, socket]);

    // Listen for profile picture updates from the server
    useEffect(() => {
        socket.on("Picture", (data) => {
            console.log("Received profile picture:", data);
            setProfilePictures(prevState => ({
                ...prevState,
                [data.username]: data.profilePicture
            }));
        });

        return () => {
            socket.off("Picture");
        };
    }, [socket]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const setChatCountZero = (receiver) => {
        setChatCount(prevChatCount => ({
            ...prevChatCount,
            [receiver]: 0
        }));
    };

    const handleAddContact = () => {
        const user = email.split('@')[0];
        const newUser = user;
        setUsers([...users, newUser]);
        const contactUsername = user;
        socket.emit("addContact", { contactUsername, username });
         socket.emit('getPicture', { username: contactUsername });
        handleClose();
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const getLastMessage = (receiver) => {
        const messages = chats[receiver];
        if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            return lastMessage.message.length > 20 ? lastMessage.message.substring(0, 15) + "..." : lastMessage.message;
        }
        return "";
    };

    return (
        <>
            <TextField id="outlined-basic" label="Search" outlined="outlined" sx={{ width: "100%", mb: 2, backgroundColor: `#6f8af2!important` }} />
            <Button variant="contained" color="primary" endIcon={<AddCircleOutline />} onClick={handleClickOpen} sx={{ mb: 2 }}>
                Add Contact
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <div className="add">
                    <DialogTitle sx={{ color: "white" }}>Add Contact</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Username"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={handleEmailChange}
                            className="text-field"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddContact} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>

            <div className="users-list" style={{ marginBottom: "2rem" }}>
                <div>
                    <div className="contact" onClick={() => { setReceiver("You");setPic(profilePicture) }}><img src={profilePicture} className="avatar" />
                        <div className="user-detail">You</div>
                    </div>
                </div>
                {users.map((user, index) => (
                    <div key={index}>
                        <div className="contact" onClick={() => { setReceiver(user); setChatCountZero(user); handleDrawerClose();setPic(profilePictures[user]) }}>
                            <img src={profilePictures[user]} className="avatar" />
                            <div className="user-detail">
                                <div className="user-info">
                                    {user}
                                    {user !== receiver && chatCount[user] > 0 && <NotificationBadge count={chatCount[user]} />}
                                </div>
                                <div className="last-message">{getLastMessage(user)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}