import { Button } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

export default function Contact() {
    return (
        <>
            <Button variant="contained" color="primary" endIcon={<AddCircleOutline />}>
                Add Contact
            </Button>
        </>
    );
}