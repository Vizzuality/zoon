import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';


class SignUp extends React.Component {
  onEmailChange(ev) {
    this.setState({ email: ev.target.value });
  }

  onPasswordChange(ev) {
    this.setState({ password: ev.target.value });
  }

  submit(event) {
    event.preventDefault();

    this.props.authSignup(
      this.props.state.csrf,
      this.state.email,
      this.state.password,
    );
  }

  render() {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <h2>Sign up</h2>

          {
            Object.keys(this.props.state.errors || []).map((key) => (
              this.props.state.errors[key].map((error) => (
                <p className="error">{key}: {error}</p>
              ))
            ))
          }

          <form className="new_user" onSubmit={this.submit.bind(this)}>
            <div className="field">
              <label htmlFor="user_email">Email</label><br />
              <input
                autoFocus="autofocus"
                name="user[email]" id="user_email"
                onChange={this.onEmailChange.bind(this)}
                type="email"
              />
            </div>

            <div className="field">
              <label htmlFor="user_password">Password</label><br />
              <input
                autoComplete="off"
                id="user_password"
                name="user[password]"
                onChange={this.onPasswordChange.bind(this)}
                type="password"
              />
            </div>

            <div className="actions">
              <input
                disabled={this.props.state.pending}
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
