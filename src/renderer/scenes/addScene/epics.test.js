import { Map, Set } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { init } from './actions';

const mockedElectron = {
  remote: {
    require() {
      return {
        default: {
          find() {
            return {
              addScene() {
                return 'scene id';
              }
            };
          }
        }
      };
    }
  }
};

jest.mock('electron', () => mockedElectron);
const addSceneEpic = require('./epics').default;

let store;
const epicMiddleware = createEpicMiddleware(addSceneEpic);
const mockStore = configureMockStore([epicMiddleware]);

describe('addSceneEpic', () => {
  test('success flow snapshot', () => {
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

    store.dispatch(init('serverId', [
      {
        title: 'scene title',
        requirements: {
          url: '/some-path'
        },
        scenePayload: 'scenePayload'
      }
    ]));
    expect(store.getScenes()).toMatchSnapshot();
  });
});
