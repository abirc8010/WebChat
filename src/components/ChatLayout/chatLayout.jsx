
import { useSelector } from 'react-redux';
import LogoutButton from '../Auth/Logout/logout'; 
import './chatLayout.css';
export default function ChatLayout() {
    const user = useSelector((state) => state.auth.user);
    return (
    <div className='mainchat'>
      <h1>Main Chat Page</h1>
      {user && <h2>Hi, {user.username}!</h2>} 
       <LogoutButton /> 
    </div>    
    );
}