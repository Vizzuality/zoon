import * as A from "../action_types"

const defaultState = {
  state: "uninitialized",
  errorMessage: "",
  shownEntityId: null,
  entities: [],
}

const modules = (state = defaultState, action) => {
  switch (action.type) {
    case A.MODULES_FETCH_LIST:
      return {
        ...state,
        state: "fetching",
      }
    case A.MODULE_SUBMIT_FEEDBACK_FINISHED:
    case A.MODULES_FETCH_FINISHED:
      return {
        ...state,
        ...action.result,
      }

    case A.MODULES_CLEAR:
    case A.MODULE_CLEAR:
      return {
        ...state,
        entities: [],
        shownEntityId: null,
      }

    case A.MODULE_INIT:
      return {
        ...state,
        shownEntityId: action.id,
      }

    case A.MODULES_CREATE_TAG:
    case A.MODULES_DELETE_TAG:
    case A.MODULES_DELETE_SCREENSHOT:
    case A.MODULES_UPLOAD_SCREENSHOT:
      return {
        ...state,
        errors: null,
      }

    case A.TAG_ERROR:
    case A.SCREENSHOT_ERROR:
      return {
        ...state,
        errors: action.errors,
      }

    default:
      return {
        ...defaultState,
        ...state,
      }
  }
}

export default modules
