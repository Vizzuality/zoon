import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as F from 'react-foundation';

import * as modules_actions from '../actions/modules'
import MapPicker from './MapPicker';
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

FamilySwitch.propTypes = {
  currentFamilyName: PropTypes.string.isRequired,
  targetFamily: PropTypes.object.isRequired,

  updateFamilyFilter: PropTypes.func.isRequired,
}

const ModuleMosaic = ({ models }) => {
  return (<F.Row>
    {models.map(m => (
      <F.Column key={m.id} small={12} medium={6} large={4}>
        <Link to={`/modules/${m.id}`}>
          <div className="module-card">
            <span className="module-title">{m.title}</span>
            <span className="module-version  model">{m.version}</span>
            <span className="module-description">{m.description}</span>
          </div>
          <div className={`module-footer ${m.family}`}>
            <span className="module-date">{m.family}</span>
          </div>
        </Link>
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
      <span>
        <F.Row>
          <F.Column className="module-description">
            Filter by module type
          </F.Column>

          {this.props.families.map(f => (
            <FamilySwitch
              key={f.name}
              currentFamilyName={this.props.searchFamily}
              targetFamily={f}
              updateFamilyFilter={this.props.updateFamilyFilter}
            />
          ))}

          <F.Column className="module-search" small={12} medium={4} large={2}>
            <form onSubmit={noDefault(() => (this.onSearch()))}>
              <input
                type="text"
                placeholder="search"
                value={this.state.searchQuery}
                onChange={(e) => this.updateSearchQuery(e.target.value)}
              />
            </form>
          </F.Column>
        </F.Row>

        <MapPicker onSelect={this.onSelect.bind(this)} selectedGeos={this.props.searchTags} granularity={this.props.granularity} />

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
              <ModuleMosaic models={this.props.entities}/>
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
