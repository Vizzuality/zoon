import * as A from '../action_types';


const defaultState = {
  state: 'uninitialized',
  errorMessage: '',
  shownEntityId: null,
  entities: [],
  pageCount: null,
  currentPage: null,
};

const modules = (state = defaultState, action) => {
  switch (action.type) {
    case A.MODULE_SUBMIT_FEEDBACK_FINISHED:
    case A.MODULES_FETCH_FINISHED:
      return {
        ...state,
        ...action.result,
      }

    case A.MODULES_UPDATE_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.newQuery,
      }

    case A.MODULES_UPDATE_SEARCH_TAGS:
      return {
        ...state,
        searchTags: action.searchTags,
        granularity: action.granularity,
      }

    case A.MODULES_UPDATE_FAMILY_FILTER:
      return {
        ...state,
        searchFamily: action.newFamilyName,
      }

    case A.MODULES_CLEAR:
      return {
        ...state,
      }

    case A.MODULE_INIT:
      return {
        ...state,
        shownEntityId: action.id,
      };

    case A.MODULE_CLEAR:
      return {
        ...state,
        entities: [],
        shownEntityId: null,
      };

    case A.MODULES_CREATE_TAG:
    case A.MODULES_DELETE_TAG:
    case A.MODULES_DELETE_SCREENSHOT:
    case A.MODULES_UPLOAD_SCREENSHOT:
      return {
        ...state,
        errors: null,
      };

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
      };
  }
};

export default modules;
