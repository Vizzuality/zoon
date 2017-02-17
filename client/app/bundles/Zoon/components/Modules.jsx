import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as F from 'react-foundation';
import buildUrl from 'build-url';

import * as modules_actions from '../actions/modules'
import MapPicker from './MapPicker';
import FlowBanner from './FlowBanner'


const familyShape = React.PropTypes.shape({
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
})

const ModuleTypeSwitch = ({
  currentFamilyName,
  targetFamily,
  updateFamilyFilter,
}) => {
  const isCurrent = currentFamilyName === targetFamily.name;
  return (
    <F.Column className={`module-type ${isCurrent?'selected':''}`} small={12} medium={4} large={2}>
      <a onClick={() => {
          updateFamilyFilter(isCurrent ? '' : targetFamily.name)
      }}>
        <img src={targetFamily.image_url} alt={`Module ${targetFamily.name}`} />
        {targetFamily.name}
      </a>
    </F.Column>
  );
}

// TODO ModuleTypeSwitch.propTypes

const ModuleMosaic = ({ models }) => {
  return (<F.Row>
    {models.map(m => (
      <F.Column key={m.id} small={12} medium={6} large={4}>
        <div className="module-card">
          <span className="module-title">{m.title}</span>
          <span className="module-version  model">{m.version}</span>
          <span className="module-description">{m.description}</span>
        </div>
        <div className={`module-footer ${m.family}`}>
          <span className="module-date">{m.family}</span>
        </div>
      </F.Column>
    ))}
  </F.Row>);
};

function noDefault(f) {
  return function(e) {
    e.preventDefault();
    e.stopPropagation();
    return f()
  }
}

class Modules extends React.Component {
  updateMosaic() {
    this.props.fetchModuleList(
      this.props.selectedFamilyName,
      this.props.searchQuery,
    )
  }

  componentDidMount(){
    this.updateMosaic();
  }

  choosePannel() {
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
    } else if (this.props.entities.length === 0) {
      return (
        <F.Column>
          No results. Try another search.
        </F.Column>
      );
    } else {
      return <ModuleMosaic models={this.props.entities}/>;
    }
  }

  render() {
    return (<span>
  <FlowBanner />
  <F.Row>
    <F.Column className="module-description">
      Filter by module type
    </F.Column>
    {this.props.families.map(f => (
      <ModuleTypeSwitch
        key={f.name}
        currentFamilyName={this.props.selectedFamilyName}
        targetFamily={f}
        updateFamilyFilter={this.props.updateFamilyFilter}
      />
    ))}
    <F.Column className="module-search" small={12} medium={4} large={2}>
      <form onSubmit={noDefault(() => (this.updateMosaic()))}>
        <input
          type="text"
          placeholder="search"
          value={this.props.searchQuery}
          onChange={(e) => this.props.updateSearchQuery(e.target.value)}
        />
      </form>
    </F.Column>
  </F.Row>
  <F.Row>
    {this.choosePannel()}
  </F.Row>
  <MapPicker />
    </span>);
  };
}

Modules.propTypes = {
  state: PropTypes.string.isRequired,
  families: PropTypes.arrayOf(familyShape).isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
  updateFamilyFilter: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    families: state.families.entities,
    ...state.modules,
  }),
  {
    ...modules_actions,
  }
)(Modules);
