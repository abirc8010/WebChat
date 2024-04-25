import * as React from 'react';
import { Button,TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './home.css';

export default function InputWithIcon() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/chat?username=${username}`);
  }

  return (
    <>
    <div className="box" >
             <div className='heading'>WebChat</div> 
     <form onSubmit={handleSubmit} className='home-form'>
      <TextField label="Username" sx={{ mb: 2, width: '70%' }} className="text-field" onChange={(e) => setUsername(e.target.value)} fullWidth required/>
      <TextField label="Email" sx={{ mb: 2, width: '70%' }} className="text-field" onChange={(e) => setEmail(e.target.value)} type="email" fullWidth />
      <TextField label="Password" sx={{ mb: 2, width: '70%' }} className="text-field" onChange={(e) => setPassword(e.target.value)} type="password" fullWidth />
      <Button type="submit" sx={{ width: '60%', mb: 2 }} variant="contained" color="primary" fullWidth>Submit</Button>
    </form>
      
    </div>
    </>
  );
}
