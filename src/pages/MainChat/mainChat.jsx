import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar/sidebar";
import ChatLayout from "../../components/ChatLayout/chatLayout";
import Welcome from "../../components/Welcome/welcome";
import "./mainChat.css";

function MainChat() {
  const [isMobile, setIsMobile] = useState(false);
  const currentUsername = useSelector(
    (state) => state.contacts.currentUsername
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 780);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const shouldShowSidebar = !isMobile || currentUsername === null;

  return (
    <div className="container">
      {shouldShowSidebar && <Sidebar />}
      {currentUsername ? <ChatLayout /> : <Welcome />}
    </div>
  );
}

export default MainChat;
