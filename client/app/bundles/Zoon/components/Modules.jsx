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
import {filterAbsentValues} from "../utils"
import GatedDispatcher from "../lib/gated_dispatcher"

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

    this.gate = new GatedDispatcher(this.props.modulesFetchList, {
      searchFamily: {},
      searchQuery: {},
      granularity: {
        relevantForData: false,
      },
      selectedGeos: {
        decode: v => {
          if (typeof v !== "string" && !(v instanceof String)) {
            return v
          }

          if (v === "") {
            return []
          }

          return v.split(",")
        },
      },
    })

    this.gate.absorbValues(this.props.router.location.query)
    this.gate.overlayValues(this.props)
    this.state = {...this.gate.state}
  }

  componentDidMount () {
    this.gate.fire()
  }

  componentWillUnmount () {
    this.props.clearModules()
  }

  commitState = (extra = {}) => {
    this.gate.absorbValues(extra)

    this.props.replace(buildUrl(
      this.props.location.pathname,
      {queryParams: filterAbsentValues(this.gate.state)},
    ))
  }

  componentWillReceiveProps (nextProps) {
    this.gate.absorbValues(nextProps.router.location.query)
    this.gate.overlayValues(nextProps)

    if (JSON.stringify(this.gate.state) !== JSON.stringify(this.state)) {
      this.setState(this.gate.state)

      this.gate.maybeFire()
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
