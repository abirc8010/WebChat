import React from "react";
import "./welcome.css";

export default function Welcome() {
  return (
    <div className="welcome">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="landing-svg"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#007AFF", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#00BFFF", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          fill="url(#gradient)"
          d="M0,96L30,85.3C60,75,120,53,180,69.3C240,85,300,139,360,149.3C420,160,480,128,540,117.3C600,107,660,117,720,128C780,139,840,149,900,154.7C960,160,1020,160,1080,144C1140,128,1200,96,1260,90.7C1320,85,1380,107,1410,117.3L1440,128V320H0Z"
        ></path>
      </svg>
      <div className="welcome-header">
        <h1>Welcome to WebChat !</h1>
        <p>Click on a contact to begin!</p>
      </div>
      <div className="welcome-illustration">
        <img src="illustration.png" alt="Chat illustration" />
      </div>
    </div>
  );
}
