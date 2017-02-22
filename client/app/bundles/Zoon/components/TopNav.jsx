import React, { PropTypes } from 'react';
import * as F from 'react-foundation';
import { Link } from 'react-router'
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';

const TopNav = ({ auth, isHome, isModules, isSignIn, isSignUp, isAccount, authLogout }) => {
  if (auth.id) {
    var items = [
      (<F.MenuItem key={0}><Link onClick={() => authLogout(auth.csrf)}>Log Out</Link></F.MenuItem>),
      (<F.MenuItem key={1} className={isAccount && 'active'}><Link to="/account">My Account</Link></F.MenuItem>),
    ]
  } else {
    var items = [
      (<F.MenuItem key={0} className={isSignIn && 'active'}><Link to="/users/sign_in">Sign In</Link></F.MenuItem>),
      (<F.MenuItem key={1} className={isSignUp && 'active'}><Link to="/users/sign_up">Sign Up</Link></F.MenuItem>),
    ]
  }
  return (
    <F.Row className="topnav">
      <F.Column small={12}>
        <F.TopBar>
          <F.TopBarLeft>
            <F.Menu>
              { !isHome && (
                <F.MenuItem className="home"><Link to="/">Zoon</Link></F.MenuItem>
              )}
              <F.MenuItem className={isModules && 'active'}><Link to="/modules">Modules</Link></F.MenuItem>
              <F.MenuItem><Link to="/workflows">Workflows</Link></F.MenuItem>
              <F.MenuItem><Link to="javascript:void(0)">About</Link></F.MenuItem>
            </F.Menu>
          </F.TopBarLeft>
          <F.TopBarRight>
            <F.Menu>
              { items }
            </F.Menu>
          </F.TopBarRight>
        </F.TopBar>
      </F.Column>
    </F.Row>
  );
};

export default connect(
  (state) => ({
    auth: state.auth,
    isHome: state.routing.locationBeforeTransitions.pathname === "/",
    isModules: state.routing.locationBeforeTransitions.pathname === "/modules",
    isSignIn: state.routing.locationBeforeTransitions.pathname === "/users/sign_in",
    isSignUp: state.routing.locationBeforeTransitions.pathname === "/users/sign_up",
    isAccount: state.routing.locationBeforeTransitions.pathname === "/account",
  }),
  {
    ...authActions,
  })(TopNav);
