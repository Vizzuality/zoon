import React from "react"
import * as F from "react-foundation"
import { connect } from "react-redux"

import * as authActions from "../actions/auth"
import Errors from "./Errors"

class Account extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: props.auth.name || "",
      email: props.auth.email || "",
      organization: props.auth.organization || "",
      github_username: props.auth.github_username || "",
    }
  }

  componentWillMount () {
    this.props.authClearMessages()
  }

  onFieldChange (key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  submit = (event) => {
    event.preventDefault()

    this.props.authUpdate(
      this.state,
    )
  }

  isSubmitDisabled () {
    const isUserDataFilled =
      this.state.name &&
      this.state.email &&
      this.state.current_password &&
      this.state.organization &&
      this.state.github_username

    return this.props.auth.pending || !isUserDataFilled
  }

  render () {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <Errors errors={this.props.auth.errors} />

          { this.props.auth.message && <div>
            {this.props.auth.message}
          </div>}
          <form onSubmit={this.submit}>
            <p>
              <input
                name="user[name]" id="user_name"
                value={this.state.name}
                onChange={(ev) => this.onFieldChange("name", ev)}
                type="text"
                placeholder="Name"
              />
            </p>

            <p>
              <input
                name="user[organization]" id="user_organization"
                value={this.state.organization}
                onChange={(ev) => this.onFieldChange("organization", ev)}
                type="text"
                placeholder="Organization"
              />
            </p>

            <p>
              <input
                name="user[github_username]" id="user_github_username"
                value={this.state.github_username}
                onChange={(ev) => this.onFieldChange("github_username", ev)}
                type="text"
                placeholder="GitHub Username"
              />
            </p>

            <p>
              <input
                name="user[email]" id="user_email"
                value={this.state.email}
                onChange={(ev) => this.onFieldChange("email", ev)}
                type="email"
                placeholder="Email"
              />
            </p>

            <p>
              <input
                name="user[password]"
                onChange={(ev) => this.onFieldChange("password", ev)}
                type="password"
                placeholder="New Password"
              />
            </p>

            <hr />

            <p>
              <label htmlFor="user[current_password]">Please input your current password so we can be sure it's really you.</label>
              <input
                name="user[current_password]"
                onChange={(ev) => this.onFieldChange("current_password", ev)}
                type="password"
                placeholder="Current Password"
              />
            </p>

            <p>
              <F.Button
                disabled={this.isSubmitDisabled()}
                name="commit"
                type="submit">
                Update
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
    auth: state.auth,
  }),
  {
    ...authActions,
  })(Account)
