import { remote } from 'electron';
import { REMOVE_AFTER_USE, INIT, remove } from './actions';

export const removeSceneEpic = action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { serverId, sceneId } = action;
      const server = remote.require('./main').double.find(serverId);
      server.getScenario().removeScene(sceneId);
      return [serverId, sceneId];
    }).map(scene => remove(...scene));

export const removeSceneAfterUseEpic = action$ =>
  action$.ofType(REMOVE_AFTER_USE)
    .delay(5000)
    .map(({ serverId, sceneId }) => remove(serverId, sceneId));
