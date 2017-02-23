import * as A from '../action_types';
import { LOCATION_CHANGE } from 'react-router-redux'


const defaultState = {
  name: '',
};

const tags = (state = defaultState, action) => {
  switch (action.type) {
    case A.TAG_FORM_CHANGE:
      return {
        ...state,
        name: action.name,
      }

    case A.TAG_AUTOCOMPLETE_SELECT:
      return {
        ...state,
        name: action.name,
        autocomplete_names: [],
      }

    case A.WORKFLOW_CREATE_TAG:
    case A.MODULES_CREATE_TAG:
      return {
        ...state,
        name: "",
        autocomplete_names: [],
      }

    case A.TAG_AUTOCOMPLETE:
      if (action.name === state.name) {
      return {
        ...state,
        autocomplete_names: action.names,
      }
      } else {
        return { ...state, }
      }

    default:
      return {
        ...defaultState,
        ...state,
      };
  }
};

export default tags;
