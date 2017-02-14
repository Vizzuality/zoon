import React from 'react';
import * as F from 'react-foundation';
import { connect } from 'react-redux';

const NotFound = ({  }) => (
<span>
  <h1>404: Not Found</h1>
  Something's amiss. Bummer.
</span>
);

export default connect(
  (state) => ({
  }),
  {
  })(NotFound);
