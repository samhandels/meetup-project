import { csrfFetch } from "./csrf";

// Action Types
const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS';
const GET_SINGLE_GROUP = 'groups/GET_SINGLE_GROUP';
const CREATE_GROUP = 'groups/CREATE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP';

// Action Creators
const getAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    groups,
  };
};

const getSingleGroup = (group) => {
  return {
    type: GET_SINGLE_GROUP,
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

export const thunkGetSingleGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(getSingleGroup(data.group));
    return data;
  } else {
    // Handle error case
  }
};

export const thunkCreateGroup = (group) => async (dispatch) => {
  const res = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify(group),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(createGroup(data.group));
    return data;
  } else {
    // Handle error case
  }
};

export const thunkUpdateGroup = (group) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${group.id}`, {
    method: 'PUT',
    body: JSON.stringify(group),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(updateGroup(data.group));
    return data;
  } else {
    // Handle error case
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
    // Handle error case
  }
};

// Initial State
const initialState = {
  allGroups: {},
  singleGroup: {},
  currentGroup: {}
};

// Reducer
const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
    case GET_ALL_GROUPS: {
        return { ...state, allGroups: action.groups };
    }
    case GET_SINGLE_GROUP: {
        const newState = { ...state, singleGroup: {} };
        newState.singleGroup = action.payload;
        return newState
    };
    case CREATE_GROUP: {
      const newState = { ...state };
      newState.allGroups[action.group.id] = action.group;
      return newState;
    }
    case UPDATE_GROUP: {
      const newState = { ...state };
      newState.allGroups[action.group.id] = action.group;
      return newState;
    }
    case DELETE_GROUP: {
      const newState = { ...state };
      delete newState.allGroups[action.groupId];
      return newState;
    }
    default:
      return state;
  }
};

export default groupsReducer;
