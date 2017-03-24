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
              addDescription() {
                return 'description id';
              }
            };
          }
        }
      };
    }
  }
};

jest.mock('electron', () => mockedElectron);
const addDescriptionEpic = require('./epics').default;

let store;
const epicMiddleware = createEpicMiddleware(addDescriptionEpic);
const mockStore = configureMockStore([epicMiddleware]);

describe('addDescriptionEpic', () => {
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
      descriptions: new Map()
    }));

    store.dispatch(init('serverId', [
      {
        title: 'description title',
        requirements: {
          url: '/some-path'
        },
        descriptionPayload: 'descriptionPayload'
      }
    ]));
    expect(store.getActions()).toMatchSnapshot();
  });
});
