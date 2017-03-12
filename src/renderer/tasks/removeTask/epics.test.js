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
              removeTask() {}
            };
          }
        }
      };
    }
  }
};

jest.mock('electron', () => mockedElectron);
const removeTaskEpic = require('./epics').default;

let store;
const epicMiddleware = createEpicMiddleware(removeTaskEpic);
const mockStore = configureMockStore([epicMiddleware]);

test('removeTaskEpic', () => {
  store = mockStore(new Map());

  store.dispatch(init('server id', 'task id'));
  expect(store.getActions()).toMatchSnapshot();
});
