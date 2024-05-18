import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./components/home/home"
import Error from "./components/notification/error"
import ResponsiveDrawer from "./components/drawer/drawer"
import { useState } from "react"
function App() {
  
  const auth = localStorage.getItem('auth');
  
  const [authenticUser, setAuthenticUser] = useState(true);
  const [openDialog, setOpenDialog] = useState(true);
  const [currentUser,setCurrentUser] = useState('');
  const handleCloseDialog = () => setOpenDialog(false);
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/error" element={<Error openDialog={openDialog} handleCloseDialog={handleCloseDialog}/>}/>
      <Route path="/" element={<Home setCurrentUser={setCurrentUser} setAuthenticUser={setAuthenticUser}/>}/>    
   {authenticUser?(<Route path="/chat" element={<ResponsiveDrawer currentUser={currentUser}/>}/>):null}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
