import { NAME_UPDATE } from '../action_types';

const name = (state = '', action) => {
  switch (action.type) {
    case NAME_UPDATE:
      return action.text;
    default:
      return state;
  }
};
export default name;
