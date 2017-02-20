import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import Errors from './Errors'


class SignUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  onFieldChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  submit(event) {
    event.preventDefault();

    this.props.authSignup(
      this.props.state.csrf,
      this.state,
    );
  }

  isSubmitDisabled() {
    const isUserDataFilled =
      this.state.name &&
      this.state.email &&
      this.state.password &&
      this.state.organization &&
      this.state.github_username;

    return this.props.state.pending || !isUserDataFilled;
  }

  render() {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <h2>Sign up</h2>

          <Errors errors={this.props.state.errors} />

          <form className="new_user" onSubmit={this.submit.bind(this)}>
            <div className="field">
              <label htmlFor="user_name">Name</label><br />
              <input
                autoFocus="autofocus"
                name="user[name]" id="user_name"
                onChange={(ev) => this.onFieldChange("name", ev)}
                type="text"
              />
            </div>

            <div className="field">
              <label htmlFor="user_organization">Organization</label><br />
              <input
                autoFocus="autofocus"
                name="user[organization]" id="user_organization"
                onChange={(ev) => this.onFieldChange("organization", ev)}
                type="text"
              />
            </div>

            <div className="field">
              <label htmlFor="user_github_username">GitHub username</label><br />
              <input
                autoFocus="autofocus"
                name="user[github_username]" id="user_github_username"
                onChange={(ev) => this.onFieldChange("github_username", ev)}
                type="text"
              />
            </div>

            <div className="field">
              <label htmlFor="user_email">Email</label><br />
              <input
                autoFocus="autofocus"
                name="user[email]" id="user_email"
                onChange={(ev) => this.onFieldChange("email", ev)}
                type="email"
              />
            </div>

            <div className="field">
              <label htmlFor="user_password">Password</label><br />
              <input
                autoComplete="off"
                id="user_password"
                name="user[password]"
                onChange={(ev) => this.onFieldChange("password", ev)}
                type="password"
              />
            </div>

            <div className="actions">
              <input
                disabled={this.isSubmitDisabled()}
                name="commit"
                type="submit"
                value="Sign up"
              />
            </div>
          </form>

          <a href="/users/sign_in">Log in</a><br />
        </F.Column>
      </F.Row>
    );
  }
};

export default connect(
  (state) => ({
    state: state.auth,
  }),
  {
    ...authActions
  })(SignUp);
