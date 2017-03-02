import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"
import buildUrl from "build-url"
import { push } from "react-router-redux"

import * as modulesActions from "../actions/modules"
import MapPicker from "./MapPicker"
import ModuleCard from "./ModuleCard"
import Errorable from "./Errorable"

function filterAbsentValues (obj) {
  let result = {}
  for (var k in obj) {
    const v = obj[k]
    if (v === null || v === undefined) {
      continue
    }

    result[k] = v
  }
  return result
}

function filterEmptyValues (obj) {
  let result = {}
  for (var k in obj) {
    const v = obj[k]
    if (
      v === null ||
      v === undefined ||
      v === "" ||
      (Array.isArray(v) && v.length === 0)
    ) {
      continue
    }

    result[k] = v
  }
  return result
}

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
        updateFamilyFilter(isCurrent ? null : targetFamily.name)
      }}>
      <span className={`module-family-${targetFamily.name} module-family-background`} />
      <span rel={targetFamily.name}>{targetFamily.name}</span>
    </a>
  )
}

FamilySwitch.propTypes = {
  currentFamilyName: React.PropTypes.string,
  targetFamily: React.PropTypes.object.isRequired,

  updateFamilyFilter: React.PropTypes.func.isRequired,
}

function extractQueryParams (src) {
  let {searchFamily, searchQuery, granularity, searchTags} = src

  if (typeof searchTags === "string" || searchTags instanceof String) {
    searchTags = searchTags.split(",")
  }

  return {searchFamily, searchQuery, granularity, searchTags}
}

function serializeQueryData (src) {
  // Not just params, but the actual data that'll influence the results
  // returned from the server.
  let {searchFamily, searchQuery, searchTags} = src
  return JSON.stringify(
    filterEmptyValues({searchFamily, searchQuery, searchTags}),
  )
}

class Modules extends React.Component {
  static propTypes = {
    state: React.PropTypes.string.isRequired,
    families: React.PropTypes.arrayOf(familyShape).isRequired,
    searchFamily: React.PropTypes.string,
    searchQuery: React.PropTypes.string,
    granularity: React.PropTypes.string,
    searchTags: React.PropTypes.string,

    modulesFetchList: React.PropTypes.func.isRequired,
    clearModules: React.PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      ...extractQueryParams(this.props.router.location.query),
      ...filterAbsentValues(extractQueryParams(this.props)),
    }
  }

  componentDidMount () {
    this.props.modulesFetchList(this.state)
  }

  componentWillReceiveProps (nextProps) {
    const qp = extractQueryParams(nextProps.router.location.query)
    if (JSON.stringify(qp) !== JSON.stringify(this.state)) {
      this.setState(qp)

      if (serializeQueryData(qp) !== serializeQueryData(this.state)) {
        // Introducing or removing keys isn't relevant it they're empty.
        // Demand a change in value to fire a request.
        this.props.modulesFetchList(qp)
      }
    }
  }

  componentWillUnmount () {
    this.props.clearModules()
  }

  commitState (extras = {}) {
    const {searchFamily, searchQuery, granularity, searchTags} = {
      ...this.state,
      ...extras,
    }

    this.props.push(buildUrl(
      "/modules",
      {
        queryParams: filterAbsentValues({
          searchFamily,
          searchQuery,
          granularity,
          searchTags,
        }),
      },
    ))
  }

  updateFamilyFilter = (value) => {
    this.commitState({searchFamily: value})
  }

  onSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.commitState({
      searchQuery: this.searchQueryInput.value,
    })
  }

  updateGeo = (granularity, searchTags) => {
    this.commitState({granularity, searchTags})
  }

  toggleGranularity = () => {
    if (this.state.granularity === undefined) {
      this.commitState({
        granularity: "continents",
      })
    } else {
      this.commitState({
        granularity: undefined,
      })
    }
  }

  toggleSearchQuery = () => {
    if (this.state.searchQuery === undefined) {
      this.commitState({
        searchQuery: "",
      })
    } else {
      this.commitState({
        searchQuery: undefined,
      })
    }
  }

  render () {
    const hasGeo = !!this.state.granularity
    const hasQuery = this.state.searchQuery !== undefined

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
                        currentFamilyName={this.state.searchFamily}
                        targetFamily={f}
                        updateFamilyFilter={this.updateFamilyFilter}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="filter-toggle">
                <li><F.Button
                  isHollow={!hasGeo}
                  onClick={this.toggleGranularity}
                ><i className="fa fa-map" /></F.Button></li>
                <li><F.Button
                  isHollow={!hasQuery}
                  onClick={this.toggleSearchQuery}
                ><i className="fa fa-search" /></F.Button></li>
              </ul>
            </div>
          </F.Column>
        </F.Row>

        { hasQuery && <F.Row>
          <F.Column small={12}>
            <h4>Filter by text</h4>
            <form onSubmit={this.onSearch}>
              <input
                type="text"
                placeholder="Search term will match module name, description, and tags"
                defaultValue={this.state.searchQuery}
                ref={input => { this.searchQueryInput = input }}
              />
            </form>
          </F.Column>
        </F.Row> }

        { hasGeo && <F.Row>
          <F.Column small={12}>
            <MapPicker onSelect={this.updateGeo} selectedGeos={this.state.searchTags || []} granularity={this.state.granularity} />
          </F.Column>
        </F.Row> }

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

export default connect(
  (state) => ({
    families: state.families.entities,
    ...state.modules,
  }),
  {
    push,
    ...modulesActions,
  }
)(Modules)
