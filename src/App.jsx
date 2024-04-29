import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./components/home/home"
import Error from "./components/notification/error"
import ResponsiveDrawer from "./components/drawer/drawer"
import { useState } from "react"
function App() {
  const [openDialog, setOpenDialog] = useState(true);
  const handleCloseDialog = () => setOpenDialog(false);
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/error" element={<Error openDialog={openDialog} handleCloseDialog={handleCloseDialog}/>}/>
      <Route path="/" element={<Home/>}/>    
    <Route path="/chat" element={<ResponsiveDrawer/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
