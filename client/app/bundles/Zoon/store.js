import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

import reducer from './reducers/index';
import saga from './sagas';

const reduxDevtoolsExtensionMiddleware = () => (
  window !== undefined
  && window.__REDUX_DEVTOOLS_EXTENSION__
  && window.__REDUX_DEVTOOLS_EXTENSION__()
  || ((f) => f)
)

const configureStore = (props) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    props,
    compose(
      applyMiddleware(sagaMiddleware),
      applyMiddleware(routerMiddleware(browserHistory)),
      reduxDevtoolsExtensionMiddleware(),
    ),
  );

  sagaMiddleware.run(saga);

  return store;
};


export default configureStore;
