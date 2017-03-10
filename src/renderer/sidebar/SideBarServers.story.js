import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Provider } from 'react-redux';
import { Map } from 'immutable';
import configureStore from 'redux-mock-store';
import SideBarServersConnect from './SideBarServers';
import SideBar from './SideBar';
import { Server } from '../servers/reducer';

const mockStore = configureStore();

const state = new Map({
  servers: new Map({
    itemsById: new Map({
      'some-id': new Server({
        name: 'Server 1',
        id: 'some-id'
      }),
      'another-id': new Server({
        name: 'Server 2',
        id: 'another-id'
      })
    }),
    selected: null,
    running: new Set(['another-id'])
  })
});

const store = mockStore(state);

storiesOf('SideBarServers', module)
  .add('single server', () => (
    <Provider store={store}>
      <SideBar>
        <SideBarServersConnect />
      </SideBar>
    </Provider>
  ));