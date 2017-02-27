import React from "react"
import * as F from "react-foundation"
import { connect } from "react-redux"

import * as authActions from "../actions/auth"
import Errors from "./Errors"

class SignUp extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  onFieldChange (key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  submit = (event) => {
    event.preventDefault()

    this.props.authSignup(
      this.state,
    )
  }

  isSubmitDisabled () {
    const isUserDataFilled =
      this.state.name &&
      this.state.email &&
      this.state.password &&
      this.state.organization &&
      this.state.github_username

    return this.props.state.pending || !isUserDataFilled
  }

  render () {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <Errors errors={this.props.state.errors} />

          <form onSubmit={this.submit}>
            <p>
              <input
                name="user[name]" id="user_name"
                onChange={(ev) => this.onFieldChange("name", ev)}
                type="text"
                placeholder="Name"
              />
            </p>

            <p>
              <input
                name="user[organization]" id="user_organization"
                onChange={(ev) => this.onFieldChange("organization", ev)}
                type="text"
                placeholder="Organization"
              />
            </p>

            <p>
              <input
                name="user[github_username]" id="user_github_username"
                onChange={(ev) => this.onFieldChange("github_username", ev)}
                type="text"
                placeholder="GitHub Username"
              />
            </p>

            <p>
              <input
                name="user[email]" id="user_email"
                onChange={(ev) => this.onFieldChange("email", ev)}
                type="email"
                placeholder="Email address"
              />
            </p>

            <p>
              <input
                autoComplete="off"
                name="user[password]"
                onChange={(ev) => this.onFieldChange("password", ev)}
                type="password"
                placeholder="Password"
              />
            </p>

            <p>
              <F.Button
                className="button primary"
                disabled={this.isSubmitDisabled()}
                type="submit">
                Sign Up
              </F.Button>
            </p>
          </form>

        </F.Column>
      </F.Row>
    )
  }
};

export default connect(
  (state) => ({
    state: state.auth,
  }),
  {
    ...authActions,
  })(SignUp)
