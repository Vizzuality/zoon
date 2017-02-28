import React from "react"
import * as F from "react-foundation"

export default class Errorable extends React.Component {
  static propTypes = {
    state: React.PropTypes.string.isRequired,
    errorMessage: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.element),
      React.PropTypes.element,
    ]).isRequired,
  }

  render () {
    const s = this.props.state

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
      ok: (
        <span>
          {this.props.children}
        </span>
      ),
    }[s] || `Unknown state: ${s}`
  }
}
