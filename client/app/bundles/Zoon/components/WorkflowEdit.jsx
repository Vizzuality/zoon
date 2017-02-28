import React from "react"
import { connect } from "react-redux"

import Errorable from "./Errorable"
import WorkflowCreator from "./WorkflowCreator"
import * as workflowActions from "../actions/workflows"

class WorkflowEdit extends React.Component {
  static propTypes = {
    state: React.PropTypes.string.isRequired,
    errorMessage: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    entity: React.PropTypes.object,

    initWorkflow: React.PropTypes.func.isRequired,
  }

  componentWillMount () {
    this.props.initWorkflow(this.props.id)
  }

  render () {
    const {
      state,
      errorMessage,
      workflow,
    } = this.props

    return <Errorable {...{state, errorMessage}}>
      <WorkflowCreator workflow={workflow} />
    </Errorable>
  }
}

export default connect(
  (state, ownProps) => {
    return {
      id: ownProps.routeParams.id,
      state: state.workflows.state,
      errorMessage: state.workflows.errorMessage,
      workflow: state.workflows.entities[0] || {},
    }
  },
  {
    ...workflowActions,
  }
)(WorkflowEdit)
