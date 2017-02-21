import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { goBack } from 'react-router-redux'
import * as F from 'react-foundation';

import * as modules_actions from '../actions/modules'
import * as tagActions from '../actions/tags'
import Errorable from './Errorable'
import Errors from './Errors'


const SillyModule = ({ entity, currentUser, canRate }) => {
  return (<span>
    <pre>
      {JSON.stringify(entity, null, 2)}
    </pre>
  </span>);
};

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
    this.props.autoCompleteSelect(selection);
  }

  onSubmit() {
    this.props.add(this.props.name);
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.add &&
            <div>
              <p>Add new tag:</p>
              <input type="text" onChange={this.onChange.bind(this)} value={this.props.name} />
              {(this.props.autocomplete || []).map((name) => (
                <strong key={name} onClick={() => this.onAutocompleteSelection(name)}>
                  {name}
                </strong>
              ))}
              <button
                disabled={!this.props.name}
                onClick={this.onSubmit.bind(this)}
              >
                Add
              </button>
            </div>
          }
          {(this.props.tags || []).map((tag) => (
            <li key={`tag-${tag.id}`}>
              {tag.name}
              {
                tag.delete_path &&
                <button onClick={() => this.props.delete(tag.delete_path)}>
                  DELETE ME
                </button>
              }
            </li>
          ))}
        </ul>
      </div>
    );
  }
});


class Screenshots extends React.Component {
  render() {
    return (
      <div>
        {this.props.upload &&
          <div>
            <p>Add new screenshot:</p>
            <input type="file" onChange={(ev) => this.props.upload(ev.target.files[0])} />
          </div>
        }
        <ul>
          {(this.props.screenshots || []).map((screenshot) => (
            <li key={`screenshot-${screenshot.id}`}>
              <img src={screenshot.image.thumbnail.url} />
              {
                screenshot.delete_path &&
                <button onClick={() => this.props.delete(screenshot.delete_path)}>
                  DELETE ME
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

    initModule: PropTypes.func.isRequired,
    clearModule: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }

  render() {
    return (
      <span>
        <F.Row>
          <F.Column className="back-link">
            <Link onClick={this.props.goBack}>&lt; Go back</Link>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column className="content" medium={7}>
            <Errorable
              state={this.props.state}
              errorMessage={this.props.errorMessage}
            >
              <SillyModule entity={this.props.entity}/>
            </Errorable>
          </F.Column>

          <F.Column className="sidebar" medium={4} offsetOnMedium={1}>
            <F.Row className="view-on-github">Yo soy um Github link! Ah ah!</F.Row>
          </F.Column>
        </F.Row>
        <F.Row>
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

          <Tags
            tags={this.props.entity.tags}
            add={
              this.props.entity.create_tag_path &&
              ((tag) => this.props.createTag(
                this.props.entity.create_tag_path,
                tag
              ))
            }
            delete={this.props.deleteTag}
          />
        </F.Row>
      </span>
    );
  }
};

export default connect(
  (state, ownProps) => {
    return {
      state: state.modules.state,
      errorMessage: state.modules.errorMessage,
      errors: state.modules.errors,

      urlId: ownProps.routeParams.id,
      entity: state.modules.entities[0] || {},
    }
  },
  {
    ...modules_actions,
    goBack,
  }
)(Module);
