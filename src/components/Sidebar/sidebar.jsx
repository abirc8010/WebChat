import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Contact from "../Contact/contact";
import { fetchContacts } from "../../redux/slices/contactsSlice";
import LogoutButton from "../Auth/Logout/logout";
import "./sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();

  const { contacts, loading, error } = useSelector((state) => state.contacts);
  const email = localStorage.getItem("email");

  useEffect(() => {
    dispatch(fetchContacts({ email }));
  }, [dispatch, email]);

  useEffect(() => {
    console.log(contacts);
  }, [contacts]);

  return (
    <div className="sidebar">
      <div className="webchat">
        Webchat <LogoutButton />
      </div>
      <div className="contacts-list">
        {loading && <p>Loading contacts...</p>}
        {error && <p>Error loading contacts: {error}</p>}

        {!loading && !error && Object.keys(contacts).length > 0 ? (
          Object.entries(contacts).map(([key, contactArray]) =>
            contactArray.map((contact) => (
              <Contact key={contact._id} user={contact} />
            ))
          )
        ) : (
          <p>No contacts found</p>
        )}
      </div>
    </div>
  );
}
