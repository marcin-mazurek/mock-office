import { switchButtonClickedAction } from '../../../../../src/gui/servers/inspectServer/InspectServer';

/* eslint-disable global-require */
describe('toggleServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('when server is down', () => {
    test('actions snapshot when response object hasn\'t got errors', (done) => {
      const configureMockStore = require('redux-mock-store').default;
      const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
      jest.mock('../../../../../src/gui/resources/api', () => ({
        startServer() {
          return Promise.resolve({
            data: { id: 'some id' }
          });
        }
      }));
      // eslint-disable-next-line global-require
      const toggleServerEpic = require('../../../../../src/gui/servers/toggleServer/epic').default;

      const epicMiddleware = createEpicMiddleware(toggleServerEpic);
      const mockStore = configureMockStore([epicMiddleware]);
      const store = mockStore();
      store.dispatch(switchButtonClickedAction('some id', false));

      Promise.resolve().then(() => {
        expect(store.getActions()).toMatchSnapshot();
        done();
      });
    });

    test('actions snapshot when on api request errors', (done) => {
      const configureMockStore = require('redux-mock-store').default;
      const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
      jest.mock('../../../../../src/gui/resources/api', () => ({
        startServer() {
          return Promise.resolve({ error: 'error message' });
        }
      }));
      const toggleServerEpic = require('../../../../../src/gui/servers/toggleServer/epic').default;

      const epicMiddleware = createEpicMiddleware(toggleServerEpic);
      const mockStore = configureMockStore([epicMiddleware]);
      const store = mockStore();
      store.dispatch(switchButtonClickedAction('some id', false));

      Promise.resolve().then(() => {
        expect(store.getActions()).toMatchSnapshot();
        done();
      });
    });
  });

  describe('when server is up', () => {
    test('actions snapshot when response object hasn\'t got errors', (done) => {
      const configureMockStore = require('redux-mock-store').default;
      const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
      jest.mock('../../../../../src/gui/resources/api', () => ({
        stopServer() {
          return Promise.resolve({
            data: { id: 'some id' }
          });
        }
      }));
      // eslint-disable-next-line global-require
      const toggleServerEpic = require('../../../../../src/gui/servers/toggleServer/epic').default;

      const epicMiddleware = createEpicMiddleware(toggleServerEpic);
      const mockStore = configureMockStore([epicMiddleware]);
      const store = mockStore();
      store.dispatch(switchButtonClickedAction('some id', false));

      Promise.resolve().then(() => {
        expect(store.getActions()).toMatchSnapshot();
        done();
      });
    });

    test('actions snapshot when on api request errors', (done) => {
      const configureMockStore = require('redux-mock-store').default;
      const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
      jest.mock('../../../../../src/gui/resources/api', () => ({
        startServer() {
          return Promise.resolve({ error: 'error message' });
        }
      }));
      const toggleServerEpic = require('../../../../../src/gui/servers/toggleServer/epic').default;

      const epicMiddleware = createEpicMiddleware(toggleServerEpic);
      const mockStore = configureMockStore([epicMiddleware]);
      const store = mockStore();
      store.dispatch(switchButtonClickedAction('some id', false));

      Promise.resolve().then(() => {
        expect(store.getActions()).toMatchSnapshot();
        done();
      });
    });
  });
});
