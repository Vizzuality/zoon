import React from "react"

export default ({children}) => (
  <div className="code">
    <div className="code__content">{children}</div>
    <div className="code__copy"><i className="fa fa-clone" /></div>
  </div>
)
