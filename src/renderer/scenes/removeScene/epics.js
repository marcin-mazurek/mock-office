import { remote } from 'electron';
import { INIT, remove } from './actions';

const removeSceneEpic = action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { serverId, sceneId } = action;
      const server = remote.require('./main/servers').default.find(serverId);
      server.removeScene(sceneId);
      return [serverId, sceneId];
    }).map(scene => remove(...scene));

export default removeSceneEpic;
