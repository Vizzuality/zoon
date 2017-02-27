import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"

import * as modulesActions from "../actions/modules"
import MapPicker from "./MapPicker"
import ModuleCard from "./ModuleCard"
import Errorable from "./Errorable"

const familyShape = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  image_url: React.PropTypes.string.isRequired,
})

const FamilySwitch = ({
  currentFamilyName,
  targetFamily,
  updateFamilyFilter,
}) => {
  const isCurrent = currentFamilyName === targetFamily.name
  return (
    <a
      className={isCurrent ? "selected" : ""}
      onClick={() => {
        updateFamilyFilter(isCurrent ? "" : targetFamily.name)
      }}>
      <span className={`module-family-${targetFamily.name} module-family-background`} />
      <span rel={targetFamily.name}>{targetFamily.name}</span>
    </a>
  )
}

FamilySwitch.propTypes = {
  currentFamilyName: React.PropTypes.string.isRequired,
  targetFamily: React.PropTypes.object.isRequired,

  updateFamilyFilter: React.PropTypes.func.isRequired,
}

function noDefault (f) {
  return function (e) {
    e.preventDefault()
    e.stopPropagation()
    return f()
  }
}

class Modules extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchQuery: props.searchQuery,
    }
  }

  updateSearchQuery (value) {
    this.setState({
      searchQuery: value,
    })
  }

  onSearch () {
    this.props.updateSearchQuery(this.state.searchQuery)
  }

  onSelect = (granularity, searchTags) => {
    this.props.updateSearchTags(granularity, searchTags)
  }

  componentDidMount () {
    this.props.initModules()
  }

  componentWillUnmount () {
    this.props.clearModules()
  }

  render () {
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
            <MapPicker onSelect={this.onSelect} selectedGeos={this.props.searchTags} granularity={this.props.granularity} />
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
                <div className="mosaic">
                  {this.props.entities.map(m => <ModuleCard key={m.id} m={m} />)}
                </div>
              </F.Column>
            ) }
          </Errorable>
        </F.Row>

      </span>
    )
  };
}

Modules.propTypes = {
  state: React.PropTypes.string.isRequired,
  families: React.PropTypes.arrayOf(familyShape).isRequired,
  updateSearchQuery: React.PropTypes.func.isRequired,
  updateSearchTags: React.PropTypes.func.isRequired,
  updateFamilyFilter: React.PropTypes.func.isRequired,
  granularity: React.PropTypes.string.isRequired,
  initModules: React.PropTypes.func.isRequired,
  clearModules: React.PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    families: state.families.entities,
    ...state.modules,
  }),
  {
    ...modulesActions,
  }
)(Modules)
