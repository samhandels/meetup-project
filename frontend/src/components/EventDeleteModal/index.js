import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import { useHistory } from "react-router-dom";
import { thunkDeleteEvent } from '../../store/events.js'

function DeleteEvent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const event = useSelector(state => state.events.individualEvent);
  const group = useSelector(state => state.groups.individualGroup)
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    console.log(event)
    dispatch(thunkDeleteEvent(event.id));
    closeModal();
    history.push(`/groups/${group.id}`);
  };

  return (
    <div className="delete-modal">
        <h1 className="delete-modal-title">Confirm Delete</h1>
        <span className="delete-modal-message">Are you sure you want to remove this event?</span>
        <div className="delete-modal-buttons">
            <button className="delete-modal-button" onClick={handleDelete}>Yes (Delete Event)</button>
            <button className="delete-modal-button" onClick={closeModal}>No (Keep Event)</button>
        </div>
    </div>
  );
}

export default DeleteEvent;
