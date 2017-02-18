import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { goBack } from 'react-router-redux'
import * as F from 'react-foundation';

import * as modules_actions from '../actions/modules'

class Module extends React.Component {
  componentDidMount(){
    this.props.initModule(this.props.urlId);
  }

  componentWillUnmount(){
    this.props.clearModule();
  }
  choosePanel() {
    if (this.props.state === 'error') {
      return (
        <F.Column>
          Oops! There seems to be something wrong! <br/>
          {this.props.errorMessage}
        </F.Column>
      );
    } else if (this.props.state === 'uninitialized') {
      return (
        <F.Column>
          Initializing.
        </F.Column>
      );
    } else if (this.props.state === 'fetching') {
      return (
        <F.Column>
          Fetching info from server.
        </F.Column>
      );
    } else {
      return JSON.stringify(this.props.entity, null, 2)
    }
  }

  render(r){
    return (<span>
  <F.Row>
    <F.Column className="back-link">
      <Link onClick={this.props.goBack}>&lt; Go back</Link>
    </F.Column>
  </F.Row>

  <F.Row>
    <F.Column className="content" medium={7}>
      <pre>
      {this.choosePanel()}
      </pre>
    </F.Column>

    <F.Column className="sidebar" medium={4} offsetOnMedium={1}>
      <F.Row className="view-on-github">Yo soy um Github link! Ah ah!</F.Row>
    </F.Column>
  </F.Row>
    </span>);
  };
};

Module.propTypes = {
  state: PropTypes.string.isRequired,
  urlId: PropTypes.string.isRequired,
  entity: PropTypes.object,

  initModule: PropTypes.func.isRequired,
  clearModule: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
}

export default connect(
  (state, ownProps) => {
    return {
      state: state.modules.state,
      urlId: ownProps.routeParams.id,
      entity: state.modules.entities[0],
    }
  },
  {
    ...modules_actions,
    goBack,
  }
)(Module);
