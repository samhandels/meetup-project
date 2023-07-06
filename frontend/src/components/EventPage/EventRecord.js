import React from "react";
import { useHistory } from "react-router-dom";

export const EventRecord = ({ event }) => {
  const history = useHistory();

  const eventHistory = () => {
    history.push(`/events/${event.id}`);
  };

  if (event.previewImage === "no preview image" || event.previewImage === undefined) {
    event.previewImage = "https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80";
  }

  return (
    <div onClick={eventHistory} className="event-record-div" style={{ cursor: "pointer" }}>
      <img
        className="event-record-img"
        width="250"
        height="150"
        src={event.previewImage}
        alt="Event Preview"
      ></img>
            <p className="event-list-info-time">
          {event.startDate.split("T")[0]} · {}
          {event.startDate.split("T")[1].split(".")[0]}
          {}
        </p>
      <div
        className="event-individual-record"
        to={{ pathname: `/events/${event.id}`, state: {} }}
      >
        {event.name}
      </div>
      <p className="event-location">
        {event.Group.city}, {event.Group.state}
      </p>
    </div>
  );
};
