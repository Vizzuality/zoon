import * as A from "../action_types"

const defaultState = {
  state: "uninitialized",
  errorMessage: "",
  errors: null,
  shownEntityId: null,
  entities: [],
  pageCount: null,
  currentPage: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case A.WORKFLOW_SUBMIT_FEEDBACK_FINISHED:
    case A.WORKFLOWS_FETCH_FINISHED:
      return {
        ...state,
        ...action.result,
      }

    case A.WORKFLOW_INIT:
      return {
        ...state,
        state: "fetching",
      }

    default:
      return {
        ...defaultState,
        ...state,
      }
  }
}
