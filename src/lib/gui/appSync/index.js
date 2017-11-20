import { Observable } from 'rxjs';
import {
  stopMockMessageReceivedAction,
  finishMockMessageReceivedAction,
  removeAfterUseMessageReceivedAction,
  runMockMessageReceivedAction,
  cancelMockMessageReceived,
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
        case 'MOCK_STOP': {
          store.dispatch(stopMockMessageReceivedAction(data.behaviourId));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(finishMockMessageReceivedAction(data.behaviourId));
          break;
        }
        case 'MOCK_EXPIRE': {
          setTimeout(() => {
            store.dispatch(
              removeAfterUseMessageReceivedAction(data.scenarioId, data.behaviourId)
            );
          }, 3000);
          break;
        }
        case 'MOCK_START': {
          store.dispatch(runMockMessageReceivedAction(data.behaviourId));
          break;
        }
        case 'MOCK_CANCEL': {
          store.dispatch(cancelMockMessageReceived(data.behaviourId));
          break;
        }
        default:
      }
    }
  );
}
