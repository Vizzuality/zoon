import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';
import ReactHighmaps from 'react-highcharts/ReactHighmaps';
import countriesMap from '../countriesMap';
import countriesData from '../countriesData';
import continentsMap from '../continentsMap';
import continentsData from '../continentsData';
import clone from 'clone';
import { pickMapGranularity } from '../actions/map';

const config = {
  title: null,
  chart: {
    backgroundColor: "transparent"
  },
  series: [{
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
          select: function (event) {
            console.log("Selected", event.target.name);
          },
          unselect: function (event) {
            console.log("Unselected");
          }
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
};

const continentsConfig = (function () {
  var conf = clone(config);
  conf.series[0].mapData = continentsMap;
  conf.series[0].data = continentsData;
  return conf;
})();

const countriesConfig = (function () {
  var conf = clone(config);
  conf.series[0].mapData = countriesMap;
  conf.series[0].data = countriesData;
  return conf;
})();

const MapPicker = ({ granularity, pickMapGranularity }) => (
<div className="map-picker">
  <div className="picker">
    <span>Filter by coverage</span>
    <div className="buttons">
      <F.Button isHollow className={ granularity === "continents" ? "active" : "" } onClick={ () => (pickMapGranularity("continents"))}>
        Continents
      </F.Button>
      <F.Button isHollow className={ granularity === "countries" ? "active" : "" } onClick={ () => (pickMapGranularity("countries"))}>
        Countries
      </F.Button>
    </div>
  </div>
  <div className="map">
    { granularity === "continents" ? (
      <ReactHighmaps config = {continentsConfig}></ReactHighmaps>
    ) : (
      <ReactHighmaps config = {countriesConfig}></ReactHighmaps>
    )}
  </div>
</div>
);

export default connect(
  (state) => ({
    granularity: state.map.granularity
  }),
  {
    pickMapGranularity
  })(MapPicker);
