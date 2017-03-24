import { Map } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { init } from './actions';

const mockedElectron = {
  remote: {
    require() {
      return {
        default: {
          find() {
            return {
              removeDescription() {}
            };
          }
        }
      };
    }
  }
};

jest.mock('electron', () => mockedElectron);
const removeDescriptionEpic = require('./epics').default;

let store;
const epicMiddleware = createEpicMiddleware(removeDescriptionEpic);
const mockStore = configureMockStore([epicMiddleware]);

describe('removeDescription epic', () => {
  test('default snapshot', () => {
    store = mockStore(new Map());

    store.dispatch(init('server id', 'description id'));
    expect(store.getActions()).toMatchSnapshot();
  });
});
