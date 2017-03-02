import React from "react"
import MapPicker from "./MapPicker"
import * as F from "react-foundation"

const MapPickerFilter = ({granularity, selectedGeos = [], updateGeo}) =>
  granularity !== undefined && <F.Row>
    <F.Column small={12}>
      <MapPicker
        onSelect={updateGeo}
        selectedGeos={selectedGeos}
        granularity={granularity}
      />
    </F.Column>
  </F.Row>

MapPickerFilter.propTypes = {
  granularity: React.PropTypes.string,
  selectedGeos: React.PropTypes.arrayOf(React.PropTypes.string),
  updateGeo: React.PropTypes.func.isRequired,
}

export default MapPickerFilter
