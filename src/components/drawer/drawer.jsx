import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
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
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
const userEmail = localStorage.getItem("currentUser");
const userName = localStorage.getItem("currentUsername");
const socket = io(import.meta.env.VITE_SERVER_URL, {
    auth: {
        email: userEmail,
        current_username: userName
    }
});
console.log("userEmail:", userName);
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
    if (!userEmail || !userName)
        window.location.reload();
    const { screen } = props;
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
        console.log("Working on history...");
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

            console.log("History:", chats); // Moved inside the socket.on callback
        });

        return () => {
            socket.off("getHistory");
        };
    }, []);

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
                console.log("Pic of user", data);
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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = (contact, messageId) => {
        const updatedChats = { ...chats };
        updatedChats[contact] = updatedChats[contact].filter((_, index) => index !== messageId);
        setChats(updatedChats);
        handleClose();
    };
    const handleReply = (payload) => {
        setReply(payload);
        console.log("Replying to:", payload.message);
    }
    const sendChat = (e) => {
        e.preventDefault();
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const Time = day + '/' + month + '/' + year + "  ,  " + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
        socket.emit("send privateMessage", { receiver, email: userEmail, message, Time, reply });

        setReply([]);
        const updatedChats = { ...chats };
        if (!updatedChats[receiver]) {
            updatedChats[receiver] = [];
        }
        updatedChats[receiver].push({ receiver, message, email: userEmail, Time, reply });

        console.log(updatedChats);
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
                if (!Object.keys(contacts).includes(payload.email)) {
                    console.log("Working", payload);
                    setUsers(prevUsers => [...prevUsers, payload.email]);
                    socket.emit("addContact", { contactEmail: payload.email, email: userEmail });
                    const newContact = { username: "", profilePicture: "you.webp" };
                    setContacts(prevState => ({
                        ...prevState,
                        [payload.email]: newContact
                    }));
                    socket.emit('getPicture', { email: payload.email });
                }

                setChatCount(prevChatCount => {
                    const newCount = (prevChatCount[payload.email] || 0) + 1;
                    console.log("ChatCount:", newCount);
                    return {
                        ...prevChatCount,
                        [payload.email]: newCount
                    };
                });

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
                <div className='webchat' style={{ backgroundImage: 'linear-gradient(135deg, rgb(118, 72, 234), rgba(109, 59, 234, 0.969), rgba(240, 55, 240, 0.969))' }}>
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
                    <Contacts socket={socket} setReceiver={setReceiver} chats={chats} setChatCount={setChatCount} chatCount={chatCount} receiver={receiver} handleDrawerClose={handleDrawerClose} mobileOpen={mobileOpen} userEmail={userEmail} username={userName} profilePicture={profilePicture} setPic={setPic} users={users} setUsers={setUsers} contacts={contacts} setContacts={setContacts} setDisplayReceiver={setDisplayReceiver} />
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
                        backgroundImage: 'linear-gradient(135deg,rgb(97, 20, 180), rgba(61, 31, 138, 0.969), rgba(128, 0, 128, 0.969) 90%)',
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
                        <img src={pic} className='avatar' />
                        <Typography variant="h6" component="div" >
                            {displayReceiver}
                        <div className='typing'>{typing}</div>
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
                            <div key={index} className={payload.email === userEmail ? 'my-msg' : 'other-msg'} style={payload.url ? { backgroundImage: "linear-gradient" } : null}>
                                <div className='username'>{payload.email === userEmail ? 'You' : contacts[payload.email].username}
                                    <div className="menu-icon-container">
                                        <KeyboardArrowDownIcon onClick={handleClick} />
                                    </div>
                                </div>
                                {payload.reply.url ? (

                                    <div className='show-reply'>
                                        <div>{payload.reply.username}</div>
                                        Sticker
                                    </div>

                                ) :
                                    (payload.reply.message ? (
                                        <div className='show-reply'>
                                            <div>{payload.reply.username}</div>
                                            {payload.reply.message}
                                        </div>
                                    ) : null
                                    )
                                }
                                {payload.url ? (
                                    <img src={payload.url} alt="Sticker or GIF" style={{ width: "200px" }} />
                                ) : (
                                    <div className='message-content'>{payload.message}</div>
                                )}
                                <div className="date-time">{payload.Time}</div>

                                <Menu
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => handleDelete(receiver, index)}>
                                        Delete
                                    </MenuItem>
                                    <MenuItem onClick={() => handleReply(payload)}>
                                        Reply
                                    </MenuItem>
                                </Menu>
                            </div>
                        ))}
                    </div>

                    <br /><br />


                    <Box className='message'>
                        {reply.message ? (
                            <>
                                <div className='reply'>
                                    <div style={{ color: "rgb(0,255,183)", textDecoration: "underline" }}>
                                        {reply.username}
                                    </div>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {reply.message}
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <InputArea receiver={receiver} setMessage={setMessage} message={message} sendChat={sendChat} userEmail={userEmail} setChats={setChats} chats={chats} socket={socket} setReply={setReply} reply={reply} setTyping={setTyping}/>

                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ResponsiveDrawer;