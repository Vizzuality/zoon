import * as A from '../action_types';
import { LOCATION_CHANGE } from 'react-router-redux'


const defaultState = {
  state: 'uninitialized',
  errorMessage: '',
  selectedFamilyName: '',
  searchQuery: '',
  entities: [],
  pageCount: null,
  currentPage: null,
};

const modules = (state = defaultState, action) => {
  switch (action.type) {
    case A.MODULES_FETCH_START:
      return {
        ...state,
        state: 'fetching',
      }
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
    case A.MODULES_UPDATE_FAMILY_FILTER:
      return {
        ...state,
        selectedFamilyName: action.newFamilyName,
      }
    default:
      return {
        ...defaultState,
        ...state,
      };
  }
};

export default modules;
