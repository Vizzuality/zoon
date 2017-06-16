import * as F from "react-foundation"
import { connect } from "react-redux"
import React from "react"

import * as workflowsActions from "../actions/workflows"
import WorkflowDiagram from "./WorkflowDiagram"
import Errors from "./Errors"
import {parseLocationSearch} from "../utils"

class WorkflowSave extends React.Component {
  static propTypes = {
    createWorkflow: React.PropTypes.func.isRequired,
    updateWorkflow: React.PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = parseLocationSearch(props.location.search)
  }

  saveWorkflow = (ev) => {
    ev.preventDefault()

    const {id, title, description, update_path, compositionTypes} = this.state
    const saver = this.state.id ? this.props.updateWorkflow : this.props.createWorkflow

    saver({
      id,
      title,
      description,
      compositionTypes,
      update_path,
      modules: Object
        .values(this.state.modules)
        .reduce((acc, v) => acc.concat(v))
        .map((module) => module.id),
    })
  }

  onFieldChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value,
    })
  }

  render () {
    return (
      <span>
        <F.Row>
          <F.Column small={12}>
            <WorkflowDiagram
              expandedFamilies={{}}
              compositionTypes={{}}
              modules={this.state.modules || {}}
            />
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={6} className="workflow-save">
            <form onSubmit={this.saveWorkflow}>
              <Errors errors={this.props.workflowErrors} />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={this.state.title}
                onChange={this.onFieldChange}
              />
              <div className="description-legend">description</div>
              <textarea
                name="description"
                placeholder="Write a descrition of the workflow..."
                value={this.state.description}
                onChange={this.onFieldChange}
              />
              <input className="button" type="submit" value="Save Workflow" />
            </form>
          </F.Column>
        </F.Row>
      </span>
    )
  }
}

export default connect(
  (state) => ({
    workflowErrors: state.workflows.errors,
  }),
  {
    ...workflowsActions,
  }
)(WorkflowSave)
