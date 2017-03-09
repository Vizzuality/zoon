import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"
import buildUrl from "build-url"
import { replace } from "react-router-redux"

import * as workflowActions from "../actions/workflows"
import Errorable from "./Errorable"
import WorkflowCard from "./WorkflowCard"
import FilterTogglePair from "./FilterTogglePair"
import MapPickerFilter from "./MapPickerFilter"
import SearchQueryFilter from "./SearchQueryFilter"
import {filterAbsentValues} from "../utils"
import GatedDispatcher from "../lib/gated_dispatcher"

class Workflows extends React.Component {
  constructor (props) {
    super(props)

    this.gate = new GatedDispatcher(this.props.workflowsFetchList, {
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
      <span className="workflows">
        <F.Row>
          <F.Column small={12}>
            <FilterTogglePair
              searchQuery={this.state.searchQuery}
              granularity={this.state.granularity}
              committer={this.commitState}
            />
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
                {this.props.entities.map(w => <WorkflowCard key={w.id} w={w} />)}
              </F.Column>
            </F.Row>
          ) }
        </Errorable>
      </span>
    )
  };
}

Workflows.propTypes = {
  state: React.PropTypes.string.isRequired,
  workflowsFetchList: React.PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    ...state.workflows,
  }),
  {
    replace,
    ...workflowActions,
  }
)(Workflows)

