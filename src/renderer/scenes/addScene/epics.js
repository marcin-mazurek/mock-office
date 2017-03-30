import { Observable } from 'rxjs';
import { remote } from 'electron';
import { INIT, add } from './actions';

const addSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, scenes } = action;
      const scenesForAdd = scenes.map((scene) => {
        const server = remote.require('./main/servers').default.find(serverId);
        const scenario = server.getScenario();
        const sceneId = scenario.addScene(scene);

        return [
          serverId,
          sceneId,
          scene.scenePayload,
          scene.title,
          scene.interval,
          scene.reuse,
          scene.quantity,
          scene.delay,
          scene.requirements,
          scene.blocking
        ];
      });

      return Observable.from(scenesForAdd);
    }).map(scene => add(...scene));

export default addSceneEpic;