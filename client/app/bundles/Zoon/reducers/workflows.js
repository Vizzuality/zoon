import * as A from '../action_types';


const defaultState = {
  state: 'uninitialized',
  errorMessage: '',
  shownEntityId: null,
  entities: [],
  pageCount: null,
  currentPage: null,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case A.WORKFLOWS_FETCH_FINISHED:
      return {
        ...state,
        ...action.result,
      }

    default:
      return {
        ...defaultState,
        ...state,
      };
  }
};
