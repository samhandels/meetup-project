import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import * as groupActions from "../../store/groups";
import * as eventActions from "../../store/events";
import "./EventCreate.css";

const EventCreate = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.singleGroup);

  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!eventType) {
      errors.eventType = "Event Type is required";
    }

    if (!capacity) {
      errors.capacity = "Capacity is required";
    }

    if (!price) {
      errors.price = "Price is required";
    } else if (!Number.isInteger(Number(price))) {
    errors.price = "Price must be a number";
  }

    if (!startDate) {
      errors.startDate = "Start date is required";
    } else if (new Date(startDate) < new Date()) {
      errors.startDate = "Start date must be in the future";
    }

    if (!endDate) {
      errors.endDate = "End date is required";
    }

    if (startDate > endDate) {
      errors.startDate = "Start date cannot be after end date";
      errors.endDate = "End date cannot be before start date";
    }

    if (!imageURL) {
      errors.imageURL = "Image URL is required";
    } else if (
      !imageURL.endsWith(".jpeg") &&
      !imageURL.endsWith(".jpg") &&
      !imageURL.endsWith(".png")
    ) {
      errors.imageURL = "Image URL must end with .png, .jpg, or .jpeg";
    }

    if (!description) {
      errors.description = "Description is required";
    } else if (description.length < 30) {
      errors.description = "Description must be at least 30 characters long";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      const eventData = {
        name,
        eventType,
        capacity,
        price,
        startDate,
        endDate,
        imageURL,
        description,
      };

      dispatch(eventActions.thunkCreateEvent(eventData, groupId))
        .then((res) => {
          // Event creation successful
          history.push(`/events/${res.id}`);
        })
        .catch((err) => {
          // Handle error, display error message, etc.
        });
    }
  };

  return (
    <div className="event-create-container">
      <h1>Create an Event for {group?.name}</h1>
      <form className="event-create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">What is the name of your event?</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {validationErrors.name && (
            <span className="error">{validationErrors.name}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="eventType">Is this an in person or online event?</label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {validationErrors.eventType && (
            <span className="error">{validationErrors.eventType}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Is this event private or public?</label>
          <select
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
          {validationErrors.capacity && (
            <span className="error">{validationErrors.capacity}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="integer"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {validationErrors.price && (
            <span className="error">{validationErrors.price}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {validationErrors.startDate && (
            <span className="error">{validationErrors.startDate}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {validationErrors.endDate && (
            <span className="error">{validationErrors.endDate}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="imageURL">Image URL</label>
          <input
            type="text"
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
          {validationErrors.imageURL && (
            <span className="error">{validationErrors.imageURL}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {validationErrors.description && (
            <span className="error">{validationErrors.description}</span>
          )}
        </div>
        <button type="submit" className="create-event-btn">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventCreate;
