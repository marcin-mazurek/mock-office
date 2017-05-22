/* eslint-disable global-require */
describe('startServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('actions snapshot when response object hasn\'t got errors', (done) => {
    const configureMockStore = require('redux-mock-store').default;
    const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
    const initStart = require('./actions').default;
    jest.mock('../../api', () => ({
      startServer() {
        return Promise.resolve({ id: 'some id' });
      }
    }));
    // eslint-disable-next-line global-require
    const startServerEpic = require('./epics').default;

    const epicMiddleware = createEpicMiddleware(startServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initStart('some id'));

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });

  it('actions snapshot when on api request errors', (done) => {
    const configureMockStore = require('redux-mock-store').default;
    const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
    const initStart = require('./actions').default;
    jest.mock('../../api', () => ({
      startServer() {
        return Promise.resolve({ error: 'error message' });
      }
    }));
    const startServerEpic = require('./epics').default;

    const epicMiddleware = createEpicMiddleware(startServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initStart('some id'));

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
