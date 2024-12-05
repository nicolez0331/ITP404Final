import React from "react";
import { render } from "@testing-library/react";
import LogItem from "./LogItem";

test("renders restaurant name correctly", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("restaurant-name")).toHaveTextContent("Great White");
});

test("renders user name correctly", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("user-name")).toHaveTextContent("Logged by Nicole Zhang");
});

test("renders correct description", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("description")).toHaveTextContent("Great brunch!");
});

test("renders food ordered correctly", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("food-ordered")).toHaveTextContent(
    "Food Ordered: Avocado Toast"
  );
});

test("renders 'Recommend: Yes' when recommend is true", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("recommend")).toHaveTextContent("Recommend: Yes");
});

test("renders 'Recommend: No' when recommend is false", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: false,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("recommend")).toHaveTextContent("Recommend: No");
});

test("renders correct dining option text when dining option is selected", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("dining-option")).toHaveTextContent(
    "Dining Option: Indoor"
  );
});

test("renders correct date format", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );

  expect(getByTestId("date")).toHaveTextContent("Date: 2023-12-01");
});

test("renders correct user rating display", () => {
  const log = {
    restaurantId: 1,
    userId: 1,
    foodOrdered: "Avocado Toast",
    date: "2023-12-01",
    rating: 5,
    diningOption: [1],
    recommend: true,
    description: "Great brunch!",
  };
  const diningOptions = [{ id: 1, name: "Indoor" }];
  const users = [{ id: 1, name: "Nicole Zhang" }];
  const restaurants = [{ id: 1, name: "Great White" }];

  const { getByTestId } = render(
    <LogItem
      log={log}
      diningOptions={diningOptions}
      users={users}
      restaurants={restaurants}
    />
  );
  expect(getByTestId("rating")).toHaveTextContent("Rating: 5/5");
});
