import { csrfFetch } from "./csrf";

// Action Types
const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';
const GET_INDIVIDUAL_EVENT = 'events/GET_INDIVIDUAL_EVENT';
const CREATE_EVENT = 'events/new'
const DELETE_EVENT ='events/DELETE_EVENT';

// Action Creators
const getAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    events,
  };
};

const getIndividualEvent = (event) => {
  return {
    type: GET_INDIVIDUAL_EVENT,
    event,
  };
};

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        payload: event
    };
};

const deleteEvent = (eventId) => {
    return {
      type: DELETE_EVENT,
      eventId,
    };
  };

// Thunk Action Creators
export const thunkGetAllEvents = () => async dispatch => {
    const res = await csrfFetch('/api/events');
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllEvents(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const thunkGetIndividualEvent = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getIndividualEvent(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}


export const thunkCreateEvent = (event, groupId, img) => async(dispatch) => {
    console.log("in the thunk", img)
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
    if (res.ok) {
        const data = await res.json()
        const imgRes = await csrfFetch(`/api/events/${data.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: img,
                preview: true
            })
        })
        const newImg = await imgRes.json()
        data.EventImages = [newImg]
        dispatch(createEvent([data]))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = res.json();
    //   window.location.href = `/api/groups/${groupId}`
      dispatch(deleteEvent(eventId));
      return data;
    }
  };

  export const thunkGetEventsByGroup = (groupId) => async(dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/events`)
    if (res.ok) {
        const data = await res.json()
        dispatch(getAllEvents(data))
        return data
    }
}

// Initial State
const initialState = {};

// Reducer
const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            const newState = {...state};
            action.events.Events.forEach(event => {
                newState[event.id] = event;
            });
            return newState;
        }
        case GET_INDIVIDUAL_EVENT: {
            const newState = { ...state, [action.event.id]: action.event };
            return newState;
        }
        case CREATE_EVENT: {
            return {...state, allEvents: {...state.allEvents}, [action.payload.id]: action.payload }
        }
        case DELETE_EVENT: {
            const newState = { ...state };
            delete newState[action.eventId];
            return newState;
        }
        default:
            return state;
    }
};

export default eventsReducer;
