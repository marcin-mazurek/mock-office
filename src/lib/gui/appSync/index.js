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
          store.dispatch(stopMockMessageReceivedAction(data.mockId));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(finishMockMessageReceivedAction(data.mockId));
          break;
        }
        case 'MOCK_EXPIRE': {
          setTimeout(() => {
            store.dispatch(
              removeAfterUseMessageReceivedAction(data.scenarioId, data.mockId)
            );
          }, 3000);
          break;
        }
        case 'MOCK_START': {
          store.dispatch(runMockMessageReceivedAction(data.mockId));
          break;
        }
        case 'MOCK_CANCEL': {
          store.dispatch(cancelMockMessageReceived(data.mockId));
          break;
        }
        default:
      }
    }
  );
}
