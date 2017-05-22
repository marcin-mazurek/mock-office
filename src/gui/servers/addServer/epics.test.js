/* eslint-disable global-require */
import { Map } from 'immutable';

describe('addServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test('actions dispatched on API response without error', (done) => {
    const configureMockStore = require('redux-mock-store').default;
    const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
    const createSubmitAction = require('./actions').submit;
    jest.mock('../../api', () => ({
      addServer() {
        return Promise.resolve({
          data: {
            id: 'server-id',
            port: 3000,
            name: 'name',
            type: 'http',
            isSecure: false
          }
        });
      }
    }));
    // eslint-disable-next-line global-require
    const addServerEpic = require('./epics').default;
    const epicMiddleware = createEpicMiddleware(addServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    const submitAction = createSubmitAction(
      new Map({
        port: 3000,
        name: 'name',
        type: 'http',
        isSecure: false
      })
    );
    store.dispatch(submitAction);

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });

  test('actions dispatched on API response with error', (done) => {
    const configureMockStore = require('redux-mock-store').default;
    const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
    const createSubmitAction = require('./actions').submit;
    jest.mock('../../api', () => ({
      addServer() {
        return Promise.resolve({
          error: 'error message'
        });
      }
    }));
    // eslint-disable-next-line global-require
    const addServerEpic = require('./epics').default;
    const epicMiddleware = createEpicMiddleware(addServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    const submitAction = createSubmitAction(
      new Map({
        port: 3000,
        name: 'name',
        type: 'http',
        isSecure: false
      })
    );
    store.dispatch(submitAction);

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
