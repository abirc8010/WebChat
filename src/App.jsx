import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./redux/slices/authSlice";
import Login from "./components/Auth/Login/login";
import Signup from "./components/Auth/Register/register";
import MainChat from "./pages/MainChat/mainChat";
import Landing from "./pages/Landing/landing";
import socket from "./services/socket";
function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("email");

    if (savedToken && savedEmail) {
      dispatch(validateToken({ email: savedEmail, token: savedToken })).then(
        ({ meta }) => {
          if (meta.requestStatus === "fulfilled") {
            socket.emit("login", savedEmail);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            window.location.reload();
          }
        }
      );
    } else if (savedEmail) {
      localStorage.removeItem("email");
    } else if (savedToken) {
      localStorage.removeItem("token");
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <MainChat /> : <Landing />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </Router>
  );
}

export default App;
