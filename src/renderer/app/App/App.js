import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configurStore from '../../store';
import routes from '../../routes';

const store = configurStore();
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  }
});

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
