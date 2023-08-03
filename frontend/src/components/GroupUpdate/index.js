import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { thunkGetIndividualGroup, thunkUpdateGroup } from '../../store/groups'
import './GroupUpdate.css';

function EditGroup() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { groupId } = useParams()
  const group = useSelector(state => state.groups.individualGroup)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
      dispatch(thunkGetIndividualGroup(groupId));
  }, [dispatch])

  if (!user) {
    history.push('/')
  }

  const [cityState, setCityState] = useState(group.id ? group.city.trim() + ', ' + group.state.trim() : '');
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.about ?? '');
  const [type, setType] = useState(group.type ?? '');
  const [privacy, setPrivacy] = useState(group.private ?? '');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() =>  {
    if (groupId && group.Organizer) {
      if (group.Organizer && (!user || user.id !== group.Organizer.id)) {
          return history.push('/')
      }
      setCityState(group.city.trim() + ', ' + group.state.trim());
      setName(group.name);
      setAbout(group.about);
      setType(group.type);
      setPrivacy(group.private);
    }
  }, [group])

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = {}
    if (!cityState || !cityState.includes(',')) errors.cityState = 'Location is required';
    if (!name) errors.name = 'Name is required';
    if (about.length < 50) errors.about = 'Description must be at least 50 characters long';
    if (type === undefined) errors.type = 'Group Type is required';
    if (privacy === undefined) errors.privacy = 'Visibility type is required';


    console.log("errors in handlesubmit", errors)
    if (Object.values(errors).length) {
      setValidationErrors(errors)

    } else {
        const city = cityState.split(',')[0];
        const state = cityState.split(',')[1];
        const payload = {name, about, type, private: privacy, city, state}
        console.log("this is the groupID", groupId);
        dispatch(thunkUpdateGroup(payload, groupId))
        history.push(`/groups/${groupId}`)
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <span className="form-title">UPDATE YOUR GROUP'S INFORMATION</span>
        <h2>
          We'll walk you through a few steps to build your group's information
        </h2>
      </div>
      <div className="form-step">
        <h3 className="location-h3">First, set your group's location</h3>
        <span>
          Connect groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </span>
        <form className="form-step-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="City, STATE"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
            />
            {validationErrors.cityState && (
              <span className="errors">{validationErrors.cityState}</span>
            )}
          </div>
          <div className="form-group-name">
            <h3>What is the name of your group?</h3>
            <span>
              Choose a name that will give people a clear idea of what the group
              is about.
            </span>
            <span>
              Feel free to get creative!
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="What is your group name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && (
              <span className="errors">{validationErrors.name}</span>
            )}
          </div>
          <div className="form-group-about">
            <h3>Now describe what your group will be about</h3>
            <span>
              People will see this when we promote your group.
            </span>
            <span>1. What's the purpose of the group?</span>
            <span>2. Who should join?</span>
            <span>3. What will you do at your events?</span>
            <textarea
              className="form-textarea"
              value={about}
              placeholder="Please write at least 50 characters"
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
            {validationErrors.about && (
              <span className="errors">{validationErrors.about}</span>
            )}
          </div>
          <div className="form-group-footer">
            <h3>Final steps...</h3>
            <span>Is this an in person or online group?</span>
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
              <span className="errors">{validationErrors.type}</span>
            )}
            <span>Is this group private or public?</span>
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
              <span className="errors">{validationErrors.privacy}</span>
            )}
          </div>
          <button type="submit" className="form-submit-btn">
            Update group
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditGroup
