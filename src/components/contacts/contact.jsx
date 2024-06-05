import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationBadge from './badge';
import SelectionDialog from '../user_selection/SelectionDialog';
import "./contact.css";
import { SwapHoriz } from "@mui/icons-material";

export default function Contact({ socket, setReceiver, chats, setChatCount, chatCount, receiver, handleDrawerClose, mobileOpen, username, profilePicture, setPic, userEmail, contacts, setContacts, setDisplayReceiver, setType, setAdmin, setOnlineStatus,setTyping }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [add, setAdd] = useState(false);
    const [openSelectionDialog, setOpenSelectionDialog] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set()); // Track online users

    const handleCloseSelectionDialog = () => setOpenSelectionDialog(false);

    useEffect(() => {
        socket.on("failed", () => { setAdd(true) });
        socket.on("success", (data) => {

            setAdd(false);
            const newContact = { username: data.username, profilePicture: data.profilepicture, type: "private" };
            setContacts(prevState => ({
                ...prevState,
                [data.contactEmail]: newContact
            }));
            handleClose();
        });


        const contactEmails = Object.keys(contacts).filter(email => contacts[email].type === 'private');

        socket.emit('fetchContactsStatus', contactEmails, (statuses) => {

            const onlineContacts = statuses.filter(contact => contact.status === 'online')
                .map(contact => {
                    if (contact.email === receiver) {
                        setOnlineStatus(true);
                    }
                    return contact.email;
                });
            setOnlineUsers(new Set(onlineContacts));
        });

        // Listen for user online status
        socket.on('userOnlineStatus', (data) => {
            setOnlineUsers((prevOnlineUsers) => {
                const newOnlineUsers = new Set(prevOnlineUsers);
                if (data.status === 'online') {
                    newOnlineUsers.add(data.email);
                    if (data.email === receiver) {
                        setOnlineStatus(true);
                    }
                } else {
                    newOnlineUsers.delete(data.email);
                    if (data.email === receiver) {
                        setOnlineStatus(false);
                    }
                }
                return newOnlineUsers;
            });
        });

        return () => {
            // Clean up event listener
            socket.off('userOnlineStatus');
        };
    }, [socket, contacts]);

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
            <SelectionDialog open={openSelectionDialog} onClose={handleCloseSelectionDialog} contacts={contacts} currentUser={userEmail} socket={socket} />
            <div className="Search_Box">
                <TextField
                    id="outlined-basic"
                    label="Search"
                    sx={{ width: "250px", height: "40px", mb: 2, backgroundColor: `#c7bdc1!important` }}
                    InputProps={{
                        sx: { height: "100%", fontSize: "1.0rem" },
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    InputLabelProps={{
                        sx: { fontSize: "0.9rem" }
                    }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <PersonAddIcon onClick={handleClickOpen} sx={{ mb: 2, height: "30px", width: "30px", cursor: "pointer", color: "#7099db" }} />
                <GroupAddIcon sx={{ mb: 2, height: "30px", width: "30px", cursor: "pointer", color: "#7099db" }} onClick={() => setOpenSelectionDialog(true)} />
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
                        {(add) ? <div style={{ color: "rgb(225,0,0)", fontWeight: "400" }}>No user found !</div> : null}
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
                    <div className="contact" onClick={() => { setDisplayReceiver("You"); setPic(profilePicture); setReceiver("You") }}>
                        <img src={profilePicture} className="avatar" />

                        <div className="user-detail" > <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>You : {username} </div></div>
                    </div>
                </div>
                {filteredContacts.map(([email, data]) => (
                    email && (
                        <div className="contact" onClick={() => {
                            setTyping(null);
                            setType(data.type);
                            setReceiver(email);
                            setChatCountZero(email);
                            handleDrawerClose();
                            setPic(data.profilePicture ? data.profilePicture : "you.webp");
                            setDisplayReceiver(data.username);
                            if (data.type === "group") {
                                setAdmin(data.isAdmin);
                            }
                            if (onlineUsers.has(email)) {
                                setOnlineStatus(true);
                            }
                            else
                              setOnlineStatus(false);
                        }}>


                            <div className="avatar-container">
                                <img src={data.profilePicture ? data.profilePicture : "you.webp"} className="avatar" />
                                {data.type === "private" && (<div className={`status-circle ${onlineUsers.has(email) ? 'online' : 'offline'}`}></div>)}
                            </div>
                            <div className="user-detail">
                                <div className="user-info">
                                    <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{data.username || email}</div>
                                    {email !== receiver && chatCount[email] > 0 && <NotificationBadge count={chatCount[email]} />}
                                </div>
                                <div className="last-message">{getLastMessage(email)}</div>
                            </div>
                        </div>
                    )
                ))}

            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </>
    );
}
