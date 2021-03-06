import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import { goBack } from "react-router-redux"
import gravatar from "gravatar"
import * as F from "react-foundation"

import * as modulesActions from "../actions/modules"
import Errorable from "./Errorable"
import Errors from "./Errors"
import Feedback from "./Feedback"
import Tags from "./Tags"
import ReactHighmaps from "react-highcharts/ReactHighmaps"
import continentsMap from "../continentsMap"
import continentsData from "../continentsData"
import {rd2html} from "../lib/rd"

const dangerousRd = (rd) => (
  // This opens us up to injection comming from the Modules' docs.
  // See
  // https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml
  <span dangerouslySetInnerHTML={{__html: rd2html(rd)}} />
)

class Screenshots extends React.Component {
  render () {
    return (
      <div className="screenshots">
        {this.props.upload &&
          <div>
            <label className="file-upload button tiny">
              { this.props.uploadProgress ? (
                <F.NativeProgress
                  value={this.props.uploadProgress}
                  max={100}
                />
              ) : (
                <span>
                  <i className="fa fa-upload" />{" "}
                  Upload new screenshot
                  <input
                    type="file"
                    onChange={(e) => this.props.upload(e.target.files[0])}
                  />
                </span>
              ) }
            </label>
          </div>
        }
        <ul>
          {(this.props.screenshots || []).map((screenshot) => (
            <li key={`screenshot-${screenshot.id}`}>
              <img src={screenshot.image.thumbnail.url} />
              {
                screenshot.delete_path &&
                <button
                  className="button tiny expanded"
                  onClick={() => this.props.delete(screenshot.delete_path)}>
                  <i className="fa fa-times-circle" /> Delete
                </button>
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

class Module extends React.Component {
  componentDidMount () {
    this.props.initModule(this.props.urlId)
  }

  componentWillUnmount () {
    this.props.clearModule()
  }

  static propTypes = {
    state: React.PropTypes.string.isRequired,
    errorMessage: React.PropTypes.string,
    urlId: React.PropTypes.string.isRequired,
    entity: React.PropTypes.object,
    currentUser: React.PropTypes.object,

    initModule: React.PropTypes.func.isRequired,
    clearModule: React.PropTypes.func.isRequired,
    submitFeedback: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
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
      <div className={`module module-family-${this.props.entity.family}`}>
        <F.Row>
          <F.Column small={12}>
            <p><Link onClick={this.props.goBack}>&lt; Go back</Link></p>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={12}>
            <Errorable
              state={this.props.state}
              errorMessage={this.props.errorMessage}>
              <span />
            </Errorable>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={7}>
            <div className="module-title">
              <span className="module-family-background" />
              <p>
                {this.props.entity.name}
                <span className="module-family-color">{this.props.entity.title}</span>
              </p>
            </div>

            { this.props.entity.title &&
            <span>
              <h5>Title</h5>
              <p className="faded">{dangerousRd(this.props.entity.title)}</p>
            </span>
            }

            { this.props.entity.parameters && this.props.entity.parameters.length &&
            <span>
              <h5>Parameters</h5>
              {this.props.entity.parameters.map((p) => (
                <span key={p.name}>
                  <h6>{p.name}</h6>
                  <p className="faded">{dangerousRd(p.description)}</p>
                </span>
              ))}
            </span>
            }

            { this.props.entity.description &&
            <span>
              <h5>Description</h5>
              <p className="faded">{dangerousRd(this.props.entity.description)}</p>
            </span>
            }

            { this.props.entity.details &&
            <span>
              <h5>Details</h5>
              <p className="faded">{dangerousRd(this.props.entity.details)}</p>
            </span>
            }

            <Feedback
              entity={this.props.entity}
              currentUser={this.props.currentUser}
              submitFeedback={this.props.submitFeedback}
            />
          </F.Column>

          <F.Column small={4} offsetOnSmall={1}>
            <p className="module-github">
              <a href={this.props.entity && this.props.entity.url} target="_blank" className="button">
                <i className="fa fa-github" /> View on GitHub
              </a>
            </p>

            <div className="module-authors module-family-background-color">
              <p>{Math.round((new Date() - new Date(this.props.entity.date_submitted)) / 86400 / 1000)} days ago by</p>
              {this.props.entity.authors && this.props.entity.authors.map((a, i) => (
                <p key={i}><img src={gravatar.url(a.email, {s: "50"})} />{a.authorName}</p>
              ))}
            </div>

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
              <div className={`module-map module-family-${this.props.entity.family}`}>
                <h5>Coverage</h5>
                <ReactHighmaps isPureConfig config={this.mapConfig} />
              </div>
            }

            <h5>Screenshots</h5>
            <Errors errors={this.props.errors} />

            <Screenshots
              screenshots={this.props.entity.screenshots}
              uploadProgress={this.props.uploadProgress}
              upload={
                this.props.entity.create_screenshot_path &&
                ((screenshot) => screenshot && this.props.uploadScreenshot(
                  this.props.entity.create_screenshot_path,
                  screenshot,
                ))
              }
              delete={this.props.deleteScreenshot}
            />
          </F.Column>
        </F.Row>
      </div>
    )
  }
};

export default connect(
  (state, ownProps) => {
    return {
      state: state.modules.state,
      errorMessage: state.modules.errorMessage,
      errors: state.modules.errors,
      currentUser: state.auth,
      uploadProgress: state.modules.screenshotUploadProgress,

      urlId: ownProps.routeParams.id,
      entity: state.modules.entities[0] || {},
    }
  },
  {
    ...modulesActions,
    goBack,
  }
)(Module)
