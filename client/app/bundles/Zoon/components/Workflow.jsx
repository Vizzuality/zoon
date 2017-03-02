import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import { goBack } from "react-router-redux"
import * as F from "react-foundation"
import qs from "qs"

import * as workflowActions from "../actions/workflows"
import Errorable from "./Errorable"
import Errors from "./Errors"
import Feedback from "./Feedback"
import Tags from "./Tags"
import Code from "./Code"
import ModuleCard from "./ModuleCard"
import WorkflowDiagram from "./WorkflowDiagram"
import {objectFromPairs} from "../utils"

const encodeWorkflowQuerystring = (workflow) => {
  if (!workflow.id) { return "" }

  const {title, description, modules, composition_types} = workflow
  return qs.stringify({
    title,
    description,
    modules: objectFromPairs(Object.entries(modules).map(
      ([f, ms]) => [
        f,
        ms.map(m => {
          if (!m.visible) { return null }

          return {
            id: m.id,
            name: m.name,
            title: m.title,
            family: m.family,
          }
        }).filter(e => !!e),
      ],
    )),
    composition_types,
  })
}

class Workflow extends React.Component {
  componentDidMount () {
    this.props.initWorkflow(this.props.urlId)
  }

  user () {
    return this.props.entity && this.props.entity.user || {}
  }

  render () {
    return (
      <div className="module">
        <F.Row className="module-family-workflow">
          <F.Column small={12}>
            <p><Link onClick={this.props.goBack}>&lt; Go back</Link></p>
          </F.Column>
        </F.Row>

        <F.Row className="module-family-workflow">
          <F.Column small={12}>
            <Errorable
              state={this.props.state}
              errorMessage={this.props.errorMessage}>
              <span />
            </Errorable>
          </F.Column>
        </F.Row>

        <F.Row className="module-family-workflow">
          <F.Column small={7}>
            <div className="module-title">
              <p>
                {this.props.entity.title}
                <span className="module-family-color">{this.props.entity.name}</span>
              </p>
            </div>
          </F.Column>

          <F.Column small={4} offsetOnSmall={1}>
            <p className="module-duplicate">
              <Link to={`/workflows/new?${encodeWorkflowQuerystring(this.props.entity)}`} className="button">
                Duplicate this workflow
              </Link>
            </p>
          </F.Column>
        </F.Row>

        <F.Row>
          <WorkflowDiagram
            expandedFamilies={{}}
            compositionTypes={this.props.entity.compositionTypes || {}}
            modules={this.props.entity.modules || {}}
          />
        </F.Row>

        <F.Row className="module-family-workflow">
          <F.Column small={7}>
            <h5>Description</h5>
            <p className="faded">{this.props.entity.description || "(no description)"}</p>

            <h5>Usage</h5>
            <p className="faded">
              Copy these lines into your R console
            </p>

            <Code>{this.props.entity.code}</Code>

            <Feedback
              entity={this.props.entity}
              currentUser={this.props.currentUser}
              submitFeedback={this.props.submitFeedback} />
          </F.Column>

          <F.Column small={4} offsetOnSmall={1}>
            <div className="module-authors module-family-background-color">
              <p>{Math.round((new Date() - new Date(this.props.entity.created_at)) / 86400 / 1000)} days ago by</p>
              <p><img src={this.user().avatar_url} /> {this.user().name} </p>
            </div>
            { this.props.entity && this.props.entity.update_path && (
              <p className="module-duplicate">
                <Link to={`/workflows/${this.props.entity.id}/edit`} className="button">
                  Edit this workflow
                </Link>
              </p>
            )}

            <div className="module-tags">
              <Tags
                tags={this.props.entity.tags}
                add={
                  this.props.entity.create_tag_path &&
                  ((tag) => this.props.createTag(
                    this.props.entity.create_tag_path,
                    tag
                  ))
                }
                delete={this.props.deleteTag} />
            </div>

            <Errors errors={this.props.errors} />
          </F.Column>
        </F.Row>

        <F.Row>
          <h2>Modules used in this workflow</h2>

          <div className="mosaic">
            {[].concat.apply([], Object.values(this.props.entity.modules || {})).map(m => <ModuleCard
              key={m.id}
              m={m}
            />)}
          </div>
        </F.Row>
      </div>
    )
  }
};

export default connect(
  (state, ownProps) => {
    return {
      state: state.workflows.state,
      errorMessage: state.workflows.errorMessage,
      errors: state.workflows.errors,
      currentUser: state.auth,

      urlId: ownProps.routeParams.id,
      entity: state.workflows.entities[0] || {},
    }
  },
  {
    ...workflowActions,
    goBack,
  }
)(Workflow)
