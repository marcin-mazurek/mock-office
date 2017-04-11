import { Observable } from 'rxjs';
import { removeAfterUse, finish } from '../scenes/removeScene/actions';
import { run, stop } from '../scenes/runScene/actions';

const eventArgs2ActionPayload = data => [data.serverId, data.sceneId];

export default (store) => {
  Observable.webSocket('ws://127.0.0.1:3061').subscribe(
    (data) => {
      switch (data.event) {
        case 'SCENE_STOP': {
          store.dispatch(stop(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'SCENE_END': {
          store.dispatch(finish(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'SCENE_REMOVED_AFTER_USE': {
          setTimeout(() => {
            store.dispatch(removeAfterUse(...eventArgs2ActionPayload(data)));
          }, 5000);
          break;
        }
        case 'SCENE_START': {
          store.dispatch(run(...eventArgs2ActionPayload(data)));
          break;
        }
        default:
      }
    }
  );
};
