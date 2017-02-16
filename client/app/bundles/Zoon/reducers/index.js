import { combineReducers } from 'redux'

import name from './name'
import authenticated from './authenticated'
import map from "./map"

export default combineReducers({
  name,
  authenticated,
  map
})
