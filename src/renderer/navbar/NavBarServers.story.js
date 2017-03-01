import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Provider } from 'react-redux';
import { Map, Record } from 'immutable';
import configureStore from 'redux-mock-store';
import NavBar from './NavBar';

const mockStore = configureStore();

const state = new Map({
  servers: new Map({
    itemsById: new Map({
      'some-id': new Record({
        id: '',
        name: 'New Server',
        port: null,
        type: '',
        queue: ''
      })({
        id: 'some-id'
      })
    }),
    selected: null,
    running: new Set()
  })
});

const store = mockStore(state);

storiesOf('NavBar', module)
  .add('default', () => (
    <Provider store={store}>
      <NavBar />
    </Provider>
  ));
