import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import * as groupDetails from '../../store/groups';
import './GroupIndividual.css';

export const GroupIndividual = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const groupInfo = useSelector((state) => state.groups.individualGroup);
  const groupStore = useSelector((state) => state.groups);

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

  return (
    <div className="group-details-page">
      <div className="return-nav">
        <button className="return-btn" onClick={returnGroups}>
          Return to Groups
        </button>
      </div>
      <div className="group-individual-header">
        <img
          src={previewImage}
          alt="Group Preview"
          className="group-image"
        />
      </div>
      <div className="group-info">
        <h2 className="group-name">{groupInfo.name}</h2>
        <p className="group-location">
          {groupInfo.city}, {groupInfo.state}
        </p>
        <div className="group-membership">
          <p>{groupInfo.numMembers} Members</p>
          <p>&bull;</p>
          <p>{groupInfo.private ? "Private" : "Public"}</p>
        </div>
        <p>
          Organized by &nbsp;
          <span className="organizer">
            {groupInfo["Organizer"].firstName}{" "}
            {groupInfo["Organizer"].lastName}
          </span>
        </p>
          <span>
          <button className="JoinButton" onClick={comingSoon}>
        Join this group
        </button>
          </span>
        <div className="about">
        <h3>About</h3>
        <p>{groupInfo.about}</p>
      </div>
      </div>
    </div>
  );
}

export default GroupIndividual;
