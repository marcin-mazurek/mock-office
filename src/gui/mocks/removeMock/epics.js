import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT } from './actions';
import { selectors, actionCreators } from '../../entities/module';

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
        [actionCreators.removeMockAction(action.scenarioId, action.mockId)].concat(
          action.tasks.map(actionCreators.removeTaskAction).toJS()
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
        const mock = selectors.entitySelector(state, mockId);
        return actionCreators.removeMockAction(scenario, mockId, mock.tasks);
      }
    );
