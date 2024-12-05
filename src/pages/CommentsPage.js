import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommentsPage = () => {
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newComment, setNewComment] = useState({ userId: "", content: "" });

  const hasFetchedData = useRef(false);
  const apiKey = process.env.REACT_APP_API_KEY;
  const logId = window.location.pathname.split("/")[2];

  const fetchData = () => {
    if (hasFetchedData.current) return;

    fetch(`http://localhost:5500/logs/${logId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then(setLog)
      .catch(() => setError("Failed to fetch log details"));

    fetch(`http://localhost:5500/comments?logId=${logId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setComments(data.filter((comment) => comment.logId === logId))
      )
      .catch(() => setError("Failed to fetch comments"));

    fetch("http://localhost:5500/users", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError("Failed to fetch users"));

    fetch("http://localhost:5500/restaurants", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then(setRestaurants)
      .catch(() => setError("Failed to fetch restaurants"));

    hasFetchedData.current = true;
  };

  useEffect(() => {
    if (!logId) {
      toast.error("Invalid log ID.");
      return;
    }
    fetchData();
    document.title = log
      ? `Comments - ${getRestaurantName(log.restaurantId)}`
      : "Comments";
  }, [log, logId]);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Anonymous";
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((res) => res.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!newComment.content || (!newComment.userId && !isNewUser)) {
      toast.error("Please fill out the comment and select or add a user.");
      return;
    }

    if (isNewUser) {
      const newUser = { id: Date.now().toString(), name: newUserName };

      fetch("http://localhost:5500/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.json())
        .then((createdUser) => {
          setUsers((prevUsers) => [...prevUsers, createdUser]);
          setNewComment({
            userId: createdUser.id,
            content: newComment.content,
          });
          addComment(createdUser.id);
        })
        .catch(() => toast.error("Failed to add new user."));
    } else {
      addComment(newComment.userId);
    }
  };

  const addComment = (userId) => {
    const commentData = {
      userId,
      logId,
      content: newComment.content,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:5500/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(commentData),
    })
      .then((res) => res.json())
      .then((createdComment) => {
        setComments((prevComments) => {
          const newComments = prevComments.slice();
          newComments.push(createdComment);
          return newComments;
        });
        setNewComment({ userId: "", content: "" });
        setIsNewUser(false);
        setNewUserName("");
        toast.success("Comment added successfully!");
      })
      .catch(() => toast.error("Failed to add comment."));
  };

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  if (!log) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className="container">
      <h1>Comments for {getRestaurantName(log.restaurantId)}</h1>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p>
              <strong>{getUserName(comment.userId)}:</strong> {comment.content}
            </p>
            <p className="text-muted">
              {new Date(comment.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No comments yet for this restaurant.</p>
      )}

      <h3>Add a Comment</h3>
      <form onSubmit={handleAddComment}>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            User
          </label>
          <select
            id="userId"
            name="userId"
            value={isNewUser ? "new" : newComment.userId}
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue === "new") {
                setIsNewUser(true);
                setNewComment({ userId: "", content: newComment.content });
              } else {
                setIsNewUser(false);
                setNewComment({
                  userId: selectedValue,
                  content: newComment.content,
                });
              }
            }}
            className="form-select"
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
            <option value="new">Other (Add New User)</option>
          </select>
          {isNewUser && (
            <input
              type="text"
              name="newUserName"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter new user name"
              className="form-control mt-2"
            />
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Comment
          </label>
          <textarea
            id="content"
            name="content"
            value={newComment.content}
            onChange={(e) =>
              setNewComment({
                userId: newComment.userId,
                content: e.target.value,
              })
            }
            className="form-control"
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Comment
        </button>
      </form>

      <br />
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate(`/logs/${logId}`)}
      >
        Return to Details Page
      </button>
    </div>
  );
};

export default CommentsPage;
