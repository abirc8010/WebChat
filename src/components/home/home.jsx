import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Notification from '../notification/notification';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
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
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
            <form onSubmit={handleSubmit} >
              <Notification openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
              <TextField label="Username" sx={{ mb: 2 }} className="text-field" onChange={(e) => setUsername(e.target.value)} fullWidth required />
              <TextField label="Email" sx={{ mb: 2 }} className="text-field" onChange={(e) => setEmail(e.target.value)} type="email" fullWidth />
              <TextField label="Password" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} fullWidth InputProps={{ endAdornment: (<IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((prev) => !prev)} edge="end">{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>) }} />
              <div className='btn'><Button type="submit" sx={{ width: '60%', mb: 2 }} variant="contained" color="primary" fullWidth>SignUp</Button></div>
            </form>
            <Typography variant="h6" sx={{ mt: -1, mb: 1, color: "white" }}>-------- OR --------</Typography>
            <button className="login-with-google-btn">Sign In with google</button>
            <div style={{ color: "white",width:"200px",marginTop:"10px"}}>Already have an account? <div style={{cursor:"pointer", textDecoration:"underline"}}onClick={()=>{setValue(1)}}>Login</div></div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} className="tab-panel">
            <form onSubmit={handleSubmit}>
              <div className="form-fields">
                <TextField label="Email" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setEmail(e.target.value)} type="email" fullWidth />
                <TextField label="Password" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} fullWidth InputProps={{ endAdornment: (<IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((prev) => !prev)} edge="end">{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>) }} />
                <Button type="submit" sx={{ width: '60%', mb: 2 }} variant="contained" color="primary" fullWidth>Login</Button>
              </div>
            </form>
            <Typography variant="h6" sx={{ mt: -1, mb: 1, color: "white" }}>-------- OR --------</Typography>
            <button className="login-with-google-btn">Sign In with google</button>
            <div style={{ color: "white",width:"200px",marginTop:"10px"}}>Don't have an account? <div style={{cursor:"pointer", textDecoration:"underline"}}onClick={()=>{setValue(0)}}>SignUp</div></div>
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
}
