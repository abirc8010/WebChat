import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Login from '../authenticate/login';
import Signup from "../authenticate/signup";

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

export default function({setCurrentUser,setAuthenticUser,setUid,uid}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
     
      <div className="box" >
     
        <div className='heading'><img src="logo.jpg" style={{height:"40px",width:"40px",marginRight:"10px"}}></img>WebChat</div>
       
        <Box className="auth-tab">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Sign Up" {...a11yProps(0)} className='tab' sx={{ color: 'rgb(255, 255, 255)' }} />
              <Tab label="Login" {...a11yProps(1)} className='tab' sx={{ color: 'rgb(255, 255, 255)' }} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0} >              
            <Signup setValue={setValue} setCurrentUser={setCurrentUser} setAuthenticUser={setAuthenticUser} uid={uid} setUid={setUid} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} >
            <Login setValue={setValue} setCurrentUser={setCurrentUser} setAuthenticUser={setAuthenticUser} className="tab-panel" uid={uid} setUid={setUid} />
          </CustomTabPanel>
        </Box>
       
      </div>
    </>
  );
}
