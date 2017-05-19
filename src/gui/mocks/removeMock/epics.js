import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT } from './actions';
import { getTasks } from '../../entities/mocks/selectors';
import { remove } from '../../entities/mocks/actions';
import { remove as removeTask } from '../../entities/tasks/actions';

export const removeMockEpic = (action$, store) =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-mock', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ mockId: action.mockId, serverId: action.serverId })
      }).then(() => {
        return [remove(action.scenarioId, action.mockId)].concat(action.tasks.map(removeTask).toJS());
      })
      )
        .flatMap(actions => actions)
    );

export const removeMockAfterUseEpic = (action$, store) =>
  action$.ofType(REMOVE_AFTER_USE)
    .delay(5000)
    .map(
      ({ serverId, mockId }) => {
        const state = store.getState();
        const tasks = getTasks(state, mockId);
        return remove(serverId, mockId, tasks);
      }
    );
