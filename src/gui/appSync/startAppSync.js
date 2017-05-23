import { Observable } from 'rxjs';
import { runAction, stopAction, addAction as addMockAction, removeAfterUseAction, finishAction } from '../entities/mocks/actions';
import { addAction, startAction } from '../entities/servers/actions';
import { addAction as addScenarioAction } from '../entities/scenarios/actions';
import { addAction as addTaskAction } from '../entities/tasks/actions';

const eventArgs2ActionPayload = data => [data.serverId, data.mockId];

export default function startAppSync(store) {
  const ws = new WebSocket('ws://127.0.0.1:3061');

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
          store.dispatch(stopAction(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(finishAction(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'MOCK_REMOVED_AFTER_USE': {
          setTimeout(() => {
            store.dispatch(removeAfterUseAction(...eventArgs2ActionPayload(data)));
          }, 5000);

          break;
        }
        case 'MOCK_START': {
          store.dispatch(runAction(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'RESTORE_STATE': {
          data.state.forEach((server) => {
            store.dispatch(addAction(server.id, {
              name: server.name,
              port: server.port,
              type: server.type,
              isSecure: server.isSecure,
              scenario: server.scenario
            }));

            store.dispatch(addScenarioAction(server.id, server.scenario));

            if (server.running) {
              store.dispatch(startAction(server.id));
            }

            server.mocks.forEach((mock) => {
              store.dispatch(
                addMockAction(
                  server.scenario, mock.id, {
                    title: mock.title,
                    interval: mock.interval,
                    reuse: mock.reuse,
                    quantity: mock.quantity,
                    delay: mock.delay,
                    requirements: mock.requirements
                  }
                )
              );
              mock.tasks.forEach(task => store.dispatch(addTaskAction(mock.id, task.id, task)));
            });
          });

          break;
        }
        default:
      }
    }
  );
}
