import { Map, Set } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import addDescriptionFromFileEpic from './epics';
import { init } from './actions';

let store;
const epicMiddleware = createEpicMiddleware(addDescriptionFromFileEpic);
const mockStore = configureMockStore([epicMiddleware]);

afterEach(() => {
  store.clearActions();
});

test('addDescriptionFromFileEpic', () => {
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
    descriptions: new Map()
  }));

  store.dispatch(init('server id', [
    new Blob(['{"payload": "description payload"}'])
  ]));
  expect(store.getActions()).toMatchSnapshot();
});
