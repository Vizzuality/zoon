import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { goBack } from 'react-router-redux'
import * as F from 'react-foundation';

import * as modules_actions from '../actions/modules'
import * as tagActions from '../actions/tags'
import Errorable from './Errorable'
import Errors from './Errors'
import Feedback from './Feedback'
import Tags from './Tags'


class Screenshots extends React.Component {
  render() {
    return (
      <div className="screenshots">
        {this.props.upload &&
          <div>
            <label className="file-upload button tiny">
              <i className="fa fa-upload" /> Upload new screenshot
              <input type="file" onChange={(ev) => this.props.upload(ev.target.files[0])} />
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
    );
  }
}

class Module extends React.Component {
  componentDidMount(){
    this.props.initModule(this.props.urlId);
  }

  componentWillUnmount(){
    this.props.clearModule();
  }

  static propTypes = {
    state: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    urlId: PropTypes.string.isRequired,
    entity: PropTypes.object,
    currentUser: PropTypes.object,

    initModule: PropTypes.func.isRequired,
    clearModule: PropTypes.func.isRequired,
    submitFeedback: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }

  render() {
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
              <span/>
            </Errorable>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={7}>
            <div className="module-title">
              <span className="module-family-background" />
              <p>
                {this.props.entity.title}
                <span className="module-family-color">{this.props.entity.name}</span>
              </p>
            </div>

            <h5>Description</h5>
            <p className="faded">{this.props.entity.description || "(no description)"}</p>

            <h5>Details</h5>
            <p className="faded">{this.props.entity.details || "(no details)"}</p>

            <Feedback
              entity={this.props.entity}
              currentUser={this.props.currentUser}
              submitFeedback={this.props.submitFeedback} />
          </F.Column>

          <F.Column small={4} offsetOnSmall={1}>
            <p className="module-github">
              <a href={this.props.entity && this.props.entity.url} target="_blank" className="button">
                <i className="fa fa-github" /> View on GitHub
              </a>
            </p>

            <div className="module-authors module-family-background-color">
              <p>{Math.round((new Date() - new Date(this.props.entity.created_at))/86400/1000)} days ago by</p>
              <p><img src="https://avatars2.githubusercontent.com/u/111554?v=3&s=460" /> Gertrude Tucker</p>
              <p><img src="https://avatars2.githubusercontent.com/u/111554?v=3&s=460" /> Enrique Wilson</p>
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

            <h5>Screeshots</h5>
            <Errors errors={this.props.errors} />

            <Screenshots
              screenshots={this.props.entity.screenshots}
              upload={
                this.props.entity.create_screenshot_path &&
                ((screenshot) => this.props.uploadScreenshot(
                  this.props.entity.create_screenshot_path,
                  screenshot
                ))
              }
              delete={this.props.deleteScreenshot}
            />
          </F.Column>
        </F.Row>
      </div>
    );
  }
};

export default connect(
  (state, ownProps) => {
    return {
      state: state.modules.state,
      errorMessage: state.modules.errorMessage,
      errors: state.modules.errors,
      currentUser: state.auth,

      urlId: ownProps.routeParams.id,
      entity: state.modules.entities[0] || {},
    }
  },
  {
    ...modules_actions,
    goBack,
  }
)(Module);
