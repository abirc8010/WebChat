import { useSelector } from "react-redux";
import { useState } from "react";
import ChatHeader from "../ChatHeader/chatHeader";
import Composer from "../Composer/composer";
import Messages from "../Messages/messages";
import "./chatLayout.css";
export default function ChatLayout() {
  const [reply, setReply] = useState(null);
  return (
    <div
      className="mainchat"
      style={{ backgroundImage: "url('darkbackground.jpg')" }}
    >
      <ChatHeader />
      <Messages setReply={setReply} />
      <Composer reply={reply} setReply={setReply} />
    </div>
  );
}
