import { Observable } from 'rxjs';
import { removeAfterUse, finish } from '../mocks/removeMock/actions';
import { run, stop, add as addMock } from '../entities/mocks/actions';
import { add, start } from '../entities/servers/actions';
import { add as addScenario } from '../entities/scenarios/actions';
import { add as addTask } from '../entities/tasks/actions';

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
          store.dispatch(stop(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'MOCK_END': {
          store.dispatch(finish(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'MOCK_REMOVED_AFTER_USE': {
          setTimeout(() => {
            store.dispatch(removeAfterUse(...eventArgs2ActionPayload(data)));
          }, 5000);
          break;
        }
        case 'MOCK_START': {
          store.dispatch(run(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'RESTORE_STATE': {
          data.state.forEach((server) => {
            store.dispatch(add(server.id, {
              name: server.name,
              port: server.port,
              type: server.type,
              isSecure: server.isSecure,
              scenario: server.id
            }));

            store.dispatch(addScenario(server.id, server.id));

            if (server.running) {
              store.dispatch(start(server.id));
            }

            server.mocks.forEach((mock) => {
              store.dispatch(
                addMock(
                  server.id, mock.id, {
                    title: mock.title,
                    interval: mock.interval,
                    reuse: mock.reuse,
                    quantity: mock.quantity,
                    delay: mock.delay,
                    requirements: mock.requirements
                  }
                )
              );
              mock.tasks.forEach(task => store.dispatch(addTask(mock.id, task.id, task)));
            });
          });

          break;
        }
        default:
      }
    }
  );
}
