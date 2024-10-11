import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../../redux/slices/contactsSlice";
import Contact from "../../Contact/contact";
import socket from "../../../services/socket";
import "./contactList.css";

export default function ContactList() {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contacts);
  const email = localStorage.getItem("email");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchContacts({ email }));
  }, [dispatch, email]);

  useEffect(() => {
    socket.on("contactAdded", () => {
      dispatch(fetchContacts({ email }));
    });

    return () => {
      socket.off("contactAdded");
    };
  }, [dispatch, email]);

  const filteredContacts = Object.entries(contacts).flatMap(
    ([key, contactArray]) =>
      contactArray.filter((contact) =>
        contact.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="contacts-list">
      <div className="search-contact">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading && <p>Loading contacts...</p>}
      {error && <p>Error loading contacts: {error}</p>}

      {!loading && !error && filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <>
            <Contact key={contact._id} user={contact} />
          </>
        ))
      ) : (
        <p>No contacts found</p>
      )}
    </div>
  );
}
