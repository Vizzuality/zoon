import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

const SignIn = ({  }) => (
  <F.Row>
    <F.Column small={12} large={8}>
      <h2>Log in</h2>

      <form className="new_user" id="new_user" action="/users/sign_in" acceptCharset="UTF-8" method="post">
        <input name="utf8" type="hidden" value="&#x2713;" />
        <input type="hidden" name="authenticity_token" value="N1ViYp44WafzWtjjPj4xSR3VM9HVorKLUkmIJrpXlt0A7mja1k0F8g+mfDdTKF90kJsNdhbr8r+iYBA6EzHuZw==" />

        <div className="field">
          <label htmlFor="user_email">Email</label><br />
          <input autoFocus="autofocus" type="email" value="" name="user[email]" id="user_email" />
        </div>

        <div className="field">
          <label htmlFor="user_password">Password</label><br />
          <input autoComplete="off" type="password" name="user[password]" id="user_password" />
        </div>

        <div className="field">
          <input name="user[remember_me]" type="hidden" value="0" /><input type="checkbox" value="1" name="user[remember_me]" id="user_remember_me" />
          <label htmlFor="user_remember_me">Remember me</label>
        </div>

        <div className="actions">
          <input type="submit" name="commit" value="Log in" data-disable-with="Log in" />
        </div>
      </form>

      <a href="/users/sign_up">Sign up</a><br />
      <a href="/users/password/new">Forgot your password?</a><br />
    </F.Column>
  </F.Row>
);

export default connect(
  (state) => ({
  }),
  {
  })(SignIn);
