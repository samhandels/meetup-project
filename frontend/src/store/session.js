import { csrfFetch } from "./csrf";

// Types
const CREATE_SESSION = "session/POST_SESSION";
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// Actions
const createSession = (user) => {
    return {
        type: CREATE_SESSION,
        user,
    }
}

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// Thunks

export const createSessionThunk = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const resBody = await response.json();

    if (response.ok) dispatch(createSession(resBody.user));
    return resBody;
  };

export const login = ({ credential, password }) => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, firstName, lastName, email, password }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

// Reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CREATE_SESSION: {
        return { ...state, user: action.user };
      }
    case SET_USER:
      newState = { ...state, user: action.payload };
      return newState;
    case REMOVE_USER:
      newState = { ...state, user: null };
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
