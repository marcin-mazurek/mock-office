import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material';
import configureStore from '../store';
import routes from '../routes';
import removeTaskAfterUse from '../tasks/removeTaskAfterUse';

const store = configureStore();
removeTaskAfterUse(store);

const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  }
});

store.dispatch({ type: 'app/INIT'});

const App = () => (
  <div className="app">
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>
  </div>
);

export default App;
