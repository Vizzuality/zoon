import React from 'react'; // pkoch: to render the jsx.
import { Provider } from 'react-redux';

import configureStore from '../store';
import GreeterContainer from '../components/Greeter';

const ZoonApp = (props, _railsContext) => (
  <Provider store={configureStore(props)}>
    <GreeterContainer />
  </Provider>
);

export default ZoonApp;
