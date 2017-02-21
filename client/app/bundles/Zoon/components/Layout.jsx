import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

import TopNav from "./TopNav"

const Layout = React.createClass({
  render() {
    return (
      <span>
        <TopNav />

        <p className="notice"></p>
        <p className="alert"></p>

        {this.props.children}

        <div className="footer">
          <p>Contact Us</p>
          <ul className="contacts">
            <li><a href="javascript:void(0)"><i className="fa fa-twitter" /></a></li>
            <li><a href="javascript:void(0)"><i className="fa fa-envelope" /></a></li>
            <li><a href="javascript:void(0)"><i className="fa fa-github" /></a></li>
          </ul>
          <ul className="meta">
            <li><a href="javascript:void(0)">Disclaimer</a></li>
            <li><a href="javascript:void(0)">Feedback</a></li>
          </ul>
        </div>
      </span>
    );
  }
});

export default connect(
  (state) => ({
  }),
  {
  })(Layout);
