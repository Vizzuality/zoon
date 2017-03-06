import React from "react"
import * as F from "react-foundation"
import { Link } from "react-router"
import { connect } from "react-redux"

import { authLogout } from "../actions/auth"

const TopNav = ({
  isLoggedIn,
  isHome,
  isModules,
  isSignIn,
  isSignUp,
  isAccount,
  authLogout,
}) => {
  let items = isLoggedIn ? [
    (<F.MenuItem key={0}><Link onClick={authLogout}>Log Out</Link></F.MenuItem>),
    (<F.MenuItem key={1} className={isAccount && "active"}><Link to="/account">My Account</Link></F.MenuItem>),
  ] : [
    (<F.MenuItem key={0} className={isSignIn && "active"}><Link to="/users/sign_in">Sign In</Link></F.MenuItem>),
    (<F.MenuItem key={1} className={isSignUp && "active"}><Link to="/users/sign_up">Sign Up</Link></F.MenuItem>),
  ]

  return (
    <F.Row className="topnav">
      <F.Column small={12}>
        <F.TopBar>
          <F.TopBarLeft>
            <F.Menu>
              { !isHome && (
                <F.MenuItem className="home"><Link to="/">Zoon</Link></F.MenuItem>
              )}
              <F.MenuItem className={isModules && "active"}><Link to="/modules">Modules</Link></F.MenuItem>
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
  )
}

export default connect(
  (state) => {
    const l = state.routing.locationBeforeTransitions
    return {
      isLoggedIn: !!state.auth.id,
      isHome: l.pathname === "/",
      isModules: l.pathname === "/modules",
      isSignIn: l.pathname === "/users/sign_in",
      isSignUp: l.pathname === "/users/sign_up",
      isAccount: l.pathname === "/account",
    }
  },
  {
    authLogout,
  },
)(TopNav)
