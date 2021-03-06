import { combineReducers } from "redux"
import { routerReducer as routing } from "react-router-redux"

import auth from "./auth"
import modules from "./modules"
import tags from "./tags"
import workflows from "./workflows"

function noOpReducer (state = null, action) {
  return state
}

export default combineReducers({
  auth,
  families: noOpReducer,
  modules,
  workflows,
  tags,
  routing,
})
