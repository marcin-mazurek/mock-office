/* eslint-disable global-require */
describe('editServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('actions snapshot on success response', (done) => {
    const configureMockStore = require('redux-mock-store').default;
    const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
    const initEdit = require('./actions').init;
    jest.mock('./rest', () => () =>
      Promise.resolve({
        data: {
          id: 'some id',
          port: 3000,
          name: 'name'
        }
      })
    );
    // eslint-disable-next-line global-require
    const editServerEpic = require('./epics').default;

    const epicMiddleware = createEpicMiddleware(editServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initEdit('some id', { port: 3000, name: 'name' }));

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });

  it('actions snapshot on failed response', (done) => {
    const configureMockStore = require('redux-mock-store').default;
    const createEpicMiddleware = require('redux-observable').createEpicMiddleware;
    const initEdit = require('./actions').init;
    jest.mock('./rest', () => () => Promise.resolve({ error: 'error message' }));
    const editServerEpic = require('./epics').default;

    const epicMiddleware = createEpicMiddleware(editServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initEdit('some id', { port: 3000, name: 'name' }));

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
