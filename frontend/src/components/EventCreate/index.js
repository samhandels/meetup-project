import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import * as groupActions from "../../store/groups";
import * as eventActions from "../../store/events";
import "./EventCreate.css";

export const EventCreate = ({ formType }) => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.individualGroup);
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [privacy, setPrivacy] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "Create") {
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

    if (!privacy) {
        errors.privacy = "Privacy setting is required";
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
        type: eventType,
        capacity: Number(capacity),
        price: Number(price),
        startDate,
        endDate,
        privacy,
        description,
      };
      console.log("this is the event data", typeof capacity)

      dispatch(eventActions.thunkCreateEvent(eventData, groupId, imageURL))
        .then((res) => {
          history.push(`/events/${res.id}`);
        })
        .catch((err) => {
          console.error("Error creating group:", err);
        });

        // dispatch(groupActions.thunkGetIndividualGroup(group, imageURL))
        //   .then((res) => {
        //     history.push(`/events/${res.id}`);
        //   })
        //   .catch((err) => {
        //     console.error("Error creating group:", err);
        //   });

      }
    }
  };


  return (
    <form className="event-create-form" onSubmit={handleSubmit}>
    <div className="event-create-container">
      <h1>Create an Event for {group.name}</h1>
        <div className="form-group">
          <label htmlFor="name">What is the name of your event?</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
          />
          <div>
          {validationErrors.name && (
            <span className="error">{validationErrors.name}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="eventType" className="eventType">Is this an in person or online event?</label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          <div>
          {validationErrors.eventType && (
            <span className="error">{validationErrors.eventType}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            value={capacity}
            type="number"
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="# People allowed"
          >
          </input>
          <div>
          {validationErrors.capacity && (
            <span className="error">{validationErrors.capacity}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="privacy">Is this event private or public?</label>
          <select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <div>
          {validationErrors.privacy && (
            <span className="error">{validationErrors.privacy}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="price">What is the price for your event?</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="$0"
          />
          <div>
          {validationErrors.price && (
            <span className="error">{validationErrors.price}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="startDate" className="start-date">When does your event start?</label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <div>
          {validationErrors.startDate && (
            <span className="error">{validationErrors.startDate}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="endDate">When does your event end?</label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div>
          {validationErrors.endDate && (
            <span className="error">{validationErrors.endDate}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="imageURL" className="img-url">Please add an image url for your event below:</label>
          <input className="img-input"
            type="text"
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Image URL"
          />
          <div>
          {validationErrors.imageURL && (
            <span className="error">{validationErrors.imageURL}</span>
          )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description" className="description">Please describe your event:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please include at least 30 characters"
          ></textarea>
          <div>
          {validationErrors.description && (
            <span className="error">{validationErrors.description}</span>
          )}
          </div>
        </div>
        <button type="submit" className="create-event-btn">
          Create Event
        </button>
    </div>
      </form>
  );
};

export default EventCreate;
