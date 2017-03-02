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
        <F.Row>
          <F.Column>
          Oops! There seems to be something wrong! <br />
            {this.props.errorMessage}
          </F.Column>
        </F.Row>
      ),
      uninitialized: (
        <F.Row>
          <F.Column>
          Initializing.
          </F.Column>
        </F.Row>
      ),
      fetching: (
        <F.Row>
          <F.Column>
            Fetching info from server.
          </F.Column>
        </F.Row>
      ),
      ok: (
        <span>
          {this.props.children}
        </span>
      ),
    }[s] || `Unknown state: ${s}`
  }
}
