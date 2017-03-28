import { Map, Set, List } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { Server } from '../reducer';
import { init } from './actions';

let mockStore;
let removePromise;

describe('removeServerEpic', () => {
  beforeEach(() => {
    const mockedElectron = {
      remote: {
        require() {
          return {
            default: {
              remove() {
                removePromise = new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                  });
                });
                return Promise.resolve();
              }
            }
          };
        }
      }
    };

    jest.mock('electron', () => mockedElectron);
    // we need to mock electron first and then require epic, in fact
    // that epic requires remote module
    // eslint-disable-next-line global-require
    const removeServerEpic = require('./epics').default;
    const epicMiddleware = createEpicMiddleware(removeServerEpic);
    mockStore = configureMockStore([epicMiddleware]);
  });
  test('success flow', (done) => {
    const store = mockStore(new Map({
      servers: new Map({
        entities: new Map({
          'server id': new Server({
            type: 'server type',
            name: 'server name',
            port: 3000,
            id: 'server id'
          })
        }),
        ids: new List(['server id']),
        running: new Set()
      }),
      scenes: new Map()
    }));
    store.dispatch(init('some id'));

    removePromise.then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
