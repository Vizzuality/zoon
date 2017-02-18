import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';
import ReactHighmaps from 'react-highcharts/ReactHighmaps';
import countriesMap from '../countriesMap';
import countriesData from '../countriesData';
import continentsMap from '../continentsMap';
import continentsData from '../continentsData';
import { pickMapGranularity } from '../actions/map';

const config = (seriesData, select, unselect) => ({
  title: null,
  chart: {
    backgroundColor: "transparent"
  },
  series: [{
    ...seriesData,
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
      granularity: props.defaultGranularity || "continents",
    }

    this.configs = {
      countries: config(data["countries"], this.onSelected.bind(this), this.onUnselected.bind(this)),
      continents: config(data["continents"], this.onSelected.bind(this), this.onUnselected.bind(this)),
    };
  }

  pickMapGranularity(granularity) {
    this.setState({ granularity });
  }

  onChartRender(chart) {
    let selectedGeos = chart.
      getSelectedPoints().
      map((p) => p.name);

    this.props.onSelect(selectedGeos);
  }

  onSelected(ev) {
    let selectedGeos = ev.target.series.chart.
      getSelectedPoints().
      map((p) => p.name).
      concat([ev.target.name]);

    this.props.onSelect(selectedGeos);
  }

  onUnselected(ev) {
    let selectedGeos = ev.target.series.chart.
        getSelectedPoints().
        map((p) => p.name).
        filter((e) => e != ev.target.name);

    this.props.onSelect(selectedGeos);
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
                className={this.state.granularity === granularity ? "active" : "" }
                onClick={() => this.pickMapGranularity(granularity)}>
                {granularity}
              </F.Button>
            ))}
          </div>
        </div>
        <div className="map">
          <ReactHighmaps isPureConfig callback={this.onChartRender.bind(this)} config={this.configs[this.state.granularity]} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    granularity: state.map.granularity
  }),
  {
    pickMapGranularity
  })(MapPicker);
