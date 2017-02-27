import React from "react"
import * as F from "react-foundation"

export default class Errorable extends React.Component {
  static propTypes = {
    state: React.PropTypes.string.isRequired,
    errorMessage: React.PropTypes.string,
  }

  render () {
    return {
      error: (
        <F.Column>
        Oops! There seems to be something wrong! <br />
          {this.props.errorMessage}
        </F.Column>
      ),
      uninitialized: (
        <F.Column>
        Initializing.
        </F.Column>
      ),
      fetching: (
        <F.Column>
          Fetching info from server.
        </F.Column>
      ),
    }[this.props.state] || this.props.children
  }
}
