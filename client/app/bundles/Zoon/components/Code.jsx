import React from "react"
import copy from "copy-to-clipboard"

class Code extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showingTooltip: false,
    }
  }

  onClick = () => {
    this.timeoutId && clearTimeout(this.timeoutId)

    copy(this.props.children)

    this.setState({showingTooltip: true})
    this.timeoutId = setTimeout(
      () => {
        this.setState({showingTooltip: false})
        this.timeoutId = null
      },
      2000,
    )
  }

  render () {
    return <div className="code">
      <div className="code__content">
        {this.props.children}
      </div>
      <div className="code__copy tooltip-context">
        <i className="fa fa-clone" onClick={this.onClick} />
        <div className={`tooltip ${this.state.showingTooltip && "on" || ""}`}>
          Copied!
        </div>
      </div>
    </div>
  }
}

export default Code
