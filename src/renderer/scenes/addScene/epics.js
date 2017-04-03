import { Observable } from 'rxjs';
import { remote } from 'electron';
import { INIT, add } from './actions';

const addSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, scenes } = action;
      const scenesForAdd = scenes.map((sceneParams) => {
        const server = remote.require('./main/servers').default.find(serverId);
        const scenario = server.getScenario();
        const sceneId = scenario.addScene(sceneParams);
        const parts = scenario.scenes.find(scene => scene.id === sceneId).parts;

        return [
          serverId,
          sceneId,
          sceneParams.title,
          sceneParams.interval,
          sceneParams.reuse,
          sceneParams.quantity,
          sceneParams.delay,
          sceneParams.requirements,
          parts
        ];
      });

      return Observable.from(scenesForAdd);
    }).map(scene => add(...scene));

export default addSceneEpic;
