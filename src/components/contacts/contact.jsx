import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import NotificationBadge from './badge';
import "./contact.css";

export default function Contact({ socket, setReceiver, chats, setChatCount, chatCount, receiver, handleDrawerClose, mobileOpen, username, profilePicture, setPic, userEmail, contacts, setContacts, setDisplayReceiver }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [add, setAdd] = useState(false);
    useEffect(() => {
        socket.on("failed", () => { setAdd(true) });
        socket.on("success", () => {
            setAdd(false);
              const newContact = { username: "", profilePicture: "" };
            setContacts(prevState => ({
                ...prevState,
                [email]: newContact
            }));
               handleClose();
        })
    }, [socket]);
    useEffect(() => {
        socket.emit("getContactList", userEmail);
        socket.on("contactList", (data) => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }
            const contactsData = data.contacts.reduce((acc, curr) => {
                acc[curr] = { username: "", profilePicture: "" };
                return acc;
            }, {});
            setContacts(contactsData);
            // Fetch profile pictures and usernames for all users in the contact list
            data.contacts.forEach(user => {
                socket.emit('getPicture', { email: user });
            });
        });
        return () => {
            socket.off("contactList");
        };
    }, []);

    // Listen for profile picture updates from the server
    useEffect(() => {
        socket.on("Picture", (data) => {
            setContacts(prevState => ({
                ...prevState,
                [data.email]: { ...prevState[data.email], username: data.username, profilePicture: data.profilePicture }
            }));
        });
    }, []);

    useEffect(() => {
        const filtered = Object.entries(contacts);
        if (searchText) {
            const filteredContacts = filtered.filter(([email, data]) =>
                data.username.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredContacts(filteredContacts);
        } else {
            setFilteredContacts(filtered);
        }
    }, [searchText, contacts]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAdd(false);
    };

    const setChatCountZero = (receiver) => {
        setChatCount(prevChatCount => ({
            ...prevChatCount,
            [receiver]: 0
        }));
    };

    const handleAddContact = () => {
        socket.emit("addContact", { contactEmail: email, email: userEmail });
     
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setAdd(false);
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
          <div className="Search_Box">
            <TextField
                id="outlined-basic"
                label="Search"
                sx={{ width: "80%", mb: 2, backgroundColor: `#c7bdc1!important` }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        <AddCircleOutline onClick={handleClickOpen} sx={{ mb: 2,height:"40px",width:"40px" ,cursor:"pointer", color:"#7099db"}}/>
            </div>
              
            <Dialog open={open} onClose={handleClose}>
                <div className="add">
                    <DialogTitle sx={{ color: "white" }}>Add Contact</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={handleEmailChange}
                            className="text-field"
                        />
                        {(add) ? <div style={{color:"rgb(225,0,0)",fontWeight:"400"}}>No user found !</div> : null}
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
                    <div className="contact" onClick={() => { setDisplayReceiver("You"); setPic(profilePicture) }}>
                        <img src={profilePicture} className="avatar" />
                        <div className="user-detail" > <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>You : {username} </div></div>
                    </div>
                </div>
                {filteredContacts.map(([email, data]) => (
                    <div key={email}>
                        <div className="contact" onClick={() => { setReceiver(email); setChatCountZero(email); handleDrawerClose(); setPic(data.profilePicture ? data.profilePicture : "you.webp"); setDisplayReceiver(data.username) }}>
                            <img src={data.profilePicture ? data.profilePicture : "you.webp"} className="avatar" />
                            <div className="user-detail">
                                <div className="user-info">
                                    <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{data.username || email}</div>
                                    {email !== receiver && chatCount[email] > 0 && <NotificationBadge count={chatCount[email]} />}
                                </div>
                                <div className="last-message">{getLastMessage(email)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </>
    );
}
