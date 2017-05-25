/* eslint-disable global-require */
import { fromJS } from 'immutable';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { initializedAction } from '../../../../src/gui/servers/editServer/actions';

describe('editServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('actions snapshot on success response', (done) => {
    jest.mock('../../../../src/gui/resources/api', () => ({
      editServer() {
        return Promise.resolve({
          data: {
            id: 'some id',
            port: 3000,
            name: 'name'
          }
        });
      }
    }));
    // eslint-disable-next-line global-require
    const editServerEpic = require('../../../../src/gui/servers/editServer/epics').default;

    const epicMiddleware = createEpicMiddleware(editServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initializedAction('some id', fromJS({ port: 3000, name: 'name' })));

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });

  it('actions snapshot on failed response', (done) => {
    jest.mock('../../../../src/gui/resources/api', () => ({
      editServer() {
        return Promise.resolve({ error: 'error message' });
      }
    }));
    const editServerEpic = require('../../../../src/gui/servers/editServer/epics').default;

    const epicMiddleware = createEpicMiddleware(editServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initializedAction('some id', fromJS({ port: 3000, name: 'name' })));

    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
