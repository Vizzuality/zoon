import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import auth from './auth'
import map from "./map"
import modules from './modules'

function noOpReducer(state=null, action) {
  return state;
}

export default combineReducers({
  auth,
  families: noOpReducer,
  map,
  modules,
  routing,
})
