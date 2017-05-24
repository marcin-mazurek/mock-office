import { Map } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { initAction } from '../../../../src/gui/mocks/importMock/actions';

describe('importMockEpic', () => {
  let store;

  afterEach(() => {
    store.clearActions();
  });

  test.only('snapshot of success flow', (done) => {
    jest.mock('../../../../src/gui/api', () => ({
      addMock() {
        return Promise.resolve({
          data: {
            id: 'mock-id',
            tasks: []
          }
        });
      }
    }));
    const addMockFromFileEpic = require('../../../../src/gui/mocks/importMock/epics').default;
    const epicMiddleware = createEpicMiddleware(addMockFromFileEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    store = mockStore(new Map({
      mocks: new Map({
        entities: new Map({
          'mock-id': {
            type: 'server type',
            name: 'server name',
            port: 3000,
            id: 'mock-id'
          }
        })
      })
    }));

    store.dispatch(initAction('server-id', 'scenario-id', [
      new Blob(['[{"tasks":[]}]'])
    ]));
    setTimeout(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    }, 100);
  });
});
