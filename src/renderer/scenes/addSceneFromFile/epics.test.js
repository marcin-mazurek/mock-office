import { Map, Set } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import addSceneFromFileEpic from './epics';
import { init } from './actions';

let store;
const epicMiddleware = createEpicMiddleware(addSceneFromFileEpic);
const mockStore = configureMockStore([epicMiddleware]);

afterEach(() => {
  store.clearScenes();
});

test('addSceneFromFileEpic', () => {
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
    scenes: new Map()
  }));

  store.dispatch(init('server id', [
    new Blob(['{"payload": "scene payload"}'])
  ]));
  expect(store.getScenes()).toMatchSnapshot();
});
