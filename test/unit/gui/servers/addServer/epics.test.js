/* eslint-disable global-require */
import { Map } from 'immutable';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { submitButtonClickAction } from '../../../../../src/gui/components/AddServerForm/actions';

describe('addServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test('actions dispatched on API response without error', (done) => {
    jest.mock('../../../../../src/gui/resources/api', () => ({
      addServer() {
        return Promise.resolve({
          data: {
            id: 'server-id',
            port: 3000,
            name: 'name',
            type: 'http',
            secure: false
          }
        });
      }
    }));
    // eslint-disable-next-line global-require
    const addServerEpic = require('../../../../../src/gui/servers/addServer/epics').default;
    const epicMiddleware = createEpicMiddleware(addServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    const action = submitButtonClickAction(
      new Map({
        port: 3000,
        name: 'name',
        type: 'http',
        secure: false
      })
    );
    store.dispatch(action);

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });

  test('actions dispatched on API response with error', (done) => {
    jest.mock('../../../../../src/gui/resources/api', () => ({
      addServer() {
        return Promise.resolve({
          error: 'error message'
        });
      }
    }));
    // eslint-disable-next-line global-require
    const addServerEpic = require('../../../../../src/gui/servers/addServer/epics').default;
    const epicMiddleware = createEpicMiddleware(addServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    const action = submitButtonClickAction(
      new Map({
        port: 3000,
        name: 'name',
        type: 'http',
        secure: false
      })
    );
    store.dispatch(action);

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
