import React from "react"
import * as F from "react-foundation"

import {objectFromPairs, zip} from "../utils"

class FilterToggle extends React.Component {
  static propTypes = {
    faIconName: React.PropTypes.string.isRequired,
    names: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
    defaultValues: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
    committer: React.PropTypes.func.isRequired,
  }

  toggle = () => {
    const {names, values, defaultValues, committer} = this.props
    const nUndefs = Array(names.length)

    if (JSON.stringify(values) === JSON.stringify(nUndefs)) {
      committer(objectFromPairs(zip(names, defaultValues)))
    } else {
      committer(objectFromPairs(zip(names, nUndefs)))
    }
  }

  render () {
    const {faIconName, values} = this.props

    return <F.Button isHollow={values[0] === undefined} onClick={this.toggle}>
      <i className={`fa fa-${faIconName}`} />
    </F.Button>
  }
}

class FilterTogglePair extends React.Component {
  static propTypes = {
    searchQuery: React.PropTypes.string,
    granularity: React.PropTypes.string,
    selectedGeos: React.PropTypes.arrayOf(React.PropTypes.string),
    committer: React.PropTypes.func.isRequired,
  }

  render () {
    const {
      searchQuery,
      selectedGeos,
      granularity,
      committer,
    } = this.props

    return <ul className="filter-toggle">
      <li>
        <FilterToggle
          faIconName="map"
          names={["granularity", "selectedGeos"]}
          values={[granularity, selectedGeos]}
          defaultValues={["continents", ""]}
          committer={committer}
        />
      </li>
      <li>
        <FilterToggle
          faIconName="search"
          names={["searchQuery"]}
          values={[searchQuery]}
          defaultValues={[""]}
          committer={committer}
        />
      </li>
    </ul>
  }
}

export default FilterTogglePair
