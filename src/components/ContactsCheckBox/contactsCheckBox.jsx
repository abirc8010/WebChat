import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const ContactCheckbox = ({ contacts, selectedMembers, onCheckboxChange }) => {
  return (
    <div>
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
            <div style={{ display: "flex", alignItems: "center" }}>
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
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ContactCheckbox;
