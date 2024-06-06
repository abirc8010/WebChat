import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Contacts from '../contacts/contact';
import ContactsIcon from '@mui/icons-material/Contacts';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import SettingsDialog from '../settings/setting';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import InputArea from '../inputarea/InputArea';
import { useRef } from 'react';
import './drawer.css';
import ImageDialog from '../image_dialog/ImageDialog';
import VideoDialog from '../video_dialog/VideoDialog';
import GroupMembersDialog from '../user_selection/GroupMembersDialog';
import PictureDialog from '../picture_dialog/pictureDialog';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ForwardDialog from '../user_selection/UserSelection';

const userEmail = localStorage.getItem("currentUser");
const userName = localStorage.getItem("currentUsername");
const Useruid = localStorage.getItem("uid");
const socket = io(import.meta.env.VITE_SERVER_URL, {
    auth: {
        email: userEmail,
        current_username: userName,
        uid: Useruid
    }
});
const drawerWidth = 370;
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            sx={{
                width: '50%',
            }}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div >
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
function showDesktopNotification(message) {
    if ('Notification' in window && navigator.serviceWorker) {
        if (Notification.permission === "granted") {
            new Notification("New Message", {
                body: message,
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification("New Message", {
                        body: message,
                    });
                }
            });
        }
    } else {
        alert('Browser does not support notifications or service workers.');
    }
}



function ResponsiveDrawer(props) {


    const { screen } = props;
    const { setAuthenticUser, setCurrentUser, currentUser, uid, setUid } = props;


    if (currentUser && uid) {

        socket.emit("storeUid", { email: currentUser, uid });
        setCurrentUser(null);
        setUid(null);
    }
    if (!userEmail || !userName)
        window.location.reload();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState({});
    const [chatCount, setChatCount] = useState({});
    const [username, setUsername] = useState(userName);
    const [value, setValue] = React.useState(0);
    const [typing, setTyping] = useState('');
    const [receiver, setReceiver] = useState('You');
    const [openConfig, setOpenConfig] = useState(false);
    const [ImgUrl, setImgUrl] = useState('chat.jpg');
    const [reply, setReply] = useState([]);
    const [profilePicture, setProfilePicture] = useState('you.webp');
    const [pic, setPic] = useState('you.webp');
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState({});
    const [displayReceiver, setDisplayReceiver] = useState('You');
    const messageContainerRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [showVideoDialog, setShowVideoDialog] = useState(false);
    const [type, setType] = useState('private');
    const [storedUid, setStoredUid] = useState(localStorage.getItem('uid'));
    const [contactDialog, setContactDialog] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [pictureDialog, setPictureDialog] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(false);
    const [forward,setForward]=useState(false);

    function getGroupById(groupId, callback) {
        socket.emit("getGroupById", groupId);
        socket.on("groupById", (data) => {
            callback(data); // Call the provided callback with the data
        });
    }

    useEffect(() => {
        socket.emit('getUserGroups', userEmail);
        socket.on('userGroups', (data) => {
            if (data && data.groups) {
                // Extract the 'groups' array from the data
                const groups = data.groups;

                // Iterate over each group in the 'groups' array
                groups.forEach(group => {
                    // Extract necessary information from the group
                    const { _id: groupId, groupName, profilePicture, members, isAdmin } = group;

                    // Create an object with group information
                    const groupInfo = {
                        username: groupName,
                        profilePicture: profilePicture || "you.webp",
                        type: "group",
                        members: members,
                        isAdmin: isAdmin
                    };
                    setContacts(prevState => ({
                        ...prevState,
                        [groupId]: groupInfo
                    }));
                    setAdmin(groupInfo.isAdmin);
                    // Log the assignment of group information

                });
            } else {
                // Handle the case where the received data is invalid or missing the 'groups' array
                console.error("Error: Invalid or missing groups data");
                // Optionally, you can handle the error in another appropriate way
            }
        });

        // Fetch contact list
        socket.emit("getContactList", userEmail);
        socket.on("contactList", (data) => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }
            const contactsData = data.contacts.reduce((acc, curr) => {
                acc[curr] = { username: "", profilePicture: "", type: "private" };
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
            socket.off("userGroups");
        };
    }, [userEmail]);


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
        if (userEmail) {
            if (uid || !uid && currentUser) {
                socket.emit("uid", { userEmail, uid: storedUid });
                socket.on("uidResult", ({ success }) => {
                    if (!success) {
                        localStorage.removeItem("uid");
                        localStorage.removeItem("currentUser");
                        setAuthenticUser(false);
                    }
                });
            }
        }

        return () => {
            socket.disconnect();
        };
    }, [userEmail]);

    const openVideoDialog = () => {
        setShowVideoDialog(true);
    };

    const closeVideoDialog = () => {
        setShowVideoDialog(false);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        socket.emit("getUsernameByEmail", userEmail);
        socket.on('usernameByEmail', (data) => {
            setUsername(data.username);
        });
        return () => {
            socket.off("userProfilePicture");
        };
    }, [socket, userEmail]);
    useEffect(() => {
        socket.emit("getGroupChatHistory", userEmail);
        socket.on("groupChatHistory", (messages) => {
            setChats(prevChats => {
                // Initialize an object to store the updated chats
                const updatedChats = { ...prevChats };

                // Iterate over each group's chat history
                messages.history.forEach((groupHistory) => {
                    // Extract groupId and history from groupHistory
                    const { groupId, history } = groupHistory;

                    // Check if the groupId already exists in the chats
                    if (updatedChats[groupId]) {
                        // If it exists, concatenate the new history with the existing one
                        updatedChats[groupId] = [
                            ...updatedChats[groupId],
                            ...history.map(message => ({ ...message, email: message.sender }))
                        ];
                    } else {
                        // If it doesn't exist, simply set the history for the groupId
                        updatedChats[groupId] = history.map(message => ({ ...message, email: message.sender }));
                    }
                });

                // Return the updated chats object
                return updatedChats;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [currentUser, uid, socket]);
    useEffect(() => {
        socket.emit("getHistory", { email: userEmail });
        socket.on("history", async (payload) => {
            const { sender, receiver, messages } = payload;

            const key = receiver !== userEmail ? receiver : sender;

            // Update chat history in the `chats` object with key based on receiver or sender
            setChats(prevChats => {
                // Create a new chat object by appending the messages and sender's username
                const updatedChat = messages.map(message => ({
                    ...message,
                    email: message.sender // Assuming `sender` contains the username
                }));

                // Merge the new chat data with the existing chats
                return {
                    ...prevChats,
                    [key]: updatedChat
                };
            });
        });

        return () => {
            socket.off("getHistory");
        };
    }, [socket]);

    useEffect(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }, [chats[receiver]]);
    const updateChatCount = (receiver) => {
        setChatCount(prevChatCount => ({
            ...prevChatCount,
            [receiver]: (prevChatCount[receiver] || 0) + 1
        }));
    };
    useEffect(() => {
        if (socket && userEmail) {
            // Emit event to request user's profile picture from the server
            socket.emit('getUserProfilePicture', { email: userEmail });
            // Listen for the response from the server

            socket.on('userProfilePicture', (data) => {
                setProfilePicture(data.profilePicture);
                setPic(data.profilePicture);
            });

        }
        return () => {
            socket.off("userProfilePicture");
        };
    }, [socket, userEmail]);

    const handleSettingsOpen = () => {
        setOpenConfig(true);
    };

    const handleSettingsClose = () => {
        setOpenConfig(false);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        const updatedChats = { ...chats };
        updatedChats[receiver] = updatedChats[receiver].map((message, index) => {
            if (index === selectedIndex) {
                return { ...message, message: "This message was deleted" ,deleted:true,reply:[],url:null};
            }
            return message;
        });
        setChats(updatedChats);
        handleClose();
    };

    const handleReply = () => {
        if (selectedIndex !== null) {
            const clickedMessage = chats[receiver][selectedIndex];
            setReply(clickedMessage);
         
        } else {
            console.error("No index selected");
        }
    }
    const handleForward = () => {
        setForward(true);
    }
    const sendChat = (e) => {
        e.preventDefault();

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const Time = day + '/' + month + '/' + year + "  ,  " + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
        if (receiver != "You")
            socket.emit("send privateMessage", { receiver: (type === "group" ? userEmail : receiver), email: (type === "group" ? receiver : userEmail), message, Time, reply, type, name: (type === "group" ? userName : null) });

        setReply([]);
        const updatedChats = { ...chats };
        if (!updatedChats[receiver]) {
            updatedChats[receiver] = [];
        }
        updatedChats[receiver].push({ receiver: (type === "group" ? userEmail : receiver), email: (type === "group" ? receiver : userEmail), message, Time, reply, type });

        setChats(updatedChats);
        setMessage('');
    };

    useEffect(() => {
        socket.on("chat", (payload) => {
            const updatedChats = { ...chats };
            if (!updatedChats[payload.receiver]) {
                updatedChats[payload.receiver] = [];
            }
            updatedChats[payload.receiver].push(payload);
            setChats(updatedChats);
        });
        if (socket && userEmail) {
            socket.on("private message", (payload) => {

                if (payload.type !== "group" && !Object.keys(contacts).includes(payload.email)) {


                    setUsers(prevUsers => [...prevUsers, payload.email]);
                    if (payload.type === "private")
                        socket.emit("addContact", { contactEmail: payload.email, email: userEmail });

                    const newContact = { username: payload.type === "private" ? payload.name : payload.group, profilePicture: "you.webp", type: payload.type };
                    setContacts(prevState => ({
                        ...prevState,
                        [payload.email]: newContact

                    }));

                    if (payload.type === "private")
                        socket.emit('getPicture', { email: payload.email });
                }
                if (payload.email !== receiver) {
                    setChatCount(prevChatCount => {
                        const newCount = (prevChatCount[payload.email] || 0) + 1;
                        return {
                            ...prevChatCount,
                            [payload.email]: newCount
                        };
                    });
                }

                setChats(prevChats => {
                    const updatedChats = { ...prevChats };
                    const recipient = payload.email;

                    if (!updatedChats[recipient]) {
                        updatedChats[recipient] = [];
                    }

                    updatedChats[recipient] = [...updatedChats[recipient], payload];

                    return updatedChats;
                });
                showDesktopNotification(`You have a new message from ${payload.email}`);
            });
        }
        return () => {
            socket.off("private message");
            socket.off("chat");
        };

    }, []);

    useEffect(() => {
        if (userEmail) {
            setUsername(userEmail);
        }
    }, []);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div className='drawer'>
            <Toolbar className='toolbar'>
                <div
                    className='webchat'
                    style={{
                        fontWeight: 900,
                    }}
                >
                    <img
                        src="logo.jpg"
                        style={{ width: "40px", height: "40px", marginRight: "10px", borderRadius: "50%" }}
                    />
                    WebChat
                </div>
                {mobileOpen ? (<ArrowBackIosNewIcon
                    onClick={handleDrawerToggle} />)
                    : null
                }
            </Toolbar>
            <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span>Contacts</span>
                                <ContactsIcon style={{ marginLeft: '5px' }} />
                            </div>
                        } sx={{ color: value === 0 ? "green" : "rgba(255,255,255)" }} {...a11yProps(0)} className='tab' />
                        <Tab
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>Settings</span>
                                    <SettingsIcon style={{ marginLeft: '5px' }} />
                                </div>
                            } sx={{ color: value === 1 ? "green" : "rgba(255,255,255)" }} {...a11yProps(1)} className='tab' />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0} className="panel">
                    <Contacts setTyping={setTyping} socket={socket} setReceiver={setReceiver} chats={chats} setChatCount={setChatCount} chatCount={chatCount} receiver={receiver} handleDrawerClose={handleDrawerClose} mobileOpen={mobileOpen} userEmail={userEmail} username={userName} profilePicture={profilePicture} setPic={setPic} users={users} setUsers={setUsers} contacts={contacts} setContacts={setContacts} setDisplayReceiver={setDisplayReceiver} setType={setType} setAdmin={setAdmin} setOnlineStatus={setOnlineStatus} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1} className="panel" >
                    <SettingsDialog socket={socket} openConfig={openConfig} onClose={handleSettingsClose} setImgUrl={setImgUrl} userEmail={userEmail} setProfilePicture={setProfilePicture} profilePicture={profilePicture} setAuthenticUser={props.setAuthenticUser} />
                </CustomTabPanel>
            </Box>
            <Divider />
        </div>
    );

    const container = screen !== undefined ? () => screen().document.body : undefined;

    return (
        <>

            <Box sx={{ display: 'flex' }} >
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                    className='bar'
                >


                    <Toolbar >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}

                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                        <img src={pic} className='avatar' style={{ cursor: ((admin && (type === "group")) ? "pointer" : null) }} onClick={() => { if (type === "group" && admin) { setPictureDialog(true) } }} />
                        <Typography variant="h6" component="div" >
                            {displayReceiver}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {type === "group" ? (
                                    <div onClick={() => setContactDialog(true)} style={{ fontSize: "12px", cursor: "pointer", opacity: "0.8", display: 'inline-block' }}>See members</div>
                                ) : (
                                    onlineStatus ? (
                                        <div style={{ fontSize: "12px", cursor: "pointer", opacity: "0.8", display: 'inline-block' }}>online</div>
                                    ) : null
                                )}
                                <div className='typing' style={{ display: 'inline-block', marginLeft: '10px' }}>{typing}</div>
                            </div>

                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ position: "absolute", backgroundImage: `url(${ImgUrl})`, backgroundSize: "cover", flexGrow: 1, p: 3, width: "100%" }}
                    className="main-chat"
                >
                    <Toolbar />
                    <div className='message-container' ref={messageContainerRef}>
                        {receiver && chats[receiver] && chats[receiver].map((payload, index) => (
                            <>

                                <div key={index} className={payload.type === "private" ? (payload.email === userEmail ? 'my-msg' : 'other-msg') : ((payload.receiver === userEmail ? 'my-msg' : 'other-msg'))} style={payload.url ? { backgroundImage: "linear-gradient" } : null}>
                                    <div className='username'>
                                        <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{payload.type === "group" ? (payload.receiver === userEmail ? "You" : payload.name) : (payload.email === userEmail ? "You" : contacts[payload.email].username)}</div>

                                        <div className="menu-icon-container">
                                            <KeyboardArrowDownIcon onClick={(e) => { handleClick(e, index) }} style={{ cursor: "pointer" }} />
                                        </div>
                                    </div>
                                    {payload.reply.url ? (

                                        <div className='show-reply'>
                                            <div>{payload.type === "private" ? ((payload.reply.email === userEmail) ? "You" : displayReceiver) : payload.name}</div>
                                            Sticker
                                        </div>

                                    ) :
                                        (payload.reply.message ? (
                                            <div className='show-reply'>
                                                <div>{payload.type === "private" ? ((payload.reply.email === userEmail) ? "You" : displayReceiver) : payload.name}</div>

                                                {payload.reply.message}
                                            </div>
                                        ) : null
                                        )
                                    }
                                    {payload.url ? (
                                        payload.message === "video" ? (
                                            <div style={{ position: "relative", display: "inline-block" }}>
                                                <video src={payload.url} alt="video" style={{ width: "200px" }} />
                                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", cursor: "pointer" }} onClick={() => { setSelectedImageUrl(payload.url); openVideoDialog(); }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                                                        <path d="M3 22v-20l18 10-18 10z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            payload.message === "pdf" ? (
                                                <div>
                                                    <embed src={payload.url} type="application/pdf" width="200" height="200" />
                                                </div>
                                            ) : (
                                                <img src={payload.url} alt="Sticker or GIF" style={{ width: "200px", cursor: "pointer" }} onClick={() => handleImageClick(payload.url)} />
                                            )
                                        )
                                    ) : (
                                       <>
                                        <div className={payload.deleted?'delete':'message-content'}> {payload.deleted?<HighlightOffOutlinedIcon sx={{fontSize:"medium"}}/>:null} {payload.message}</div>
                                      </>
                                    )}

                                    <div className="date-time" >{payload.Time}</div>

                                    <Menu
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >

                                        <MenuItem onClick={() => { handleDelete(chats[receiver][selectedIndex]); handleClose(); }} >
                                            Delete
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleReply(), handleClose(); }}>
                                            Reply
                                        </MenuItem>
                                         <MenuItem onClick={()=> {handleForward(),handleClose();}}>
                                            Forward
                                        </MenuItem>
                                          <MenuItem >
                                            Edit
                                        </MenuItem>
                                    </Menu>

                                </div>

                            </>
                        ))}
                    </div >
                    <br /><br />


                    <Box className='message'>
                        {reply.message ? (
                            <>

                                <div className='reply'>
                                    <div style={{ color: "rgb(0,255,183)", textDecoration: "underline", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: "flex", justifyContent: "space-between", width: "100%" }}>
                                        <div>{reply.type === "private" ? ((reply.email === userEmail) ? "You" : displayReceiver) : ((reply.receiver === userEmail) ? "You" : reply.name)}</div>

                                        <CloseIcon style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => { setReply([]); }} />
                                    </div>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: "flex", justifyContent: "space-between", width: "100%" }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: "300px" }}>  {reply.message}</div>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <InputArea receiver={receiver} setMessage={setMessage} message={message} sendChat={sendChat} userEmail={userEmail} setChats={setChats} chats={chats} socket={socket} setReply={setReply} reply={reply} setTyping={setTyping} userName={userName} msgtype={type} />

                    </Box>
                </Box>
            </Box>
             {(selectedIndex||selectedIndex===0)&&chats[receiver][selectedIndex]?( <ForwardDialog contacts={contacts} payload={chats[receiver][selectedIndex]} sendChat={sendChat} open={forward} onClose={()=>setForward(false)}  currentUser={userEmail} setChats={setChats} socket={socket}/>):null}
            <PictureDialog open={pictureDialog} onClose={() => setPictureDialog(false)} currentPicture={pic} onPictureUpload={setPic} />
            {contacts[receiver] && type === "group" ? (<GroupMembersDialog socket={socket} contacts={contacts[receiver]} open={contactDialog} setOpen={setContactDialog} admin={admin} receiver={receiver} email={userEmail} />) : null}
            <ImageDialog open={openDialog} imageUrl={selectedImageUrl} onClose={handleCloseDialog} />
            <VideoDialog open={showVideoDialog} videoUrl={selectedImageUrl} onClose={closeVideoDialog} />
        </>
    );
}

export default ResponsiveDrawer;