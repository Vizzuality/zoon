import { MAP_TYPE_PICK } from '../action_types';

const defaultState = {
  granularity: "continents"
};

const map = (state = defaultState, action) => {
  switch (action.type) {
    case MAP_TYPE_PICK:
      return {
        granularity: action.granularity
      }
    default:
      return state;
  }
};
export default map;

