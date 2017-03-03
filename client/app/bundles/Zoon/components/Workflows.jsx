import React from "react"
import { connect } from "react-redux"
import * as F from "react-foundation"
import buildUrl from "build-url"
import { push } from "react-router-redux"

import * as workflowActions from "../actions/workflows"
import Errorable from "./Errorable"
import WorkflowCard from "./WorkflowCard"
import FilterTogglePair from "./FilterTogglePair"
import MapPickerFilter from "./MapPickerFilter"
import SearchQueryFilter from "./SearchQueryFilter"
import {filterAbsentValues, filterEmptyValues} from "../utils"

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

class Workflows extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      ...extractQueryParams(this.props.router.location.query),
      ...filterAbsentValues(extractQueryParams(this.props)),
    }
  }

  componentDidMount () {
    this.props.workflowsFetchList(this.state)
  }

  commitState = (extras = {}) => {
    const {searchQuery, granularity, selectedGeos} = {
      ...this.state,
      ...extras,
    }

    this.props.push(buildUrl(
      this.props.location.pathname,
      {
        queryParams: filterAbsentValues({
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
        this.props.workflowsFetchList(qp)
      }
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
    push,
    ...workflowActions,
  }
)(Workflows)

