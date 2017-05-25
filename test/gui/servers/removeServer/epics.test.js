import { fromJS } from 'immutable';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { initializedAction } from '../../../../src/gui/servers/removeServer/actions';
import Server from '../../../../src/gui/entities/servers/Server';
import { Scenario } from '../../../../src/gui/entities/scenarios/reducer';

describe('removeServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test('success path actions snapshot', (done) => {
    jest.mock('../../../../src/gui/resources/api', () => ({
      removeServer() {
        return Promise.resolve({
          data: {
            id: 'server-id'
          }
        });
      }
    }));
    const removeServerEpic = require('../../../../src/gui/servers/removeServer/epics').default;
    const epicMiddleware = createEpicMiddleware(removeServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore(fromJS({
      servers: {
        entities: {
          'server-id': new Server({ id: 'server-id', scenario: 'scenario-id' })
        },
        ids: ['server-id']
      },
      scenarios: {
        entities: {
          'scenario-id': new Scenario({ id: 'scenario-id' })
        },
        ids: ['scenario-id']
      },
      mocks: {
        entities: {},
        ids: []
      }
    }));
    store.dispatch(initializedAction('server-id'));
    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });

  test('fail path actions snapshot', (done) => {
    jest.mock('../../../../src/gui/resources/api', () => ({
      removeServer() {
        return Promise.resolve({
          error: 'Error message'
        });
      }
    }));
    const removeServerEpic = require('../../../../src/gui/servers/removeServer/epics').default;
    const epicMiddleware = createEpicMiddleware(removeServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore(fromJS({
      servers: {
        entities: {
          'server-id': new Server({ id: 'server-id', scenario: 'scenario-id' })
        },
        ids: ['server-id']
      },
      scenarios: {
        entities: {
          'scenario-id': new Scenario({ id: 'scenario-id' })
        },
        ids: ['scenario-id']
      },
      mocks: {
        entities: {},
        ids: []
      }
    }));
    store.dispatch(initializedAction('server-id'));
    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
