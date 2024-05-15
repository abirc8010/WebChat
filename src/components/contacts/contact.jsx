import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { AddCircleOutline, Message } from "@mui/icons-material";
import NotificationBadge from './badge';
import "./contact.css";

export default function Contact({ socket, setReceiver, chats, setChatCount, chatCount, receiver, handleDrawerClose, mobileOpen, username,profilePicture }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.emit("getContactList", username);
        console.log("Adding event listener for contact list")
        socket.on("contactList", (data) => {
            if (data.error) {
                // Handle error, for example, display error message
                console.error("Error:", data.error);
                return;
            }

            // Access the contact list from the data object
            const contactList = data.contacts;
            setUsers(contactList);
            // Now you can use the contact list as needed
        });

        // Clean up event listener when component unmounts
        return () => {
            socket.off("contactList");
        };
    }, [username]); // Add username to the dependency array if it's used in the effect

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
            console.log("Adding contact:", newUser, username);
            console.log(socket);
            socket.emit("addContact", { contactUsername, username });
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
                    <div className="contact" onClick={() => { setReceiver("You"); }}><img src={profilePicture} className="avatar" />
                        <div className="user-detail">You</div>
                    </div>
                </div>
                {users.map((user, index) => (
                    <div>
                        <div className="contact" onClick={() => { setReceiver(user); setChatCountZero(user); handleDrawerClose(); }}>
                            <img src={`other${index % 2 + 1}.png`} className="avatar" />
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
