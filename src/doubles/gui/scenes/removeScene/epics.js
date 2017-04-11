import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT, remove } from './actions';

export const removeSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-scene', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ sceneId: action.sceneId, serverId: action.serverId })
      }).then(() => [action.serverId, action.sceneId])
    )).map(scene => remove(...scene));

export const removeSceneAfterUseEpic = action$ =>
  action$.ofType(REMOVE_AFTER_USE)
    .delay(5000)
    .map(({ serverId, sceneId }) => remove(serverId, sceneId));
