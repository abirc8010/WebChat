import React, { useState } from "react";
import "./sidebar.css";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ContactList from "../SidebarComponents/ContactList/contactList";
import Settings from "../SidebarComponents/Settings/settings";
import AddUser from "../SidebarComponents/AddUser/addUser";
import GroupAdd from "../SidebarComponents/GroupAdd/groupAdd";
export default function Sidebar() {
  const [currentComponent, setCurrentComponent] = useState("contacts");

  const renderComponent = () => {
    switch (currentComponent) {
      case "contacts":
        return <ContactList />;
      case "settings":
        return <Settings />;
      case "addPerson":
        return <AddUser />;
      case "groupAdd":
        return <GroupAdd />;
      default:
        return <ContactList />;
    }
  };

  return (
    <div className="sidebar">
      <div className="webchat">
        <img src="logo.png"></img>
      </div>
      <div className="sidebar-options">
        <div className="tab" onClick={() => setCurrentComponent("contacts")}>
          <ContactsIcon />
        </div>
        <div className="tab" onClick={() => setCurrentComponent("settings")}>
          <SettingsIcon />
        </div>
        <div className="tab" onClick={() => setCurrentComponent("addPerson")}>
          <PersonAddIcon />
        </div>
        <div className="tab" onClick={() => setCurrentComponent("groupAdd")}>
          <GroupAddIcon />
        </div>
      </div>
      <div className="component-container">{renderComponent()}</div>
    </div>
  );
}
