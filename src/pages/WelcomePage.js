import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const WelcomePage = () => {
  useEffect(() => {
    document.title = "LA Brunch Log";
  }, []);

  return (
    <div className="container text-center" data-testid="welcome-page">
      <h1 data-testid="welcome-message">
        🤩 Welcome to Los Angeles Brunch Log
      </h1>
      <p data-testid="intro-text">
        Track and discover the best brunch spots in LA 🌴. <br></br>
        Start by viewing existing logs or adding your own favorite spots!
      </p>

      <div className="btn-container" data-testid="button-container">
        <Link to="/home" className="btn-brunch" data-testid="view-logs-button">
          📓 View Logs
        </Link>
      </div>

      <div className="welcome-image-container" data-testid="image-container">
        <img
          src="/brunch.jpg"
          alt="Delicious brunch"
          className="welcome-image"
          data-testid="welcome-image"
        />
      </div>
    </div>
  );
};

export default WelcomePage;
