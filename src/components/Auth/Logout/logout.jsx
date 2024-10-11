import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <LogoutIcon
      onClick={handleLogout}
      sx={{
        background: "rgba(139,0,0)",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
      }}
    />
  );
};

export default LogoutButton;
