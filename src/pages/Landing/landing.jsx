import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
function Landing() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className="landing-left">
        <img src="logo.png" alt="WebChat Logo" className="landing-logo" />
        <h2>
          Bringing you closer to your friends and family, anytime and anywhere.
        </h2>
      </div>

      <div className="landing-right">
        <h2>Join Us Now</h2>
        <div className="button-group">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
