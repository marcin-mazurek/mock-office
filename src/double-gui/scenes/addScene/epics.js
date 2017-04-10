import { Observable } from 'rxjs';
import { INIT, add } from './actions';

const addSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, scenes } = action;

      return Observable.from(Promise.all(
        scenes.map(sceneParams =>
          fetch({
            host: 'http://127.0.0.1',
            url: '/add-scene',
            port: 3060,
            method: 'POST',
            payload: sceneParams
          }).then(
            res => [
              serverId,
              res.json().sceneId,
              sceneParams.title,
              sceneParams.interval,
              sceneParams.reuse,
              sceneParams.quantity,
              sceneParams.delay,
              sceneParams.requirements,
              sceneParams.parts
            ]
          )
        )
      ));
    }).map(scene => add(...scene));

export default addSceneEpic;
