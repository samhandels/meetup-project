import { csrfFetch } from "./csrf";

// Action Types
const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';
const GET_INDIVIDUAL_EVENT = 'events/GET_INDIVIDUAL_EVENT';

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
        return errors; // dont use window.location.href dont refresh page instead usehistory or redirect component
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
        default:
            return state;
    }
};

export default eventsReducer;
