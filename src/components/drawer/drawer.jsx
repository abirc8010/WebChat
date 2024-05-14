import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Contacts from '../contacts/contact';
import GroupsIcon from '@mui/icons-material/Groups';
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

const searchParams = new URLSearchParams(window.location.search);
const usernameParam = searchParams.get('username');

console.log("usernameparam:", usernameParam);
const socket = io("https://chat-server-umo8.onrender.com", {
    auth: {
        username: usernameParam
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

function ResponsiveDrawer(props) {

    if (!usernameParam)
        window.location.reload();
    const { screen } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState({});
    const [chatCount, setChatCount] = useState({});
    const [username, setUsername] = useState('');
    const [value, setValue] = React.useState(0);
    const [typing, setTyping] = useState('');
    const [receiver, setReceiver] = useState('');
    const [openConfig, setOpenConfig] = useState(false);
    const [ImgUrl, setImgUrl] = useState('chat.jpg');
    const [reply, setReply] = useState([]);
    const messageContainerRef = useRef(null);
    useEffect(() => {
        console.log("Working on history...");
        socket.emit("getHistory", { username: usernameParam });
        socket.on("history", async (payload) => {
            const { sender, receiver, messages } = payload;

            const key = receiver !== usernameParam ? receiver : sender;

            // Update chat history in the `chats` object with key based on receiver or sender
            setChats(prevChats => {
                // Create a new chat object by appending the messages and sender's username
                const updatedChat = messages.map(message => ({
                    ...message,
                    username: message.sender // Assuming `sender` contains the username
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
        socket.emit("private message", { receiver, message, username, Time, reply });

        setReply([]);
        const updatedChats = { ...chats };
        if (!updatedChats[receiver]) {
            updatedChats[receiver] = [];
        }
        updatedChats[receiver].push({ receiver, message, username, Time, reply });

        console.log(updatedChats);
        setChats(updatedChats);
        setMessage('');
    };

    useEffect(() => {
        const inputMsg = document.querySelector(".inputmsg");
        if (inputMsg) {
            inputMsg.addEventListener("keydown", () => {
                socket.emit("typing", { user: username, message: "is typing..." });
            });
            inputMsg.addEventListener("keyup", () => {
                socket.emit("stopTyping", "");
            });
        }
    }, [username]);

    useEffect(() => {
        socket.on("notifyTyping", data => {
            if (data.user !== username) {
                setTyping(data.user + " " + data.message);
            }
        });

        let typingTimeout;

        socket.on("notifyStopTyping", () => {
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                setTyping('');
            }, 2000);
        });

        return () => {
            socket.off("notifyTyping");
            socket.off("notifyStopTyping");
        };
    }, [username]);


    useEffect(() => {
        socket.on("chat", (payload) => {
            const updatedChats = { ...chats };
            if (!updatedChats[payload.receiver]) {
                updatedChats[payload.receiver] = [];
            }
            updatedChats[payload.receiver].push(payload);
            setChats(updatedChats);
        });
        socket.on("private message", (payload) => {
            setChatCount(prevChatCount => {
                const newCount = (prevChatCount[payload.username] || 0) + 1;
                console.log("ChatCount:", newCount);
                return {
                    ...prevChatCount,
                    [payload.username]: newCount
                };
            });

            setChats(prevChats => {
                const updatedChats = { ...prevChats };
                const recipient = payload.username;

                if (!updatedChats[recipient]) {
                    updatedChats[recipient] = [];
                }

                updatedChats[recipient] = [...updatedChats[recipient], payload];

                return updatedChats;
            });
        });

        return () => {
            socket.off("chat");
            socket.off("private message");
        };
    }, []);

    useEffect(() => {
        if (usernameParam) {
            setUsername(usernameParam);
            console.log("Username:", usernameParam);
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
                <SettingsIcon
                    aria-label="settings"
                    onClick={handleSettingsOpen}
                    edge="end"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                />
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
                                    <span>Groups</span>
                                    <GroupsIcon style={{ marginLeft: '5px' }} />
                                </div>
                            } sx={{ color: value === 1 ? "green" : "rgba(255,255,255)" }} {...a11yProps(1)} className='tab' />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0} className="panel">
                    <Contacts socket={socket} setReceiver={setReceiver} chats={chats} setChatCount={setChatCount} chatCount={chatCount} receiver={receiver} handleDrawerClose={handleDrawerClose} mobileOpen={mobileOpen} username={username} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1} className="panel" >
                    Groups
                </CustomTabPanel>
            </Box>
            <Divider />
        </div>
    );

    const container = screen !== undefined ? () => screen().document.body : undefined;

    return (
        <>
            <SettingsDialog openConfig={openConfig} onClose={handleSettingsClose} setImgUrl={setImgUrl} />
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
                        <img src="you.webp" className='avatar' />
                        <Typography variant="h6" component="div" >
                            {receiver}
                        </Typography>

                        <div className='typing'>{typing}</div>
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
                            <div key={index} className={payload.username === usernameParam ? 'my-msg' : 'other-msg'} style={payload.url ? { backgroundImage: "linear-gradient" } : null}>
                                <div className='username'>{payload.username}
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

                        <InputArea receiver={receiver} setMessage={setMessage} message={message} sendChat={sendChat} username={username} setChats={setChats} chats={chats} socket={socket} setReply={setReply} reply={reply} />

                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ResponsiveDrawer;