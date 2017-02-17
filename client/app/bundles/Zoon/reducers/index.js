import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import authenticated from './authenticated'
import map from "./map"
import modules from './modules'
import name from './name'

function noOpReducer(state=null, action) {
  return state;
}

export default combineReducers({
  authenticated,
  families: noOpReducer,
  map
  modules,
  name,
  routing,
})
