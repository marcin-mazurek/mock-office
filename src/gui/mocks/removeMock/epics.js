import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT } from './actions';
import { mockSelector } from '../../entities/mocks/selectors';
import { removeAction } from '../../entities/mocks/actions';
import { removeAction as removeTaskAction } from '../../entities/tasks/actions';

export const removeMockEpic = action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-mock', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ mockId: action.mockId, serverId: action.serverId })
      }).then(() =>
        [removeAction(action.scenarioId, action.mockId)].concat(
          action.tasks.map(removeTaskAction).toJS()
        )
      )
      )
        .flatMap(actions => actions)
    );

export const removeMockAfterUseEpic = (action$, store) =>
  action$.ofType(REMOVE_AFTER_USE)
    .delay(5000)
    .map(
      ({ scenario, mockId }) => {
        const state = store.getState();
        const mock = mockSelector(state, mockId);
        return removeAction(scenario, mockId, mock.tasks);
      }
    );
