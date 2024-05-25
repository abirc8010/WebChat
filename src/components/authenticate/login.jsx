import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Notification from '../notification/notification';
import Error from '../notification/error';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
export default function SignUp({ setValue, setCurrentUser, setAuthenticUser }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await signInWithEmailAndPassword(auth, email, password);
       console.log(u);
      handleOpenDialog(email);
      setTimeout(() => {
        setCurrentUser(email);
        console.log(email);
        localStorage.setItem('currentUser', email);
         localStorage.setItem('currentUsername', u.user.displayName);
       setAuthenticUser(true);
      }, 4000);
    }
    catch (error) {
      setOpenErrorDialog(true);
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
      const g = await signInWithPopup(auth, provider);
      const userEmail =g.user.email
      console.log(g.user.displayName);
      setCurrentUser(userEmail);
     setAuthenticUser(true);
       localStorage.setItem('currentUser', userEmail);
         localStorage.setItem('currentUsername', g.user.displayName);
    } catch (error) {
      console.log(error);
    }
  };
  const handleErrorCloseDialog = () => {
    setOpenErrorDialog(false);
  };
  return (
    <div className="form-box">
      <Error openDialog={openErrorDialog} handleCloseDialog={handleErrorCloseDialog} />
      <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>

        <Notification openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
        <TextField label="Email" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setEmail(e.target.value)} type="email" fullWidth required />
        <TextField label="Password" sx={{ mb: 2, width: '100%' }} className="text-field" onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} fullWidth InputProps={{ endAdornment: (<IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((prev) => !prev)} edge="end">{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>) }} required />
        <Button type="submit" sx={{ width: '50%', mb: 3, mt: 2 }} variant="contained" color="primary" fullWidth>Login</Button>

      </form>
      <Typography variant="h6" sx={{ mt: -1, mb: 2, color: "white" }}>-------- OR --------</Typography>
      <button className="login-with-google-btn" onClick={handleGoogleSignIn}>Sign In with google</button>
      <div style={{ color: "white", width: "200px", marginTop: "20px" }}>Don't have an account? <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setValue(0) }}>SignUp</div></div>
    </div>
  );
}