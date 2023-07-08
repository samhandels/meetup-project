import { csrfFetch } from "./csrf";

// Action Types
const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS';
const GET_INDIVIDUAL_GROUP = 'groups/GET_INDIVIDUAL_GROUP';
const CREATE_GROUP = 'groups/CREATE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP';
const GET_EVENT_DETAIL = 'groups/GET_EVENT_DETAIL'

// Action Creators
const getAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    groups,
  };
};

const getIndividualGroup = (group) => {
  return {
    type: GET_INDIVIDUAL_GROUP,
    group,
  };
};

const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group,
  };
};

const updateGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    group,
  };
};

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId,
  };
};

const getEventDetail = (event) => {
    return {
      type: GET_EVENT_DETAIL,
      event
    }
  }

// Thunk Action Creators
export const thunkGetAllGroups = () => async dispatch => {
    const res = await csrfFetch('/api/groups');
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllGroups(data.Groups))
    } else {
        const errors = await res.json();
        return errors;
    }
}


export const thunkGetIndividualGroup = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`);
    const resBody = await response.json();
    if (response.ok) dispatch(getIndividualGroup(resBody));
    return resBody;
  };


export const thunkCreateGroup = (group) => async (dispatch) => {
  const res = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify(group),
  });
  if (res.ok) {
    const group = await res.json();
    dispatch(createGroup(group));
    return group;
  } else {
    const errors = await res.json();
    return errors;
  }
};


export const thunkUpdateGroup = (group, groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify(group),
  });
  if (res.ok) {
    const group = await res.json();
    dispatch(updateGroup(group));
    return group;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    dispatch(deleteGroup(groupId));
    return res;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkGetEventDetail = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`)
    if (res.ok) {
      const data = await res.json()
      dispatch(getEventDetail(data))
      return data
    } else {
      return window.location.href = "/not-found"
    }
  }

// Initial State
const initialState = {
  allGroups: {},
  individualGroup: {},
  currentGroup: {},
  eventDetail: {}
};

// Reducer
const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
    case GET_ALL_GROUPS: {
        return { ...state, allGroups: action.groups };
    }
    case GET_INDIVIDUAL_GROUP: {
        return { ...state, individualGroup: action.group };
    };
    case CREATE_GROUP: {
        return { ...state, allGroups: { ...state.allGroups, [action.group.id]: action.group } };
      }
      case UPDATE_GROUP: {
        return { ...state, allGroups: { ...state.allGroups, [action.group.id]: action.group } };
      }
      case DELETE_GROUP: {
        const { [action.groupId]: deletedGroup, ...updatedGroups } = state.allGroups;
        return { ...state, allGroups: updatedGroups };
    }
    case GET_EVENT_DETAIL: {
        // const newState = { [action.event.id]: action.event}
        // return newState
        return { ...state, eventDetail: action.event.id };
      }
    default:
      return state;
  }
};

export default groupsReducer;
