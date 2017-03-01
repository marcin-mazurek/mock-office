import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Map, Record } from 'immutable';
import '../src/renderer/styles/main.scss';
import NavBar from '../src/renderer/navbar/NavBar';

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

storiesOf('NavBar', module)
  .add('default', () => (
    <Provider store={mockStore(state)}>
      <NavBar />
    </Provider>
  ));
