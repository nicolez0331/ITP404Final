import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import LogDetailsPage from "./pages/LogDetailsPage";
import AddEditLogPage from "./pages/AddEditLogPage";
import CommentsPage from "./pages/CommentsPage";
import { ToastContainer } from "react-toastify";
import "./App.css";
import RecommendedLogsPage from "./pages/RecommendedLogsPage";

const App = () => {
  return (
    <Router>
      <nav className="menu">
        <ul className="menu-list">
          <li>
            <Link to="/home" className="menu-link">
              All Logs
            </Link>
          </li>
          <li className="menu-icon">
            <Link to="/">
              <img src="/toast.png" alt="Welcome" className="welcome-icon" />
            </Link>
          </li>
          <li>
            <Link to="/add" className="menu-link">
              Add Log
            </Link>
          </li>
          <li>
            <Link to="/recommended" className="menu-link">
              Recommended
            </Link>
          </li>
        </ul>
      </nav>

      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="bounce"
      />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/logs/:id" element={<LogDetailsPage />} />
        <Route path="/logs/:id/comments" element={<CommentsPage />} />
        <Route path="/add" element={<AddEditLogPage />} />
        <Route path="/recommended" element={<RecommendedLogsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
