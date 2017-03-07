import * as A from "../action_types"

const defaultState = {
  errorMessage: null,
  message: null,
  errors: null,
  pending: false,
}

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case A.AUTH_UPDATE:
    case A.AUTH_LOGIN:
      return {
        ...defaultState,
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

    case A.AUTH_CLEAR_MESSAGES:
      return {
        ...state,
        errorMessage: null,
        errors: null,
        message: null,
      }

    default:
      return state
  }
}

export default auth
