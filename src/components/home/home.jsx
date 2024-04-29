import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Login from '../authenticate/login';
import Signup from "../authenticate/signup";
import { auth } from '../../config/firebase'; 

import './home.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, width: '50%' }}>
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

export default function InputWithIcon() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOpenDialog();
    setTimeout(() => {
      navigate(`/chat?username=${username}`);
    }, 4000);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      <div className="box" >
        <div className='heading'>WebChat</div>
        <Box className="form-box">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Sign Up" {...a11yProps(0)} className='tab' sx={{ color: 'rgb(255, 255, 255)' }} />
              <Tab label="Login" {...a11yProps(1)} className='tab' sx={{ color: 'rgb(255, 255, 255)' }} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0} className='tab-panel'>
             <Signup setValue={setValue}/> 
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} className="tab-panel">
         
             <Login setValue={setValue} />
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
}
