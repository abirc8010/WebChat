import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
export default function(){
     const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const handleSubmit = () => {
     navigate("/chat?username="+username);
  }
    return (
      <>
        <div className="username">Write your username to continue :</div>
        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
        <button onClick={handleSubmit}>Click here</button>
      </>
    )
}