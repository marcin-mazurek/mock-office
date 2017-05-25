import { Observable } from 'rxjs';
import { runAction, stopAction, addAction as addMockAction, removeAfterUseAction, finishAction } from '../entities/mocks/actions';
import { addAction, startAction } from '../entities/servers/actions';
import { addAction as addScenarioAction } from '../entities/scenarios/actions';
import { addAction as addTaskAction } from '../entities/tasks/actions';

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
