import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"
import buildUrl from "build-url"
import { replace } from "react-router-redux"

import * as modulesActions from "../actions/modules"
import ModuleCard from "./ModuleCard"
import Errorable from "./Errorable"
import FilterTogglePair from "./FilterTogglePair"
import MapPickerFilter from "./MapPickerFilter"
import SearchQueryFilter from "./SearchQueryFilter"
import {filterAbsentValues, filterEmptyValues} from "../utils"

const familyShape = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  image_url: React.PropTypes.string.isRequired,
})

const FamilySwitch = ({
  currentFamilyName,
  targetFamily,
  committer,
}) => {
  const isCurrent = currentFamilyName === targetFamily.name
  return (
    <a
      className={isCurrent ? "selected" : ""}
      onClick={() => {
        committer({searchFamily: isCurrent ? null : targetFamily.name})
      }}>
      <span
        className={[
          `module-family-${targetFamily.name}`,
          "module-family-background",
        ].join(" ")}
      />
      <span rel={targetFamily.name}>{targetFamily.name}</span>
    </a>
  )
}

FamilySwitch.propTypes = {
  currentFamilyName: React.PropTypes.string,
  targetFamily: React.PropTypes.object.isRequired,

  committer: React.PropTypes.func.isRequired,
}

function extractQueryParams (src) {
  let {searchFamily, searchQuery, granularity, selectedGeos} = src

  if (typeof selectedGeos === "string" || selectedGeos instanceof String) {
    selectedGeos = selectedGeos.split(",")
  }

  return {searchFamily, searchQuery, granularity, selectedGeos}
}

function serializeQueryData (src) {
  // Not just params, but the actual data that'll influence the results
  // returned from the server.
  let {searchFamily, searchQuery, selectedGeos} = src
  return JSON.stringify(
    filterEmptyValues({searchFamily, searchQuery, selectedGeos}),
  )
}

class Modules extends React.Component {
  static propTypes = {
    state: React.PropTypes.string.isRequired,
    families: React.PropTypes.arrayOf(familyShape).isRequired,
    searchFamily: React.PropTypes.string,
    searchQuery: React.PropTypes.string,
    granularity: React.PropTypes.string,
    selectedGeos: React.PropTypes.string,

    modulesFetchList: React.PropTypes.func.isRequired,
    clearModules: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
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

  componentWillUnmount () {
    this.props.clearModules()
  }

  commitState = (extras = {}) => {
    const {searchFamily, searchQuery, granularity, selectedGeos} = {
      ...this.state,
      ...extras,
    }

    this.props.replace(buildUrl(
      this.props.location.pathname,
      {
        queryParams: filterAbsentValues({
          searchFamily,
          searchQuery,
          granularity,
          selectedGeos,
        }),
      },
    ))
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
                        currentFamilyName={this.state.searchFamily}
                        targetFamily={f}
                        committer={this.commitState}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <FilterTogglePair
                searchQuery={this.state.searchQuery}
                granularity={this.state.granularity}
                selectedGeos={this.state.selectedGeos}
                committer={this.commitState}
              />
            </div>
          </F.Column>
        </F.Row>

        <SearchQueryFilter
          searchQuery={this.state.searchQuery}
          committer={this.commitState}
        />

        <MapPickerFilter
          granularity={this.state.granularity}
          selectedGeos={this.state.selectedGeos}
          updateGeo={this.commitState}
        />

        <Errorable
          state={this.props.state}
          errorMessage={this.props.errorMessage}
        >
          { this.props.entities.length === 0 ? (
            <F.Row>
              <F.Column>No results. Try another search.</F.Column>
            </F.Row>
          ) : (
            <F.Row>
              <F.Column small={12}>
                <div className="mosaic">
                  {this.props.entities.map(m =>
                    <ModuleCard key={m.id} m={m} />
                  )}
                </div>
              </F.Column>
            </F.Row>
          ) }
        </Errorable>

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
    replace,
    ...modulesActions,
  }
)(Modules)
