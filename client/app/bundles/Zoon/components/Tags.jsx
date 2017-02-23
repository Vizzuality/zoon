import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as tagActions from '../actions/tags'


export default connect(
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
