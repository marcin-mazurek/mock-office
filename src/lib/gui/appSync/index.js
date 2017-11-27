import { Observable } from 'rxjs';
import {
  reactionsEndedAction,
  reactionsDidRunAction,
  reactionsCancelledAction,
} from './actions';

export default function startAppSync(ws, store) {
  Observable.fromEventPattern(
    (handler) => {
      ws.addEventListener('message', handler);
    },
    (handler) => {
      ws.removeEventListener('message', handler);
    }
  ).subscribe(
    (message) => {
      const data = JSON.parse(message.data);

      switch (data.event) {
        case 'SERVER_REACTIONS_ENDED': {
          store.dispatch(reactionsEndedAction(data.behaviourId));
          break;
        }
        case 'SERVER_REACTIONS_STARTED': {
          store.dispatch(reactionsDidRunAction(data.behaviourId));
          break;
        }
        case 'SERVER_REACTIONS_CANCELLED': {
          store.dispatch(reactionsCancelledAction(data.behaviourId));
          break;
        }
        default:
      }
    }
  );
}
