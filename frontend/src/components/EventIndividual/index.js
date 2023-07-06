import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { thunkGetIndividualEvent } from "../../store/events";

export const EventIndividual = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const eventInfo = useSelector((state) => state.events);
  const event = eventInfo[eventId];
  const history = useHistory();

  useEffect(() => {
    dispatch(thunkGetIndividualEvent(eventId));
  }, [dispatch]);


  const sendToGroup = () => {
    history.push(`/groups/${event.Group.id}`);
  };

  const imageCheck = () => {
    // if (event.previewImage.length <= 0) {
    //   return "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg";
    // } else {
    //   return `${event.previewImage[0].url}`;
    // }
  };

  const eventPriceCheck = () => {
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
          <Link
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#00798A",
            }}
            to="/events"
          >
            Events
          </Link>
        </div>
        <div className="event-detail-header-container">
          <h2>{event.name}</h2>
          <p>Hosted by {event.Group.firstName} {event.Group.lastName}</p>
        </div>
      </div>
      <div className="event-detail-body-container">
        <div className="event-detail-body-info">
          <img
            className="event-detail-body-image"
            width="450"
            height="250"
            src={imageCheck()}
          />
          <div className="event-detail-body-info-group">
            <img
              onClick={sendToGroup}
              className="event-detail-body-info-group-image"
              width="100"
              height="75"
            //   src={`${event.previewImage[0].url}`}
            />
            <div className="event-detail-body-info-group-body">
              <h4 onClick={sendToGroup}>{event.Group.name}</h4>
            </div>
          </div>
          <div className="event-detail-body-info-event">
            <div className="event-detail-body-info-event-time-details">
              <i className="far fa-clock fa-lg" style={{ color: "#CCCCCC" }}></i>
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
              <i className="fa-solid fa-sack-dollar fa-xl" style={{ color: "#CCCCCC" }}></i>
              <p>{eventPriceCheck()}</p>
            </div>
            <div className="event-detail-body-info-event-type-details">
              <i className="fa-solid fa-map-pin fa-xl" style={{ color: "#CCCCCC" }}></i>
              <p>{event.type}</p>
            </div>
            <div className="event-detail-body-info-event-button">
              {/* <EventDetailButton event={event} /> */}
            </div>
          </div>
        </div>
        <div className="event-detail-body-description">
          <h2 style={{ marginBottom: ".25rem" }}>Details</h2>
          <p>{event.description}</p>
        </div>
      </div>
    </>
  );


};

export default EventIndividual;
