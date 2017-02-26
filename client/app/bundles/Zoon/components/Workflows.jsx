import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as F from 'react-foundation';

import * as workflowActions from '../actions/workflows'
import Errorable from './Errorable'
import WorkflowCard from './WorkflowCard';


class Workflows extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.initWorkflows();
  }

  render() {
    return (
      <span className="workflows">
        <F.Row>
          <Errorable
            state={this.props.state}
            errorMessage={this.props.errorMessage}
          >
            { this.props.entities.length === 0 ? (
                <F.Column>
                  No results. Try another search.
                </F.Column>
            ) : (
              <F.Column small={12}>
                <div className="mosaic">
                  {this.props.entities.map(w => <WorkflowCard key={w.id} w={w} />)}
                </div>
              </F.Column>
            ) }
          </Errorable>
        </F.Row>

      </span>
    );
  };
}

Workflows.propTypes = {
  state: PropTypes.string.isRequired,
  initWorkflows: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    ...state.workflows,
  }),
  {
    ...workflowActions,
  }
)(Workflows);
