import { fromJS } from 'immutable';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { Scenario, Server } from '../../../../../src/lib/gui/app/entities';
import { removeButtonClickedAction } from '../../../../../src/lib/gui/components/InspectServer/actions';

describe('removeServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  test.only('success path actions snapshot', (done) => {
    jest.mock('../../../../../src/lib/gui/resources/api', () => ({
      removeServer() {
        return Promise.resolve({
          data: {
            id: 'server-id'
          }
        });
      }
    }));
    const removeServerEpic = require('../../../../../src/lib/gui/epics/removeServer').default;
    const epicMiddleware = createEpicMiddleware(removeServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore(fromJS({
      sidebar: {
        currentDisplayedServerId: ''
      }
    }));
    store.dispatch(removeButtonClickedAction('server-id'));
    setTimeout(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    }, 100);
  });

  test('fail path actions snapshot', (done) => {
    jest.mock('../../../../../src/lib/gui/resources/api', () => ({
      removeServer() {
        return Promise.resolve({
          error: 'Error message'
        });
      }
    }));
    const removeServerEpic = require('../../../../../src/lib/gui/epics/removeServer').default;
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
    store.dispatch(removeButtonClickedAction('server-id'));
    Promise.resolve().then(() => {
      expect(store.getActions()).toMatchSnapshot();
      done();
    });
  });
});
