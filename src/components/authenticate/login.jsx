import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Notification from '../notification/notification';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup,GoogleAuthProvider } from 'firebase/auth';
export default function SignUp({ setValue }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const username = localStorage.getItem('user');
      handleOpenDialog();
      setTimeout(() => {
        navigate(`/chat?username=${username}`);
      }, 4000);
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
   const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const g=await signInWithPopup(auth, provider);
            const username = g.user.displayName;
            localStorage.setItem('user', username);
             navigate(`/chat?username=${username}`);
        } catch (error) {
            console.log(error);
        }
    };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <Notification openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
          <TextField label="Email" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setEmail(e.target.value)} type="email" fullWidth />
          <TextField label="Password" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} fullWidth InputProps={{ endAdornment: (<IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((prev) => !prev)} edge="end">{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>) }} />
          <Button type="submit" sx={{ width: '60%', mb: 2 }} variant="contained" color="primary" fullWidth>Login</Button>
        </div>
      </form>
      <Typography variant="h6" sx={{ mt: -1, mb: 1, color: "white" }}>-------- OR --------</Typography>
      <button className="login-with-google-btn" onClick={handleGoogleSignIn}>Sign In with google</button>
      <div style={{ color: "white", width: "200px", marginTop: "10px" }}>Don't have an account? <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setValue(0) }}>SignUp</div></div>
    </>
  );
}