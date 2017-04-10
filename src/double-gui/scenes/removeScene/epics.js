import { Observable } from 'rxjs';
import { REMOVE_AFTER_USE, INIT, remove } from './actions';

export const removeSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch({
        host: 'http://127.0.0.1',
        url: '/remove-scene',
        port: 3060,
        method: 'POST',
        payload: { id: action.id }
      }).then(() => action.id)
    )).map(scene => remove(...scene));

export const removeSceneAfterUseEpic = action$ =>
  action$.ofType(REMOVE_AFTER_USE)
    .delay(5000)
    .map(({ serverId, sceneId }) => remove(serverId, sceneId));
