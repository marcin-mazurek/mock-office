import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { START } from '../../entities/servers/actions';
import initStart from './actions';

describe('startServerEpic', () => {
  it(`should dispatch ${START}`, () => {
    jest.mock('../../api/api', () => ({
      requestStartServer: () => ([{ id: 'some id' }])
    }));
    // eslint-disable-next-line global-require
    const startServerEpic = require('./epics').default;

    const epicMiddleware = createEpicMiddleware(startServerEpic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    store.dispatch(initStart('some id'));
    expect(store.getActions()).toMatchSnapshot();
  });
});
