import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { goBack } from 'react-router-redux'
import * as F from 'react-foundation';

import * as modules_actions from '../actions/modules'
import Errorable from './Errorable'


const SillyModule = ({ entity, currentUser, canRate }) => {
  return (<span>
    <pre>
      {JSON.stringify(entity, null, 2)}
    </pre>
  </span>);
}

class Module extends React.Component {
  componentDidMount(){
    this.props.initModule(this.props.urlId);
  }

  componentWillUnmount(){
    this.props.clearModule();
  }

  static propTypes = {
    state: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    urlId: PropTypes.string.isRequired,
    entity: PropTypes.object,

    initModule: PropTypes.func.isRequired,
    clearModule: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }

  render(){
    return (<span>
  <F.Row>
    <F.Column className="back-link">
      <Link onClick={this.props.goBack}>&lt; Go back</Link>
    </F.Column>
  </F.Row>

  <F.Row>
    <F.Column className="content" medium={7}>
      <Errorable
        state={this.props.state}
        errorMessage={this.props.errorMessage}
      >
        <SillyModule entity={this.props.entity}/>
      </Errorable>
    </F.Column>

    <F.Column className="sidebar" medium={4} offsetOnMedium={1}>
      <F.Row className="view-on-github">Yo soy um Github link! Ah ah!</F.Row>
    </F.Column>
  </F.Row>
    </span>);
  };
};

export default connect(
  (state, ownProps) => {
    return {
      state: state.modules.state,
      errorMessage: state.modules.errorMessage,
      urlId: ownProps.routeParams.id,
      entity: state.modules.entities[0],
    }
  },
  {
    ...modules_actions,
    goBack,
  }
)(Module);
