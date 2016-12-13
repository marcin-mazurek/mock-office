import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ipcRenderer } from 'electron';
import configurStore from '../../store';
import routes from '../../routes';

const store = configurStore();
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  }
});

ipcRenderer.on('redux-action', (event, action) => {
  store.dispatch(action);
});

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
);

export default App;
