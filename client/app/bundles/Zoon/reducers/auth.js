import * as A from '../action_types';

const defaultState = {
  errorMessage: null,
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case A.AUTH_LOGIN:
      return {
        ...state,
        pending: true,
      }
    case A.AUTH_FINISHED:
      return {
        ...state,
        ...action.payload,
        pending: false,
      }
    case A.AUTH_LOGOUT_FINISHED:
      return {
        ...defaultState,
        ...action.payload,
      }
    default:
      return state;
  }
};

export default auth;
