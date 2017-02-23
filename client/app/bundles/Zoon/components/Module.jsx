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


const Tags = connect(
  (state, ownProps) => ({
    name: state.tags.name,
    autocomplete: state.tags.autocomplete_names,
  }),
  { ...tagActions }
)(class extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange(ev) {
    this.props.formChange(ev.target.value);
  }

  onAutocompleteSelection(selection) {
    this.props.add(selection);
  }

  onSubmit(ev) {
    ev.preventDefault();

    this.props.add(this.props.name);
  }

  render() {
    return (
      <div className="tags">
        <ul>
          {(this.props.tags || []).map((tag) => (
            <li
                key={`tag-${tag.id}`}
                className="module-family-background-color">
              {tag.name}
              {
                tag.delete_path &&
                <button className="fa fa-times-circle" onClick={() => this.props.delete(tag.delete_path)}></button>
              }
            </li>
          ))}
        </ul>
        {this.props.add &&
          <div className="tag-autocomplete">
            <form onSubmit={this.onSubmit.bind(this)}>
              <input
                type="text"
                onChange={this.onChange.bind(this)}
                placeholder="Add a tag"
                value={this.props.name} />
            </form>
            { this.props.autocomplete &&
              <ul>
                {(this.props.autocomplete || []).map((name) => (
                  <li key={name} onClick={() => this.onAutocompleteSelection(name)}>
                    {name}
                  </li>
                ))}
              </ul>
            }
          </div>
        }
      </div>
    );
  }
});


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
              <a href="https://github.com" target="_blank" className="button">
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
