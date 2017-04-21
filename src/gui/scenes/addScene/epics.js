import { Observable } from 'rxjs';
import { INIT, add } from './actions';
import { requestAddScene } from '../../api/api';
import { add as addNotification } from '../../entities/notifications/actions';

const addSceneEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, scenes } = action;

      return Observable.from(
        Promise.all(scenes.map(scene => requestAddScene(serverId, scene)))
      );
    })
    .flatMap(scenes => Observable.from(scenes))
    .map(scene => add(...scene))
    .catch(err => Observable.of(addNotification({ text: err.message, type: 'error' })));

export default addSceneEpic;
