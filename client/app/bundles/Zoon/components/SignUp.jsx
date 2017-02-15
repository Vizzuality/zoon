import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

const SignUp = ({  }) => (
  <F.Row>
    <F.Column small={12} large={8}>
      <h2>Sign up</h2>

      <form className="new_user" id="new_user" action="/users" acceptCharset="UTF-8" method="post">
        <input name="utf8" type="hidden" value="&#x2713;" />
        <input type="hidden" name="authenticity_token" value="QB9IOvCrK2zSE/6i2FAfqruKFSKEuGfopNNIzYCBvfdD/PSuin1BDUpuZ0SNS25DYTfSjyuVVIB0nZtE/wgQIQ==" />

        <div className="field">
          <label htmlFor="user_email">Email</label><br />
          <input autoFocus="autofocus" type="email" value="" name="user[email]" id="user_email" />
        </div>

        <div className="field">
          <label htmlFor="user_password">Password</label><br />
          <input autoComplete="off" type="password" name="user[password]" id="user_password" />
        </div>

        <div className="field">
          <label htmlFor="user_password_confirmation">Password confirmation</label><br />
          <input autoComplete="off" type="password" name="user[password_confirmation]" id="user_password_confirmation" />
        </div>

        <div className="actions">
          <input type="submit" name="commit" value="Sign up" data-disable-with="Sign up" />
        </div>
      </form>

      <a href="/users/sign_in">Log in</a><br />
    </F.Column>
  </F.Row>
);

export default connect(
  (state) => ({
  }),
  {
  })(SignUp);
