import React from "react";
import "./welcome.css";

export default function Welcome() {
  return (
    <div className="welcome">
      <div className="welcome-header">
        <img src="logo.png" alt="WebChat Logo" className="welcome-logo" />
        <h1>Welcome to AquaChat!</h1>
        <p>Click on a contact to begin!</p>
      </div>
      <div className="welcome-illustration">
        <img src="illustration.png" alt="Chat illustration" />
      </div>
    </div>
  );
}
