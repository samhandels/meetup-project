import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EventRecord } from './EventRecord';
import { thunkGetAllEvents } from "../../store/events";
import './EventPage.css';

const EventPage = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => Object.values(state.events));
  const time = new Date();
  const upcomingEvents = [];
  const pastEvents = [];

  useEffect(() => {
    dispatch(thunkGetAllEvents());
  }, [dispatch]);

  for (let event of events) {
    if (new Date(event.startDate) > time) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  }

  upcomingEvents.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  pastEvents.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const sortedEvents = upcomingEvents.concat(pastEvents);

  return (
    <div className="event-list">
      <div className="event-header">
        <Link className="event-list-header-events" to="/events">
          Events
        </Link>
        <Link className="event-list-header-groups" to="/groups">
          Groups
        </Link>
      </div>
      <div>
        <p className="events-in-connect">Events in Connect</p>
      </div>
      {sortedEvents.map((event) => (
        <EventRecord event={event} key={event.id} />
      ))}
    </div>
  );
};

export default EventPage;
