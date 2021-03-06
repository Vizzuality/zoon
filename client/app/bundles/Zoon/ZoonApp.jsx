import React from "react"
import { Provider } from "react-redux"
import {
  IndexRoute,
  Route,
  Router,
  applyRouterMiddleware,
  browserHistory,
} from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import useScroll from "react-router-scroll/lib/useScroll"
import axios from "axios"

import configureStore from "./store"
import Layout from "./components/Layout"
import Home from "./components/Home"
import Modules from "./components/Modules"
import ModuleInstructions from "./components/ModuleInstructions"
import Account from "./components/Account"
import ChangePassword from "./components/ChangePassword"
import Module from "./components/Module"
import NotFound from "./components/NotFound"
import RecoverPassword from "./components/RecoverPassword"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import WorkflowCreator from "./components/WorkflowCreator"
import WorkflowEdit from "./components/WorkflowEdit"
import Workflow from "./components/Workflow"
import WorkflowSave from "./components/WorkflowSave"
import Workflows from "./components/Workflows"

axios.defaults.headers.common["Accept"] = "application/json"

const withPeggedProps = (peggedProps) => (WrappedComponent) => (props) => (
  <WrappedComponent {...props} {...peggedProps} />
)

const WorkflowDuplicate = withPeggedProps({stripId: true})(WorkflowEdit)

const ZoonApp = (props, _railsContext) => {
  let store = configureStore(props)
  let history = syncHistoryWithStore(browserHistory, store)

  const scroller = useScroll((prevRouterProps, { location }) => (
    prevRouterProps && location.pathname !== prevRouterProps.location.pathname
  ))

  return <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(scroller)}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="/modules" component={Modules} />
        <Route path="/modules/instructions(/:stepId)" component={ModuleInstructions} />
        <Route path="/modules/:id" component={Module} />
        <Route path="/workflows/new" component={WorkflowCreator} />
        <Route path="/workflows" component={Workflows} />
        <Route path="/workflows/save" component={WorkflowSave} />
        <Route path="/workflows/:id" component={Workflow} />
        <Route path="/workflows/:id/edit" component={WorkflowEdit} />
        <Route path="/workflows/:id/duplicate" component={WorkflowDuplicate} />
        <Route path="/users/sign_in" component={SignIn} />
        <Route path="/users/sign_up" component={SignUp} />
        <Route path="/account" component={Account} />
        <Route path="/recover_password" component={RecoverPassword} />
        <Route path="/users/password/edit" component={ChangePassword} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
}

export default ZoonApp
