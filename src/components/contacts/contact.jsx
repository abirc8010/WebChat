import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import "./contact.css";

export default function Contact({setReceiver}) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddContact = () => {
        const username = email.split('@')[0]; 
        const newUser = { email, username };
        setUsers([...users, newUser]);
        console.log("Adding contact:", newUser);
        
        handleClose();
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <>
            <Button variant="contained"  color="primary" endIcon={<AddCircleOutline />} onClick={handleClickOpen} sx={{mb:2}}>
                Add Contact
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <div className="add">
                    <DialogTitle sx={{color:"white"}}>Add Contact</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Username"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={handleEmailChange}
                            className="text-field"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddContact} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>

            <div className="users-list" style={{ marginBottom: "2rem" }}>
                {users.map((user, index) => (
                    <div    >
                        <div className="contact" onClick={()=>{setReceiver(user.username);console.log(user);}}>{user.username}</div>
                    </div>
                ))}
            </div>
        </>
    );
}