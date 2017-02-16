import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';
import MapPicker from './MapPicker';

const Modules = ({  }) => (
<div>
  <F.Row>
    <p>Oh my, modules.</p>
  </F.Row>
  <F.Row>
    <MapPicker />
  </F.Row>
</div>
);

export default connect(
  (state) => ({
  }),
  {
  })(Modules);
