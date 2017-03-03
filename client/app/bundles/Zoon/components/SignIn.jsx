import React from "react"
import * as F from "react-foundation"
import { Link } from "react-router"
import { connect } from "react-redux"

import * as authActions from "../actions/auth"
import Errors from "./Errors"

class SignIn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWillMount () {
    this.props.authClearMessages()
  }

  isSubmitDisabled () {
    const isUserDataFilled =
      this.state.email &&
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

    this.props.authLogin(
      this.state.email,
      this.state.password,
    )
  }

  render () {
    return (
      <F.Row>
        <F.Column small={12} large={8}>
          <Errors errors={this.props.state.errors} />

          <form onSubmit={this.submit}>
            <p>
              <input
                name="user[email]"
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
                Sign In
              </F.Button>
            </p>
          </form>

          <p><Link to="/recover_password">Forgot your password?</Link></p>
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
  })(SignIn)
