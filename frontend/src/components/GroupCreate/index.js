import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as groupActions from "../../store/groups";
import "./GroupCreate.css";

export const GroupCreate = ({ formType, group }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [cityState, setCityState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState(undefined);
  const [privacy, setPrivacy] = useState(undefined);
  const [url, setUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formType === "Create") {
    const errors = {};
    if (!cityState || !cityState.includes(",")) {
      errors.cityState = "Location is required";
    }
    if (!name) {
      errors.name = "Name is required";
    }
    if (about.length < 30) {
        errors.about = 'Description must be at least 30 characters long';
    }
    if (!type) {
      errors.type = "Group Type is required";
    }
    if (!privacy) {
      errors.privacy = "Visibility Type is required";
    }
    if (!url) {
      errors.url = "URL is required";
    } else if (
        !url.endsWith(".jpeg") &&
        !url.endsWith(".jpg") &&
        !url.endsWith(".png")
    ) {
        errors.url = "Image URL must end with .png, .jpg, or .jpeg";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }


    const groupData = {
      city: cityState.split(",")[0],
      state: cityState.split(",")[1],
      name,
      about,
      type,
      privacy,
      url,
    };

    dispatch(groupActions.thunkCreateGroup(groupData))
      .then((res) => {
        history.push(`/groups/${res.id}`);
      })
      .catch((err) => {
        console.error("Error creating group:", err);
      });
  }
};

  return (

    <form onSubmit={handleSubmit}>
      <div>
      <h1>Create a Group</h1>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <h3>First, set your group's location.</h3>
        <div>
          <label htmlFor="cityState"> Meetup groups meet locally, in person, and online. We'll connect you with people in your area.</label>
          <input
            type="text"
            id="cityState"
            value={cityState}
            onChange={(e) => setCityState(e.target.value)}
          />
          {validationErrors.cityState && (
            <p className="error">{validationErrors.cityState}</p>
          )}
        </div>
        <div>
            <h3>What will your group's name be?</h3>
          <label htmlFor="name">Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {validationErrors.name && (
            <p className="error">{validationErrors.name}</p>
          )}
        </div>
        <div>
            <h3>Now describe what your group will be about</h3>
          <label htmlFor="about">People will see this when we promote your group, but you'll be able to add to it later, too.</label>
          <ol>
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          {validationErrors.about && (
            <p className="error">{validationErrors.about}</p>
          )}
        </div>
        <div>
        <h3>Final steps...</h3>
          <label htmlFor="type">Is this an in person or online group?</label>
          <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value={undefined}>(select one)</option>
              <option value="Online">Online</option>
              <option value="In person">In person</option>
            </select>
          {validationErrors.type && (
            <p className="error">{validationErrors.type}</p>
          )}
        </div>
        <div>
          <label htmlFor="privacy">Is this group private or public?</label>
          <select
              className="form-select"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value={undefined}>(select one)</option>
              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </select>
          {validationErrors.privacy && (
            <p className="error">{validationErrors.privacy}</p>
          )}
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {validationErrors.url && (
            <p className="error">{validationErrors.url}</p>
          )}
        </div>
        <button type="submit" className="form-submit-btn">Create Group</button>
    </div>
      </form>
  );
};

export default GroupCreate;
