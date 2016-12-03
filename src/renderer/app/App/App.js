import React from 'react';
import { Provider } from 'react-redux';
import configurStore from '../../store';

const store = configurStore();

const App = () => (
  <Provider store={store}>
    <div>Hello mockee!</div>
  </Provider>
);

export default App;
