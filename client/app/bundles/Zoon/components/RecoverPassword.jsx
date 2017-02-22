import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import Errors from './Errors'


class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount(){
    this.props.authClearMessages();
  }

  componentWillUnmount(){
    this.props.authClearMessages();
  }

  isSubmitDisabled() {
    const isUserDataFilled =
      this.state.email;

    return this.props.state.pending || !isUserDataFilled;
  }

  onFieldChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  submit(event) {
    event.preventDefault();

    this.props.authRecover(
      this.state.email,
    );
  }

  render() {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <h3>Recover Password</h3>

          <Errors errors={this.props.state.errors} />
          { this.props.state.message }

          <form onSubmit={this.submit.bind(this)}>
            <p>
              <input
                name="user[email]"
                onChange={(ev) => this.onFieldChange("email", ev)}
                type="email"
                placeholder="Email address"
              />
            </p>

            <p>
              <F.Button
                  className="button primary"
                  disabled={this.isSubmitDisabled()}
                  type="submit">
                Recover Password
              </F.Button>
            </p>
          </form>
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
  })(RecoverPassword);
