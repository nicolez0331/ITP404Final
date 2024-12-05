import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogItem from "../components/LogItem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecommendedLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [diningOptions, setDiningOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const logsRef = useRef([]);
  const diningOptionsRef = useRef([]);
  const usersRef = useRef([]);
  const restaurantsRef = useRef([]);

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchData = () => {
    fetch("http://localhost:5500/logs?recommend=true", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        logsRef.current = data;
      })
      .catch(() => toast.error("Failed to load recommended logs."));

    fetch("http://localhost:5500/diningOption", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDiningOptions(data);
        diningOptionsRef.current = data;
      })
      .catch(() => toast.error("Failed to load dining options."));

    fetch("http://localhost:5500/users", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        usersRef.current = data;
      })
      .catch(() => toast.error("Failed to load users."));

    fetch("http://localhost:5500/restaurants", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        restaurantsRef.current = data;
      })
      .catch(() => toast.error("Failed to load restaurants."));
  };

  useEffect(() => {
    document.title = "Recommended List";

    if (logsRef.current.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <div className="container">
      <h1>🥯 Recommended Spots</h1>
      {logs.length > 0 ? (
        <ul className="recommended-list">
          {logs.map((log) => (
            <li key={log.id} className="mb-4">
              <LogItem
                log={log}
                users={users}
                restaurants={restaurants}
                diningOptions={diningOptions}
              />
              <div className="btn-container">
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => navigate(`/logs/${log.id}`)}
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommended spots yet.</p>
      )}
    </div>
  );
};

export default RecommendedLogsPage;
