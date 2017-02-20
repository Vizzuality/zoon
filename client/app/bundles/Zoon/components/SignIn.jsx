import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import Errors from './Errors'


class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  isSubmitDisabled() {
    const isUserDataFilled =
      this.state.email &&
      this.state.password;

    return this.props.state.pending || !isUserDataFilled;
  }

  onFieldChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  submit(event) {
    event.preventDefault();

    this.props.authLogin(
      this.props.state.csrf,
      this.state.email,
      this.state.password,
    );
  }

  render() {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <h2>Log in</h2>

          <Errors errors={this.props.state.errors} />

          <form className="new_user" onSubmit={this.submit.bind(this)}>
            <div className="field">
              <label htmlFor="user_email">Email</label><br />
              <input
                autoFocus="autofocus"
                id="user_email"
                name="user[email]"
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
                value="Log in"
              />
            </div>
          </form>

          <a href="/users/sign_up">Sign up</a><br />
          <a href="/users/password/new">Forgot your password?</a><br />
        </F.Column>
      </F.Row>
    );
  }
}

export default connect(
  (state) => ({
    state: state.auth,
  }),
  {
    ...authActions
  })(SignIn);
