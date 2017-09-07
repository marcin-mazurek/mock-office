/* eslint-disable global-require */
import { Map } from 'immutable';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { submitButtonClickAction } from '../../../../../src/gui/components/AddServerForm/actions';
import { SUCCEEDED, FAILED } from '../../../../../src/gui/epics/addServer/actions';

describe('addServerEpic', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('actions snapshot', () => {
    test('when api resolves promise with server details', (done) => {
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
      const addServerEpic = require('../../../../../src/gui/epics/addServer/index').default;
      let store;
      const helperEpic = action$ =>
        action$.ofType(SUCCEEDED)
          .map(() => {
            expect(store.getActions()).toMatchSnapshot();
            done();
            return undefined;
          });
      const epicMiddleware = createEpicMiddleware(
        combineEpics(addServerEpic, helperEpic)
      );
      const mockStore = configureMockStore([epicMiddleware]);
      store = mockStore();
      const action = submitButtonClickAction(
        new Map({
          port: 3000,
          name: 'name',
          type: 'http',
          secure: false
        })
      );
      store.dispatch(action);
    });

    test('when api rejects promise with error', (done) => {
      jest.mock('../../../../../src/gui/resources/api', () => ({
        addServer() {
          return Promise.resolve({
            error: 'error message'
          });
        }
      }));
      let store;
      // eslint-disable-next-line global-require
      const addServerEpic = require('../../../../../src/gui/epics/addServer/index').default;
      const helperEpic = action$ =>
        action$.ofType(FAILED)
          .map(() => {
            expect(store.getActions()).toMatchSnapshot();
            done();
            return undefined;
          });
      const epicMiddleware = createEpicMiddleware(
        combineEpics(addServerEpic, helperEpic)
      );
      const mockStore = configureMockStore([epicMiddleware]);
      store = mockStore();
      const action = submitButtonClickAction(
        new Map({
          port: 3000,
          name: 'name',
          type: 'http',
          secure: false
        })
      );
      store.dispatch(action);
    });
  });
});
