import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateName } from '../actions/name';

const Greeter = ({ name, updateName }) => (
  <div>
    <h3>Hello, {name}!</h3>
    <form>
      <label htmlFor="name">
        Say hello to:
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => updateName(e.target.value)}
      />
    </form>
  </div>
);

Greeter.propTypes = {
  name: PropTypes.string.isRequired,
  updateName: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({ name: state.name }),
  { updateName })(Greeter);
