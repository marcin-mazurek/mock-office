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

ipcRenderer.send('MAIN_WINDOW_READY');

ipcRenderer.on('expectations-loaded', (event, expectations) => {
  store.dispatch({ type: 'expectations/LOAD_expectations', expectations });
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
