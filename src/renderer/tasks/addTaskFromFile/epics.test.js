import { Map, Set } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import addTaskFromFileEpic from './epics';
import { init } from './actions';

let store;
const epicMiddleware = createEpicMiddleware(addTaskFromFileEpic);
const mockStore = configureMockStore([epicMiddleware]);

afterEach(() => {
  store.clearActions();
});

test('addTaskFromFileEpic', () => {
  store = mockStore(new Map({
    servers: new Map({
      itemsById: new Map({
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
    tasks: new Map()
  }));

  store.dispatch(init([
    new Blob(['{"payload": "task payload"}'])
  ]));
  expect(store.getActions()).toMatchSnapshot();
});
