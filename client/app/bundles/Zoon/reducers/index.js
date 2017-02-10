import { combineReducers } from 'redux'

import name from './name'
import authenticated from './authenticated'

export default combineReducers({
  name,
  authenticated,
})
