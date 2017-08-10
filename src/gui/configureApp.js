import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './components/App';

export default (store, routes) => {
  const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
      return state.get('routing').toJS();
    }
  });

  return (
    <Provider store={store}>
      <App>
        <Router history={history}>
          {routes}
        </Router>
      </App>
    </Provider>
  );
};
