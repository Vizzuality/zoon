import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';
import ReactHighmaps from 'react-highcharts/ReactHighmaps';
import countriesMap from '../countriesMap';
import countriesData from '../countriesData';
import continentsMap from '../continentsMap';
import continentsData from '../continentsData';

const config = (seriesData, selectedGeos, select, unselect) => ({
  title: null,
  chart: {
    backgroundColor: "transparent"
  },
  series: [{
    data: seriesData.data.map((elem) => (
      {
        ...elem,
        selected: selectedGeos.includes(elem.value),
      }
    )),
    mapData: seriesData.mapData,
    allowPointSelect: true,
  }],
  plotOptions: {
    series: {
      color: "#BBBBBB",
      cursor: "pointer",
      states: {
        hover: {
          color: "#666666"
        },
        select: {
          color: "#000000"
        }
      },
      point: {
        events: {
          select: select,
          unselect: unselect,
        }
      }
    },
  },
  legend: {
    enabled: false
  },
  tooltip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 0,
    followPointer: false,
    headerFormat: "",
    pointFormat: "{point.name}",
    style: {
      color: "#000000",
      fontWeight: "bold",
      textTransform: "uppercase"
    }
  }
});

const data = {
  continents: {
    mapData: continentsMap,
    data: continentsData,
  },
  countries: {
    mapData: countriesMap,
    data: countriesData,
  },
};

class MapPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      continents: [],
    };

    this.state = this.geoState(
      this.props.granularity,
      this.props.selectedGeos,
    );

    const configGenerator = (granularity) => config(
      data[granularity],
      this.state[granularity],
      this.onGeoSelected.bind(this),
      this.onGeoUnselected.bind(this),
    );

    this.configs = {
      countries: configGenerator("countries"),
      continents: configGenerator("continents"),
    };
  }

  geoState(granularity, selectedGeos) {
    return {
      ...this.state,
      [granularity]: selectedGeos
    };
  }

  pickMapGranularity(granularity) {
    this.props.onSelect(granularity, this.state[granularity]);
  }

  onGeoSelected(ev) {
    let selectedGeos = ev.target.series.chart.
      getSelectedPoints().
      map((p) => p.name).
      concat([ev.target.name]);

    this.setState(this.geoState(
      this.props.granularity,
      this.props.selectedGeos,
    ));

    this.props.onSelect(this.props.granularity, selectedGeos);
  }

  onGeoUnselected(ev) {
    let selectedGeos = ev.target.series.chart.
        getSelectedPoints().
        map((p) => p.name).
        filter((e) => e != ev.target.name);

    this.setState(this.geoState(
      this.props.granularity,
      this.props.selectedGeos,
    ));

    this.props.onSelect(this.props.granularity, selectedGeos);
  }

  render() {
    return (
      <div className="map-picker">
        <div className="picker">
          <span>Filter by coverage</span>
          <div className="buttons">
            {["continents", "countries"].map((granularity) => (
              <F.Button
                key={granularity}
                isHollow
                className={this.props.granularity === granularity ? "active" : "" }
                onClick={() => this.pickMapGranularity(granularity)}>
                {granularity}
              </F.Button>
            ))}
          </div>
        </div>
        <div className="map">
          <ReactHighmaps isPureConfig config={this.configs[this.props.granularity]} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
  }),
  {
  })(MapPicker);
