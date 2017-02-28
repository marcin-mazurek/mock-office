import { Map } from 'immutable';
import configureMockStore from 'redux-mock-store';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { init } from './actions';
import removeTaskEpic from './epics';

let store;
const epicMiddleware = createEpicMiddleware(removeTaskEpic);
const mockStore = configureMockStore([epicMiddleware]);

jest.mock('electron', () => ({
  remote: {
    require() {
      return {
        default: {
          removeTask() {}
        }
      };
    }
  }
}));

test('removeTaskEpic', () => {
  store = mockStore(new Map());

  store.dispatch(init('queue id', 'task id'));
  expect(store.getActions()).toMatchSnapshot();
});
