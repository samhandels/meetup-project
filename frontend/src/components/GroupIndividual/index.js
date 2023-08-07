import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import * as groupDetails from '../../store/groups';
import * as eventDetails from '../../store/events';
import './GroupIndividual.css';
import { GroupIndividualEvents } from "./GroupIndividualEvents";
import DeleteGroup from "../GroupDeleteModal";
import OpenModalButton from "../OpenModalButton";

export const GroupIndividual = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const { eventId } = useParams();
  const history = useHistory();
  const groupInfo = useSelector((state) => state.groups.individualGroup);
  const eventInfo = useSelector((state) => state.events);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(eventDetails.thunkGetEventsByGroup(groupId));
  }, [dispatch, groupId, eventId]);

  useEffect(() => {
    dispatch(groupDetails.thunkGetIndividualGroup(groupId));
  }, [dispatch, groupId]);

  if (!groupInfo.id || Number(groupInfo.id) !== Number(groupId)) return null;

  const { GroupImages, name, city, state, numMembers, private: isPrivate, Organizer, about } = groupInfo;
  const images = GroupImages || [];
  const previewImage = images.find((img) => img.preview)?.url;

  const returnGroups = () => {
    history.push("/groups");
  };

  const comingSoon = () => {
    alert("Feature coming soon!");
  };

  const createEvent = () => {
    history.push(`/groups/${groupId}/events/new`);
  };

  const updateGroup = () => {
    history.push(`/groups/${groupId}/edit`);
  };


  const eventsCheck = () => {
    if (eventInfo === undefined) {
      return <h3 style={{ marginTop: ".2rem" }}>No Upcoming Events</h3>;
    } else {
      return <GroupIndividualEvents events={eventInfo} groupId={groupId}/>;
    }
  };

  const navigateToEvent = (eventId) => {
    history.push(`/events/${eventId}`);
  };

  const eventsLengthCheck = () => {
    if (eventInfo === undefined) {
      return "0";
    } else {
      return Object.keys(eventInfo).length;
    }
  };

  return (
    <>
      <div className="group-details-page">
        <div className="group-details-container"></div>
        <div className="return-nav">
          <button className="return-btn" onClick={returnGroups}>
            &lt; Return to Groups
          </button>
        </div>
        <div className="group-individual-header">
          <img src={previewImage} alt="Group Preview" className="group-image" />

          <div className="group-info">
            <h2 className="group-name">{groupInfo.name}</h2>
            <p className="group-location">
              {groupInfo.city}, {groupInfo.state}
            </p>
            <div className="group-membership">
              <p>{eventsLengthCheck()} events</p>
              <p>&bull;</p>
              <p>{groupInfo.private ? "Private" : "Public"}</p>
            </div>
            <p>
              Organized by &nbsp;
              <span className="organizer">
                {groupInfo["Organizer"].firstName} {groupInfo["Organizer"].lastName}
              </span>
            </p>
            <div className="buttons-container-groups">
              {user && user.id === groupInfo["Organizer"].id ? (
                <>
                  <button className="create-event-button" onClick={createEvent}>
                    Create Event
                  </button>
                  <button className="update-group-button" onClick={updateGroup}>
                    Update
                  </button>
                  <div className="delete-group-button-div">
                    <OpenModalButton classname="delete-group-button" modalComponent={<DeleteGroup />} buttonText={'Delete'} />
                  </div>
                </>
              ) : (
                <button className="join-group-button" onClick={comingSoon}>
                  Join this group
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="about-events-section">
        <div className="about">
          <div className="organizer-body">
            <h3>Organizer</h3>
            <p className="organizer-name">
              {groupInfo["Organizer"].firstName} {groupInfo["Organizer"].lastName}
            </p>
          </div>
          <h3>What we're about</h3>
          <p>{groupInfo.about}</p>
        </div>
        <div className="upcoming-events">{eventsCheck()}</div>
      </div>
    </>
  );
};

export default GroupIndividual;
