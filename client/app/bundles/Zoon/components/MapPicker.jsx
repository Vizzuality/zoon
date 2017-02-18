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

const MapPicker = ({ granularity, pickMapGranularity, select, unselect }) => (
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
    <ReactHighmaps config={config(data[granularity], select, unselect)} />
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
