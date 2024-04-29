import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './drawer.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("https://chat-server-umo8.onrender.com");

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
            sx={{ width: '50%' }}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
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
    const { screen } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [username, setUsername] = useState('');
    const [showTime, setTime] = useState('');
    const [value, setValue] = React.useState(0);
    const [typing, setTyping] = useState('');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const sendChat = (e) => {
        e.preventDefault();
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const Time = day + '/' + month + '/' + year + "  ,  " + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
        socket.emit("chat", { message, username, Time });
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
            setChat([...chat, payload])
        })
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const usernameParam = searchParams.get('username');
        if (usernameParam) {
            setUsername(usernameParam);
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
            <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Contacts" {...a11yProps(0)} className='tab' />
                        <Tab label="Invitation" {...a11yProps(1)} className='tab' />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0} className="panel">
                  Contacts
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1} className="panel" >
                    Invitation
                </CustomTabPanel>
            </Box>
            <Divider />
        </div>
    );

    const container = screen !== undefined ? () => screen().document.body : undefined;

    return (
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
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" >
                        <div className='webchat'>WebChat</div>
                    </Typography>
                </Toolbar>
                <div className='typing'>{typing}</div>
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
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <div className='message-container'>
                    {chat.map((payload, index) => {
                        return (
                            <div key={index} className={payload.username === username ? 'my-msg' : 'other-msg'}>
                                <div className='username'>{payload.username}</div>
                                <div className='message-content'>
                                    {payload.message}
                                </div>
                                <div className="date-time">{payload.Time}</div>
                            </div>
                        );
                    })}
                </div>
                <Box display="flex" alignItems="center" justifyContent="center" className='message'>

                    <input
                        type="text"
                        placeholder="Enter your message"
                        className='inputmsg'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button type="submit" className="submit-btn" onClick={sendChat}><SendIcon /></button>
                </Box>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
