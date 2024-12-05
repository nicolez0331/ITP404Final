import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const [logs, setLogs] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);

  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    document.title = "Brunch Logs";
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5500/logs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch logs.");
        return res.json();
      })
      .then((logsData) => {
        setLogs(logsData);
        fetch("http://localhost:5500/restaurants", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch restaurants.");
            return res.json();
          })
          .then((restaurantsData) => {
            setRestaurants(restaurantsData);
            fetch("http://localhost:5500/users", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch users.");
                return res.json();
              })
              .then((usersData) => {
                setUsers(usersData);
              })
              .catch(() => {
                toast.error("Failed to load users.");
              });
          })
          .catch(() => {
            toast.error("Failed to load restaurants.");
          });
      })
      .catch(() => {
        toast.error("Failed to load logs.");
      });
  };

  if (logs.length === 0) {
    fetchData();
  }

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((res) => res.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="container">
      <h1> 🥪 Brunch Logs</h1>
      <p>Discover the best brunch spots in Los Angeles!</p>

      <div className="btn-container">
        <div className="text-center mb-4">
          <Link to="/add" className="btn-brunch">
            <span role="img">🍳</span>
            Add New Log
          </Link>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="text-center">
          No logs available. Add some to get started!
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Rating</th>
              <th>Recommend</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{getRestaurantName(log.restaurantId)}</td>
                <td>{log.rating ? `${log.rating}/5` : "N/A"}</td>
                <td>
                  {log.recommend !== undefined ? (
                    log.recommend ? (
                      <span role="img" aria-label="recommended">
                        ✅
                      </span>
                    ) : (
                      <span role="img" aria-label="not recommended">
                        ❌
                      </span>
                    )
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{getUserName(log.userId)}</td>
                <td>
                  <Link to={`/logs/${log.id}`} className="btn btn-primary me-2">
                    View
                  </Link>
                  <Link
                    to={`/logs/${log.id}/comments`}
                    className="btn btn-secondary"
                  >
                    Comments
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HomePage;
