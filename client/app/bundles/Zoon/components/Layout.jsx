import React from 'react';
import { connect } from 'react-redux';

import TopNav from "./TopNav"

const Layout = React.createClass({
  render() {
    return (<span>
      <TopNav />

      <p className="notice"></p>
      <p className="alert"></p>

      {this.props.children}
    </span>);
  }
});

export default connect(
  (state) => ({
  }),
  {
  })(Layout);
