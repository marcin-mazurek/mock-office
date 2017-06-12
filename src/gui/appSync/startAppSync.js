import { Observable } from 'rxjs';

export const RESTORE_STATE = 'appSync/RESTORE_STATE_MESSAGE_RECEIVED';
export const restoreStateAction = servers => ({
  type: RESTORE_STATE,
  servers
});

export const REMOVE_MOCK_MESSAGE_RECEIVED = 'appSync/REMOVE_MOCK_MESSAGE_RECEIVED';
const removeAfterUseMessageReceivedAction = (scenario, id) => ({
  type: REMOVE_MOCK_MESSAGE_RECEIVED,
  scenario,
  id
});
export const STOP_MOCK_MESSAGE_RECEIVED = 'appSync/STOP_MOCK_MESSAGE_RECEIVED';
const stopMockMessageReceivedAction = id => ({
  type: STOP_MOCK_MESSAGE_RECEIVED,
  id
});
export const FINISH_MOCK_MESSAGE_RECEIVED = 'appSync/FINISH_MOCK_MESSAGE_RECEIVED';
const finishMockMessageReceivedAction = id => ({
  type: FINISH_MOCK_MESSAGE_RECEIVED,
  id
});
export const RUN_MOCK_MESSAGE_RECEIVED = 'appSync/RUN_MOCK_MESSAGE_RECEIVED';
const runMockMessageReceivedAction = id => ({
  type: RUN_MOCK_MESSAGE_RECEIVED,
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
          store.dispatch(stopMockMessageReceivedAction(data.mockId));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(finishMockMessageReceivedAction(data.mockId));
          break;
        }
        case 'MOCK_REMOVED_AFTER_USE': {
          store.dispatch(
            removeAfterUseMessageReceivedAction(data.scenario, data.mockId)
          );
          break;
        }
        case 'MOCK_START': {
          store.dispatch(runMockMessageReceivedAction(data.mockId));
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
