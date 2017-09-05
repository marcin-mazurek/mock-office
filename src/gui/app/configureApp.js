import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureRoutes from './router/configureRoutes';

export default (store) => {
  const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
      return state.get('routing').toJS();
    }
  });
  const routes = configureRoutes(store);

  return (
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>
  );
};
