import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/home";
import Error from "./components/notification/error";
import ResponsiveDrawer from "./components/drawer/drawer";
import { useState ,useEffect} from "react";

function PrivateRoute({ isAuthenticated, currentUser, ...rest }) {
  return isAuthenticated ? (
    <Navigate to={`/chat?username=${currentUser}`} replace state={{ from: rest.location }} />
  ) : (
    <Navigate to="/" replace state={{ from: rest.location }} />
  );
}


function App() {
  const [authenticUser, setAuthenticUser] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
 useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
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
                <ResponsiveDrawer currentUser={currentUser} />
              ) : (
                <Home setCurrentUser={setCurrentUser} setAuthenticUser={setAuthenticUser} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
