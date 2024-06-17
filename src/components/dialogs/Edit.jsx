import { useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, Button } from '@mui/material';
const ForwardDialog = ({ payload, open, onClose, chats, setChats, socket, receiver, selectedIndex }) => {
    const [message, setMessage] = useState(payload.message);
   
    useEffect(() => {
        setMessage(payload.message);
    }, [payload.message]);
  


    const handleDone = () => {
        socket.emit("edit",{payload:{...payload,message:message},receiver,selectedIndex});

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <TextField
                    sx={{ width: "100%", mb: 1 }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    minRows={1}
                    maxRows={4}
                />
                <div style={{ color: "rgb(225,0,0)" }}>Note: Edit can only be performed once if the selected message is within 15 minutes of its sent time. For now receiver has to reload to see the changes</div>
            </DialogContent>
            <DialogContent>
                <Button variant="contained" onClick={handleDone}>
                    Edit
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ForwardDialog;
