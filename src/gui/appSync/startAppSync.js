import { Observable } from 'rxjs';
import { runAction, stopAction, removeAfterUseAction, finishAction } from '../entities/mocks/actions';
import { restoreStateAction } from './actions';

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
        case 'MOCK_STOP': {
          store.dispatch(stopAction(data.mockId));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(finishAction(data.mockId));
          break;
        }
        case 'MOCK_REMOVED_AFTER_USE': {
          setTimeout(() => {
            store.dispatch(removeAfterUseAction(data.scenario, data.mockId, data.tasks));
          }, 5000);

          break;
        }
        case 'MOCK_START': {
          store.dispatch(runAction(data.mockId));
          break;
        }
        case 'RESTORE_STATE': {
          store.dispatch(restoreStateAction(data.state));
          break;
        }
        default:
      }
    }
  );
}
