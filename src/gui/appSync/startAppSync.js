import { Observable } from 'rxjs';
import { actionCreators } from '../entities/module';
import { restoreStateAction } from './actions';

export const REMOVE_AFTER_USE_MESSAGE_RECEIVED = 'appSync/REMOVE_AFTER_USE_MESSAGE_RECEIVED';
const removeAfterUseMessageReceivedAction = (scenario, id) => ({
  type: REMOVE_AFTER_USE_MESSAGE_RECEIVED,
  scenario,
  id
});

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
          store.dispatch(actionCreators.stopMockAction(data.mockId));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(actionCreators.finishMockAction(data.mockId));
          break;
        }
        case 'MOCK_REMOVED_AFTER_USE': {
          setTimeout(() => {
            store.dispatch(
              removeAfterUseMessageReceivedAction(data.scenario, data.mockId)
            );
          }, 5000);

          break;
        }
        case 'MOCK_START': {
          store.dispatch(actionCreators.runMockAction(data.mockId));
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
