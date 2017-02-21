import React, { PropTypes } from 'react';

export default ({children}) => (
  <div className="code">
    <div className="code__content">{children}</div>
    <div className="code__copy"><i className="fa fa-clone"></i></div>
  </div>
);
