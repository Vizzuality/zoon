import { NAME_UPDATE } from '../action_types';

export default name = (state = '', action) => {
  switch (action.type) {
    case NAME_UPDATE:
      return action.text;
    default:
      return state;
  }
};
