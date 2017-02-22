import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as F from 'react-foundation';

import * as modules_actions from '../actions/modules'
import MapPicker from './MapPicker';
import ModuleMosaic from './ModuleMosaic';
import Errorable from './Errorable'


const familyShape = React.PropTypes.shape({
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
})

const FamilySwitch = ({
  currentFamilyName,
  targetFamily,
  updateFamilyFilter,
}) => {
  const isCurrent = currentFamilyName === targetFamily.name;
  return (
    <a
        className={isCurrent?'selected':''}
        onClick={() => {
          updateFamilyFilter(isCurrent ? '' : targetFamily.name)
        }}>
      <span className={targetFamily.name}></span>
      <span rel={targetFamily.name}>{targetFamily.name}</span>
    </a>
    

  );
}

FamilySwitch.propTypes = {
  currentFamilyName: PropTypes.string.isRequired,
  targetFamily: PropTypes.object.isRequired,

  updateFamilyFilter: PropTypes.func.isRequired,
}

function noDefault(f) {
  return function(e) {
    e.preventDefault();
    e.stopPropagation();
    return f()
  }
}

class Modules extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: props.searchQuery,
    };
  }

  updateSearchQuery(value) {
    this.setState({
      searchQuery: value,
    });
  }

  onSearch() {
    this.props.updateSearchQuery(this.state.searchQuery)
  }

  onSelect(granularity, searchTags) {
    this.props.updateSearchTags(granularity, searchTags);
  }

  componentDidMount(){
    this.props.initModules();
  }

  componentWillUnmount(){
    this.props.clearModules();
  }

  render() {
    return (
      <span className="modules">
        <F.Row>
          <F.Column small={12} large={8}>
            <p>Modelling isn’t always easy, but it could be easier. ZOON reduces the time and effort it takes to find data, create species distribution models, and share them with the world.</p>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={12}>
            <div className="mixed-filter-row">
              <div className="family-filter">
                <h4>Filter by module type</h4>
                <ul className="family-filter__families">
                  {this.props.families.map(f => (
                    <li key={f.name}>
                      <FamilySwitch
                        currentFamilyName={this.props.searchFamily}
                        targetFamily={f}
                        updateFamilyFilter={this.props.updateFamilyFilter}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="filter-toggle">
                <li><F.Button><i className="fa fa-map" /></F.Button></li>
                <li><F.Button><i className="fa fa-search" /></F.Button></li>
              </ul>
            </div>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={12}>
            <h4>Filter by text</h4>
            <form onSubmit={noDefault(() => (this.onSearch()))}>
              <input
                type="text"
                placeholder="Search term will match module name, description, and tags"
                value={this.state.searchQuery}
                onChange={(e) => this.updateSearchQuery(e.target.value)}
              />
            </form>
          </F.Column>
        </F.Row>

        <F.Row>
          <F.Column small={12}>
            <MapPicker onSelect={this.onSelect.bind(this)} selectedGeos={this.props.searchTags} granularity={this.props.granularity} />
          </F.Column>
        </F.Row>

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
                <ModuleMosaic models={this.props.entities}/>
              </F.Column>
            ) }
          </Errorable>
        </F.Row>

      </span>
    );
  };
}

Modules.propTypes = {
  state: PropTypes.string.isRequired,
  families: PropTypes.arrayOf(familyShape).isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
  updateSearchTags: PropTypes.func.isRequired,
  updateFamilyFilter: PropTypes.func.isRequired,
  granularity: PropTypes.string.isRequired,
  initModules: PropTypes.func.isRequired,
  clearModules: PropTypes.func.isRequired,
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
