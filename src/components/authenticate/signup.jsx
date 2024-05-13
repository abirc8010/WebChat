import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Success from '../notification/success';
import Error from '../notification/error';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup,GoogleAuthProvider} from 'firebase/auth';
export default function SignUp({ setValue }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username
            });         
                localStorage.setItem('user', username);

            handleOpenDialog();   
            setTimeout(() => {
                setValue(1);
                handleCloseDialog();
            }, 4000);
        } catch (error) {
            setOpenErrorDialog(true);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleErrorCloseDialog = () => {
        setOpenErrorDialog(false);
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
        <div className="form-box">
            <Error openDialog={openErrorDialog} handleCloseDialog={handleErrorCloseDialog} />
            <Success openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
            <form onSubmit={handleSubmit} style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
                <TextField
                    label="Username"
                    sx={{ mb: 2 }}
                    className="text-field"
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Email"
                    sx={{ mb: 2 }}
                    className="text-field"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    sx={{ mb: 2, width: '100%' }}
                    className="text-field"
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        ),
                    }}
                    required
                />
                <div className='btn'>
                    <Button
                        type="submit"
                        sx={{ width: '100px', mb: 2 }}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Sign Up
                    </Button>
                </div>
            </form>
            <Typography variant="h6" sx={{ mt: -1, mb: 1, color: "white" }}>-------- OR --------</Typography>
            <button className="login-with-google-btn" onClick={handleGoogleSignIn}>Sign In with google</button>
            <div style={{ color: "white", width: "200px", marginTop: "10px" }}>
                Already have an account? <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setValue(1) }}>Login</div>
            </div>
        </div>
    );
}