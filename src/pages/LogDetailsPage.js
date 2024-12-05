import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogItem from "../components/LogItem";

const LogDetailsPage = () => {
  const navigate = useNavigate();
  const logId = window.location.pathname.split("/")[2];
  const [log, setLog] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [diningOptions, setDiningOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState("");

  const [foodOrdered, setFoodOrdered] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [diningOption, setDiningOption] = useState([]);

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchDataRef = useRef(false);

  const fetchData = () => {
    if (fetchDataRef.current) return;
    fetchDataRef.current = true;

    fetch(`http://localhost:5500/logs/${logId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLog(data);
        setFoodOrdered(data.foodOrdered);
        setDate(data.date);
        setRating(data.rating);
        setDescription(data.description);
        setDiningOption(data.diningOption || []);
      })
      .catch(() => toast.error("Failed to load log details."));

    fetch("http://localhost:5500/diningOption", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDiningOptions(data))
      .catch(() => toast.error("Failed to load dining options."));

    fetch("http://localhost:5500/users", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Failed to load users."));

    fetch("http://localhost:5500/restaurants", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch(() => toast.error("Failed to load restaurants."));
  };

  if (!log) fetchData();

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((res) => res.id === restaurantId);
    return restaurant ? restaurant.name : "Restaurant";
  };

  useEffect(() => {
    if (!logId) {
      toast.error("Invalid log ID.");
      return;
    }
    fetchData();
    document.title = log
      ? `Detail - ${getRestaurantName(log.restaurantId)}`
      : "Detail";
  }, [log, logId]);

  const handleSaveChanges = () => {
    const updatedLog = {
      restaurantId: log.restaurantId,
      foodOrdered,
      date,
      rating,
      description,
      diningOption,
      userId: log.userId,
      recommend: log.recommend,
    };

    fetch(`http://localhost:5500/logs/${logId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(updatedLog),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to save changes.");
          return;
        }
        return res.json();
      })
      .then((updatedLog) => {
        if (updatedLog) {
          setLog(updatedLog);
          setIsEditing(false);
          toast.success("Changes saved successfully!");
        }
      })
      .catch(() => toast.error("Failed to save changes."));
  };

  const handleUpdateRecommendation = () => {
    if (newRecommendation === "") {
      toast.error("Please select a recommendation.");
      return;
    }

    const updatedRecommendValue = newRecommendation === "true";

    fetch(`http://localhost:5500/logs/${logId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ recommend: updatedRecommendValue }),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to update recommendation.");
        }
        return res.json();
      })
      .then((updatedLog) => {
        setLog(updatedLog);
        setNewRecommendation("");
        toast.success("Recommendation updated successfully!");
      })
      .catch(() => toast.error("Failed to update recommendation."));
  };

  const handleDeleteLog = () => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      fetch(`http://localhost:5500/logs/${logId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey}` },
      })
        .then(() => {
          toast.success("Log deleted successfully!");
          navigate("/home");
        })
        .catch(() => toast.error("Failed to delete log."));
    }
  };

  if (!log) return <p>Loading log details...</p>;

  return (
    <div className="container">
      <h1>{isEditing ? "Edit Log" : "Log Details"}</h1>
      {isEditing ? (
        <form>
          <p>
            <strong>Restaurant:</strong> {getRestaurantName(log.restaurantId)}
          </p>

          <div className="mb-3">
            <label>Food Ordered</label>
            <input
              type="text"
              value={foodOrdered}
              onChange={(e) => setFoodOrdered(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-select"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Dining Option</label>
            <div>
              {diningOptions.map((option) => (
                <label key={option.id} className="me-3">
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={diningOption.indexOf(option.id) !== -1}
                    onChange={() => {
                      const updatedDiningOption = diningOption.slice();
                      if (updatedDiningOption.indexOf(option.id) === -1) {
                        updatedDiningOption.push(option.id);
                      } else {
                        updatedDiningOption.splice(
                          updatedDiningOption.indexOf(option.id),
                          1
                        );
                      }
                      setDiningOption(updatedDiningOption);
                    }}
                  />
                  {option.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <LogItem
            log={log}
            users={users}
            restaurants={restaurants}
            diningOptions={diningOptions}
          />
          <div className="mb-3">
            <div className="recommendation-options">
              <div>
                <label>
                  <input
                    type="radio"
                    name="recommendation"
                    value="true"
                    checked={newRecommendation === "true"}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                  />
                  Recommend
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="recommendation"
                    value="false"
                    checked={newRecommendation === "false"}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                  />
                  Do not recommend
                </label>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleUpdateRecommendation}
            >
              Update Recommendation
            </button>
          </div>

          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={handleDeleteLog}
          >
            Delete
          </button>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/logs/${logId}/comments`)}
          >
            View Comments
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Log
          </button>
        </>
      )}
    </div>
  );
};

export default LogDetailsPage;
