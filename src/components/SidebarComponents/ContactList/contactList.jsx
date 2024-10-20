import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../../redux/slices/contactsSlice";
import Contact from "../../Contact/contact";
import socket from "../../../services/socket";
import "./contactList.css";

export default function ContactList() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { contacts, loading, error } = useSelector((state) => state.contacts);

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    socket.on("contactAdded", (newContact) => {
      dispatch(fetchContacts({ email: user.email }));
    });

    return () => {
      socket.off("contactAdded");
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchContacts({ email: user.email }));
  }, [dispatch, user]);

  const filteredContacts = contacts.contacts?.filter((contact) =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = contacts.groups?.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contacts-list">
      <div className="search-contact">
        <input
          type="text"
          placeholder="Search contacts or groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading && <p>Loading contacts...</p>}
      {error && <p>Error loading contacts: {error}</p>}

      {!loading && !error && (
        <>
          {filteredContacts && filteredContacts.length > 0 && (
            <>
              {filteredContacts.map((contact) => (
                <Contact key={contact._id} user={contact} />
              ))}
            </>
          )}

          {filteredGroups && filteredGroups.length > 0 && (
            <>
              {filteredGroups.map((group) => (
                <Contact
                  key={group._id}
                  user={{
                    _id: group._id,
                    username: group.groupName,
                    email: null,
                    profilePicture: group.groupPicture,
                    latestMessage: group.latestMessage,
                  }}
                />
              ))}
            </>
          )}
          {(!filteredContacts || filteredContacts.length === 0) &&
            (!filteredGroups || filteredGroups.length === 0) && (
              <p>No contacts or groups found</p>
            )}
        </>
      )}
    </div>
  );
}
