import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT, remove } from './actions';
import { getSceneParts } from '../../entities/scenes/selectors';

export const removeSceneEpic = (action$, store) =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-scene', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ sceneId: action.sceneId, serverId: action.serverId })
      }).then(() => {
        const state = store.getState();
        const parts = getSceneParts(state, action.sceneId);
        return remove(action.serverId, action.sceneId, parts);
      })
    ));

export const removeSceneAfterUseEpic = (action$, store) =>
  action$.ofType(REMOVE_AFTER_USE)
    .delay(5000)
    .map(
      ({ serverId, sceneId }) => {
        const state = store.getState();
        const parts = getSceneParts(state, sceneId);
        return remove(serverId, sceneId, parts);
      }
    );
