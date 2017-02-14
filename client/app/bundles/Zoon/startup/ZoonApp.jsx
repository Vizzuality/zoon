import React from 'react'; // pkoch: to render the jsx.
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import configureStore from '../store';
import Layout from '../components/Layout';
import Home from '../components/Home';
import Modules from '../components/Modules';

const ZoonApp = (props, _railsContext) => (
  <Provider store={configureStore(props)}>
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="/modules" component={Modules} />
      </Route>
    </Router>
  </Provider>
);

export default ZoonApp;
