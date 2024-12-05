import React from "react";

const LogItem = ({ log, diningOptions, users, restaurants }) => {
  function getDiningOptionText(optionIds) {
    if (!optionIds || optionIds.length === 0) {
      return "N/A";
    }

    var names = [];
    for (var i = 0; i < optionIds.length; i++) {
      var option = diningOptions.find(function (opt) {
        return opt.id === optionIds[i];
      });
      if (option) {
        names.push(option.name);
      }
    }
    return names.length > 0 ? names.join(", ") : "N/A";
  }

  function getUserName(userId) {
    var user = users.find(function (u) {
      return u.id === userId;
    });
    return user ? user.name : "Unknown User";
  }

  function getRestaurantName(restaurantId) {
    var restaurant = restaurants.find(function (res) {
      return res.id === restaurantId;
    });
    return restaurant ? restaurant.name : "Unknown Restaurant";
  }

  return (
    <div className="Log" data-testid="log-item">
      <h2 data-testid="restaurant-name">
        <strong>{getRestaurantName(log.restaurantId)}</strong>
      </h2>
      <p data-testid="user-name">
        Logged by <strong>{getUserName(log.userId)}</strong>
      </p>
      <p data-testid="food-ordered">
        <strong>Food Ordered:</strong> {log.foodOrdered}
      </p>
      <p data-testid="date">
        <strong>Date:</strong> {log.date}
      </p>
      <p data-testid="rating">
        <strong>Rating:</strong> {log.rating}/5
      </p>
      <p data-testid="dining-option">
        <strong>Dining Option:</strong> {getDiningOptionText(log.diningOption)}
      </p>
      <p data-testid="recommend">
        <strong>Recommend:</strong> {log.recommend ? "Yes" : "No"}
      </p>

      <p data-testid="description">{log.description}</p>
    </div>
  );
};

export default LogItem;
