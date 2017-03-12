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
              addTask() {
                return 'task id';
              }
            };
          }
        }
      };
    }
  }
};

jest.mock('electron', () => mockedElectron);
const addTaskEpic = require('./epics').default;

let store;
const epicMiddleware = createEpicMiddleware(addTaskEpic);
const mockStore = configureMockStore([epicMiddleware]);

test('addTaskEpic', () => {
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
    tasks: new Map()
  }));

  store.dispatch(init('serverId', [
    {
      taskPayload: 'taskPayload'
    }
  ]));
  expect(store.getActions()).toMatchSnapshot();
});
