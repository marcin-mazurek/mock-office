import { Observable } from 'rxjs';
import { INIT, add } from './actions';

const addSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, scenes } = action;

      return Observable.from(Promise.all(
        scenes.map(scene =>
          fetch('http://127.0.0.1:3060/add-scene', {
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ serverId, scene })
          })
            .then(res => res.json())
            .then(
              res => [
                serverId,
                res.id,
                scene.title,
                scene.interval,
                scene.reuse,
                scene.quantity,
                scene.delay,
                scene.requirements,
                scene.parts.map((part, index) => {
                  // eslint-disable-next-line no-param-reassign
                  part.id = res.parts[index];
                  return part;
                })
              ]
            )
        )
      ));
    })
    .flatMap(scenes => Observable.from(scenes))
    .map(scene => add(...scene));

export default addSceneEpic;
