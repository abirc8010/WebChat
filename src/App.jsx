import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/home";
import Error from "./components/notification/error";
import ResponsiveDrawer from "./components/drawer/drawer";
import { useState ,useEffect} from "react";

function App() {
  const [authenticUser, setAuthenticUser] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
    const [uid, setUid] = useState(null);

 useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
     const uid = localStorage.getItem("uid");
    if (storedCurrentUser&&uid) {
      setCurrentUser(storedCurrentUser);
      setAuthenticUser(true);
    }
  }, []);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/error"
            element={<Error openDialog={openDialog} handleCloseDialog={handleCloseDialog} />}
          />
          <Route
            path="/"
            element={
              authenticUser ? (
                <ResponsiveDrawer currentUser={currentUser} setAuthenticUser={setAuthenticUser} uid={uid} setCurrentUser={setCurrentUser} setUid={setUid}/>
              ) : (
                <Home setCurrentUser={setCurrentUser} setAuthenticUser={setAuthenticUser} setUid={setUid} uid={uid}/>
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;