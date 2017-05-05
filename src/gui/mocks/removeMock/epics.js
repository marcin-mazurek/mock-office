import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT, remove } from './actions';
import { getTasks } from '../../entities/mocks/selectors';

export const removeMockEpic = (action$, store) =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-scene', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ sceneId: action.mockId, serverId: action.serverId })
      }).then(() => {
        const state = store.getState();
        const tasks = getTasks(state, action.mockId);
        return remove(action.serverId, action.mockId, tasks);
      })
    ));

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
