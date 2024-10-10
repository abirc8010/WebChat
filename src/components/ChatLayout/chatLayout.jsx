import { useSelector } from "react-redux";
import ChatHeader from "../ChatHeader/chatHeader";
import Composer from "../Composer/composer";
import Messages from "../Messages/messages";
import "./chatLayout.css";
export default function ChatLayout() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="mainchat">
      <ChatHeader />
      <Messages />
      <Composer />
    </div>
  );
}
