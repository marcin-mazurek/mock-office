import { Map, Set } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import addMockFromFileEpic from './epics';
import { initAction } from './actions';

let store;
const epicMiddleware = createEpicMiddleware(addMockFromFileEpic);
const mockStore = configureMockStore([epicMiddleware]);

afterEach(() => {
  store.clearActions();
});

test('addMockFromFileEpic', () => {
  store = mockStore(new Map({
    servers: new Map({
      entities: new Map({
        'server id': {
          type: 'server type',
          name: 'server name',
          port: 3000,
          id: 'server id'
        }
      }),
      selected: 'server id',
      running: new Set()
    }),
    mocks: new Map()
  }));

  store.dispatch(initAction('server id', [
    new Blob(['{"payload": "mock payload"}'])
  ]));
  expect(store.getActions()).toMatchSnapshot();
});
