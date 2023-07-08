import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { thunkGetIndividualEvent } from "../../store/events";
import './EventIndividual.css';
import DeleteEvent from "../EventDeleteModal";
import OpenModalButton from "../OpenModalButton";

export const EventIndividual = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const eventInfo = useSelector((state) => state.events);
  const event = eventInfo[eventId];
  const history = useHistory();

  useEffect(() => {
    dispatch(thunkGetIndividualEvent(eventId));
  }, [dispatch]);


  if (!eventInfo[eventId] || !event.EventImages || event.EventImages.length === 0) {
    return null;
  }

  const editEvent = () => {
    history.push(`/events/${eventId}/edit`)
  }

  const sendToGroup = () => {
    history.push(`/groups/${event.Group.id}`);
  };

  const imageCheck = () => {
    if (event.previewImage === "no preview image" || event.previewImage === undefined) {
        event.previewImage = "https://m.media-amazon.com/images/I/71pIS8f417L.jpg";
      } else {
      return `${event.EventImages[0].url}`;
    }
  };

  const eventPrice = () => {
    if (event.price <= 0) {
      return "FREE";
    } else {
      return `Price: $${event.price}`;
    }
  };

  return (
    <>
      <div className="event-detail-container">
        <div className="event-detail-breadcrumb">
          <p>{"<"}</p>
          <Link to="/events">Events</Link>
        </div>
        <div className="event-detail-header-container">
          <h2>{event.name}</h2>
          <p>Hosted by {event.Group.firstName} {event.Group.lastName}</p>
        </div>
      </div>
      <div className="event-detail-body-container">
        <div className="event-detail-body-info">
          <img className="event-detail-body-image" width="500" height="300" src={imageCheck()} />
          <div className="event-detail-body-info-group">
            <img
              onClick={sendToGroup}
              className="event-detail-body-info-group-image"
              width="110"
              height="75"
              src={`${event.EventImages[0].url}`} //wrong image populating
            />
            <div className="event-detail-body-info-group-body">
              <h4 onClick={sendToGroup}>{event.Group.name}</h4>
            </div>
          </div>
          <div className="event-detail-body-info-event">
            <div className="event-detail-body-info-event-time-details">
              <i className="fa fa-regular fa-clock event-icon"></i>
              <div className="event-detail-body-info-event-details-time-container">
                <div className="event-detail-body-info-event-details-start-time">
                  <span>START </span>
                  <div>
                    {event.startDate.split("T")[0]} · {}
                    {event.startDate.split("T")[1].split(".")[0]}
                  </div>
                </div>
                <div className="event-detail-body-info-event-details-end-time">
                  <span>END </span>
                  <div>
                    {event.endDate.split("T")[0]} · {}
                    {event.endDate.split("T")[1].split(".")[0]}
                  </div>
                </div>
              </div>
            </div>
            <div className="event-detail-body-info-event-price-details">
              <i className="fa fa-solid fa-dollar-sign event-icon"></i>
              <p>{eventPrice()}</p>
            </div>
            <div className="event-detail-body-info-event-type-details">
              <i className="fa fa-solid fa-map-pin event-icon"></i>
              <p>{event.type}</p>
            </div>
            <div className="event-delete">
                      <OpenModalButton
                        modalComponent={<DeleteEvent />}
                        buttonText={"Delete"}
                      />
                  </div>
            <div className="event-detail-body-info-event-button">{/* <EventDetailButton event={event} /> */}</div>
          </div>
        </div>
        <div className="event-detail-body-description">
          <h2>Details</h2>
          <p>{event.description}</p>
        </div>
      </div>
    </>
  );
};

export default EventIndividual;
