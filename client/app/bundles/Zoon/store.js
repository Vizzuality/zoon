import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

import reducer from './reducers/index';
import saga from './sagas';


const configureStore = (props) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    props,
    compose(
      applyMiddleware(sagaMiddleware),
      applyMiddleware(routerMiddleware(browserHistory)),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || ((f) => f)
    ),
  );

  if (false) {
    let old_d = store.dispatch;
    store.dispatch = (...args) => {
      console.log("Dispatching:", args[0]);
      return old_d(...args);
    }

    store.subscribe(() => {console.log("New state: ", store.getState())})
  }

  sagaMiddleware.run(saga);

  return store;
};


export default configureStore;
