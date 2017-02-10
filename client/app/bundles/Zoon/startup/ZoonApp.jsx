import React from 'react'; // pkoch: to render the jsx.
import { Provider } from 'react-redux';

import configureStore from '../store';
import Home from '../components/Home';

const ZoonApp = (props, _railsContext) => (
  <Provider store={configureStore(props)}>
    <Home />
  </Provider>
);

export default ZoonApp;
