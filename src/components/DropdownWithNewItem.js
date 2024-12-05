import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DropdownWithNewItem = ({
  label,
  apiEndpoint,
  selectedId,
  setSelectedId,
  apiKey,
}) => {
  const [options, setOptions] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [newItem, setNewItem] = useState("");
  const dataFetched = useRef(false);

  const fetchOptions = () => {
    if (!dataFetched.current) {
      fetch(apiEndpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setOptions(data);
          dataFetched.current = true;
        })
        .catch(() => {
          toast.error(`Failed to load options from ${label} API.`);
        });
    }
  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "new") {
      setIsNew(true);
      setSelectedId(null);
    } else {
      setIsNew(false);
      setSelectedId(selectedValue);
    }
  };

  const handleAddNewItem = () => {
    if (!newItem) {
      toast.error(`Please enter a valid ${label.toLowerCase()}.`);
      return;
    }

    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ name: newItem }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error(`Failed to add new ${label.toLowerCase()}.`);
        }
        return response.json();
      })
      .then((addedItem) => {
        const updatedOptions = options.slice();
        updatedOptions.push(addedItem);
        setOptions(updatedOptions);
        setSelectedId(addedItem.id);
        setNewItem("");
        setIsNew(false);

        toast.success(`${label} added successfully!`);
      })
      .catch(() => {
        toast.error(`Failed to add new ${label.toLowerCase()}.`);
      });
  };

  fetchOptions();

  return (
    <div className="mb-3" data-testid="dropdown-container">
      <label className="form-label" data-testid="dropdown-label">
        {label}
      </label>
      <select
        className="form-select"
        value={isNew ? "new" : selectedId || ""}
        onChange={handleChange}
        data-testid="dropdown-select"
      >
        <option value="" data-testid="dropdown-default-option">
          {`-- Select ${label} --`}
        </option>
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            data-testid={`dropdown-option-${option.id}`}
          >
            {option.name}
          </option>
        ))}
        <option value="new" data-testid="dropdown-new-option">
          Other (Enter New {label})
        </option>
      </select>

      {isNew && (
        <div className="mt-2" data-testid="new-item-form">
          <input
            type="text"
            className="form-control"
            placeholder={`Enter new ${label.toLowerCase()}`}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            data-testid="new-item-input"
          />
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleAddNewItem}
            data-testid="add-new-item-button"
          >
            Add New {label}
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownWithNewItem;
