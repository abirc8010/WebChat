import { useState, useEffect } from 'react'
import "./chat.css"
import io from 'socket.io-client'
const socket = io("https://chat-server-umo8.onrender.com");

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState('');
 useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, []);
  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { message, username })
    setMessage('');
  }

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload])
    })
  })

  return (
    <>
    <div className='container'>
      <div className='main-div'>
        <h1>Chat app</h1>
        <div className='chats'>
        {chat.map((payload, index) => {
          return (
            <>
            <span className='username'> {payload.username}</span>
            <p key={index} className='text'>
              {payload.message}: 
            </p>
            </>
          )
        })}
        </div>
        <form onSubmit={sendChat} className='form'>
          <input
            type="text"
            name="chat"
            placeholder='send text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
      </div>
    </>
  )
}

export default Chat
