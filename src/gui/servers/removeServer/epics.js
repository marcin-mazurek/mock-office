import { Observable } from 'rxjs';
import { push } from 'react-router-redux';
import { ifElse, has } from 'ramda';
import { INIT } from './actions';
import getCurrentDisplayedServerId from '../../sidebar/selectors';
import { mockSelector } from '../../entities/mocks/selectors';
import { serverSelector } from '../../entities/servers/selectors';
import { scenarioSelector } from '../../entities/scenarios/selectors';
import api from '../../api';
import { add as addNotification } from '../../entities/notifications/actions';
import { removeAction as removeServerAction } from '../../entities/servers/actions';
import { removeAction as removeScenarioAction } from '../../entities/scenarios/actions';
import { removeAction as removeMockAction } from '../../entities/mocks/actions';
import { removeAction as removeTaskAction } from '../../entities/tasks/actions';

const makeRequest = action => api.removeServer({ id: action.id });
const onFail = result => [addNotification({ type: 'error', text: result.error })];
const onSuccess = store => (result) => {
  const state = store.getState();
  const { data } = result;
  const actions = [];

  // Change route to prevent errors when trying to display removed server
  const displayedServerId = getCurrentDisplayedServerId(state);
  if (displayedServerId === data.id) {
    actions.push(push('/'));
  }
  actions.push(removeServerAction(data.id));
  const server = serverSelector(state, data.id);
  actions.push(removeScenarioAction(server.scenario));
  const scenario = scenarioSelector(state, server.scenario);
  scenario.mocks.forEach(
    mock => actions.push(removeMockAction(server.scenario, mock))
  );
  scenario.mocks
    .forEach((mockId) => {
      mockSelector(state, mockId).tasks
        .forEach(task =>
          actions.push(removeTaskAction(mockId, task))
        );
    });
  actions.push(addNotification({ type: 'success', text: 'Server removed' }));
  return Observable.from(actions);
};
const hasError = has('error');

export default (action$, store) =>
  action$.ofType(INIT)
    .flatMap(makeRequest)
    .flatMap(
      ifElse(
        hasError,
        onFail,
        onSuccess(store)
      )
    );
