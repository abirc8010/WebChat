import React from "react";
import { Checkbox, FormControlLabel, Box } from "@mui/material";
import "./checkbox.css";

const ContactCheckbox = ({ contacts, selectedMembers, onCheckboxChange }) => {
  return (
    <Box>
      {contacts.map((contact) => (
        <FormControlLabel
          key={contact._id}
          control={
            <Checkbox
              checked={selectedMembers.includes(contact._id)}
              onChange={() => onCheckboxChange(contact._id)}
            />
          }
          label={
            <Box display="flex" alignItems="center" className="contact-item">
              <img
                src={contact.profilePicture}
                alt={contact.username}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              {contact.username}
            </Box>
          }
        />
      ))}
    </Box>
  );
};

export default ContactCheckbox;
