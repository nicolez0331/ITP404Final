import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropdownWithNewItem from "../components/DropdownWithNewItem";

const AddEditLogPage = () => {
  const navigate = useNavigate();
  const [diningOptions, setDiningOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [userId, setUserId] = useState("");
  const [foodOrdered, setFoodOrdered] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [diningOption, setDiningOption] = useState([]);
  const [recommend, setRecommend] = useState(null);
  const [errors, setErrors] = useState({});

  const hasFetchedData = useRef(false);
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchData = () => {
    if (hasFetchedData.current) return;

    fetch("http://localhost:5500/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load users.");
      });

    fetch("http://localhost:5500/restaurants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load restaurants.");
      });

    fetch("http://localhost:5500/diningOption", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDiningOptions(data))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load dining options.");
      });

    hasFetchedData.current = true;
  };

  useEffect(() => {
    document.title = "Add Log";
  }, []);

  fetchData();

  const handleDiningOptionChange = (e) => {
    const optionId = e.target.value;
    let updatedDiningOption = diningOption.slice();

    if (updatedDiningOption.includes(optionId)) {
      updatedDiningOption = updatedDiningOption.filter((id) => id !== optionId);
    } else {
      updatedDiningOption.push(optionId);
    }

    setDiningOption(updatedDiningOption);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!restaurantId) newErrors.restaurant = "Please select a restaurant.";
    if (!userId) newErrors.user = "Please select a user.";
    if (!foodOrdered) newErrors.foodOrdered = "Food ordered is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!rating) newErrors.rating = "Rating is required.";
    if (!description) newErrors.description = "Description is required.";
    if (diningOption.length === 0)
      newErrors.diningOption = "At least one dining option is required.";
    if (recommend === null) newErrors.recommend = "Recommendation is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const logData = {
      restaurantId,
      userId,
      foodOrdered,
      date,
      rating,
      description,
      diningOption,
      recommend,
    };

    fetch("http://localhost:5500/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    })
      .then((res) => {
        if (!res.ok) toast.error("Failed to add log.");
        return res.json();
      })
      .then(() => {
        toast.success("New log added successfully!");
        navigate("/home");
      })
      .catch(() => {
        toast.error("Failed to add new log.");
      });
  };

  return (
    <div className="container">
      <h1>✍️ Add New Log</h1>
      <form onSubmit={handleSubmit}>
        <DropdownWithNewItem
          label="User"
          apiEndpoint="http://localhost:5500/users"
          selectedId={userId}
          setSelectedId={setUserId}
        />

        <DropdownWithNewItem
          label="Restaurant"
          apiEndpoint="http://localhost:5500/restaurants"
          selectedId={restaurantId}
          setSelectedId={setRestaurantId}
        />

        <div className="mb-3">
          <label className="form-label">Food Ordered</label>
          <input
            type="text"
            value={foodOrdered}
            onChange={(e) => setFoodOrdered(e.target.value)}
            className="form-control"
          />
          {errors.foodOrdered && (
            <div className="text-danger">{errors.foodOrdered}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
          {errors.date && <div className="text-danger">{errors.date}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-select"
          >
            <option value="">-- Select Rating --</option>
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <option key={ratingValue} value={ratingValue}>
                {ratingValue}
              </option>
            ))}
          </select>
          {errors.rating && <div className="text-danger">{errors.rating}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows="3"
          />
          {errors.description && (
            <div className="text-danger">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Dining Options</label>
          <div>
            {diningOptions.map((option) => (
              <div key={option.id}>
                <label>
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={diningOption.includes(option.id)}
                    onChange={handleDiningOptionChange}
                  />{" "}
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          {errors.diningOption && (
            <div className="text-danger">{errors.diningOption}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Would You Recommend?</label>
          <div>
            <label>
              <input
                type="radio"
                name="recommend"
                value={true}
                checked={recommend === true}
                onChange={() => setRecommend(true)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="recommend"
                value={false}
                checked={recommend === false}
                onChange={() => setRecommend(false)}
              />{" "}
              No
            </label>
          </div>
          {errors.recommend && (
            <div className="text-danger">{errors.recommend}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/home")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEditLogPage;
