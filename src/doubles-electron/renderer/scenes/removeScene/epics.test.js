import { Map } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { init } from './actions';

const mockedElectron = {
  remote: {
    require() {
      return {
        double: {
          find() {
            return {
              getScenario() {
                return {
                  removeScene() {}
                };
              }
            };
          }
        }
      };
    }
  }
};

jest.mock('electron', () => mockedElectron);
const removeSceneEpic = require('./epics').removeSceneEpic;

let store;
const epicMiddleware = createEpicMiddleware(removeSceneEpic);
const mockStore = configureMockStore([epicMiddleware]);

describe('removeScene epic', () => {
  test('default snapshot', () => {
    store = mockStore(new Map());

    store.dispatch(init('server id', 'scene id'));
    expect(store.getActions()).toMatchSnapshot();
  });
});
