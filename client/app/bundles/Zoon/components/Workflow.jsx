import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import { goBack } from "react-router-redux"
import * as F from "react-foundation"

import * as workflowActions from "../actions/workflows"
import Errorable from "./Errorable"
import Errors from "./Errors"
import Feedback from "./Feedback"
import Tags from "./Tags"
import Code from "./Code"
import ModuleCard from "./ModuleCard"
import WorkflowDiagram from "./WorkflowDiagram"
import {encodeWorkflowQuerystring} from "../lib/workflow"
import ReactHighmaps from "react-highcharts/ReactHighmaps"
import continentsMap from "../continentsMap"
import continentsData from "../continentsData"

const sansId = (w) => ({...w, id: undefined})

class Workflow extends React.Component {
  componentDidMount () {
    this.props.initWorkflow(this.props.urlId)
  }

  user () {
    return this.props.entity && this.props.entity.user || {}
  }

  render () {
    this.mapConfig = this.props.entity.id && {
      title: null,
      chart: {
        backgroundColor: "transparent",
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
      },
      series: [{
        data: continentsData.map((elem) => (
          {
            ...elem,
            selected: this.props.entity.tags.map((tag) => { return tag.name }).includes(elem.value.toLowerCase()),
          }
        )),
        mapData: continentsMap,
      }],
      plotOptions: {
        series: {
          color: "#BBBBBB",
          states: {
            normal: {
              animation: false,
            },
            hover: {
              enabled: false,
            },
            select: {
              color: "#000000",
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
    }

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
              <Link
                to={this.props.entity.id ? `/workflows/new?${encodeWorkflowQuerystring(sansId(this.props.entity))}` : "#"}
                className="button"
              >
                Duplicate this workflow
              </Link>
            </p>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={12}>
            <WorkflowDiagram
              expandedFamilies={{}}
              compositionTypes={this.props.entity.compositionTypes || {}}
              modules={this.props.entity.modules || {}}
            />
          </F.Column>
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
              submitFeedback={this.props.submitFeedback}
            />
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

            { this.mapConfig &&
              <div className="module-map">
                <h5>Coverage</h5>
                <ReactHighmaps isPureConfig config={this.mapConfig} />
              </div>
            }

            <Errors errors={this.props.errors} />
          </F.Column>
        </F.Row>

        <div className="modules-used">
          <F.Row>
            <p className="modules-used__title">Modules used in this workflow</p>

            <div className="mosaic">
              {[].concat.apply([], Object.values(this.props.entity.modules || {})).map(m => <ModuleCard
                key={m.id}
                m={m}
              />)}
            </div>
          </F.Row>
        </div>
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
