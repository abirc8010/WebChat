import { CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ErrorNotification({ openDialog, handleCloseDialog }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer;
        let elapsed = 0;

        if (openDialog) {
            timer = setInterval(() => {
                elapsed += 100;
                const newProgress = (elapsed / 4000) * 100;
                setProgress(newProgress >= 100 ? 100 : newProgress);
            }, 100);
        }

        return () => {
            clearInterval(timer);
            setProgress(0);
        };
    }, [openDialog]);

    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(handleCloseDialog, 4000);
            return () => clearTimeout(timer);
        }
    }, [openDialog, handleCloseDialog]);

    return (
        <Dialog
            open={openDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
             
                <Typography variant="h6" color="green">Sign up Successful !!</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Signed up successfully please login to continue.
                </DialogContentText>
                <LinearProgress variant="determinate" value={progress} sx={{
                    backgroundColor: `green!important`,
                }} />
            </DialogContent>
        </Dialog>
    );
}
