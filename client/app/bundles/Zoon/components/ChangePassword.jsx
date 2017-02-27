import React from "react"
import * as F from "react-foundation"
import { connect } from "react-redux"

import * as authActions from "../actions/auth"
import Errors from "./Errors"

class ChangePassword extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  isSubmitDisabled () {
    const isUserDataFilled =
      this.state.password

    return this.props.state.pending || !isUserDataFilled
  }

  onFieldChange (key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  submit = (event) => {
    event.preventDefault()

    this.props.authChangePassword(
      this.state.password,
    )
  }

  render () {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <h3>Recover Password</h3>

          <Errors errors={this.props.state.errors} />

          <form onSubmit={this.submit}>
            <p>
              <input
                name="user[password]"
                onChange={(ev) => this.onFieldChange("password", ev)}
                type="password"
                placeholder="New Password"
              />
            </p>

            <p>
              <F.Button
                className="button primary"
                disabled={this.isSubmitDisabled()}
                type="submit">
                Recover password
              </F.Button>
            </p>
          </form>
        </F.Column>
      </F.Row>
    )
  }
}

export default connect(
  (state) => ({
    state: state.auth,
  }),
  {
    ...authActions,
  })(ChangePassword)
