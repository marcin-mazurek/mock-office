import { Observable } from 'rxjs';
import { removeAfterUse, finish } from '../mocks/removeMock/actions';
import { run, stop } from '../mocks/runMock/actions';
import { add, start } from '../entities/servers/actions';
import { add as addMock } from '../mocks/addMock/actions';

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
            store.dispatch(add(server.name, server.port, server.type, server.id, server.isSecure));

            if (server.running) {
              store.dispatch(start(server.id));
            }

            server.scenes.forEach((mock) => {
              store.dispatch(
                addMock(
                  server.id,
                  mock.id,
                  mock.title,
                  mock.interval,
                  mock.reuse,
                  mock.quantity,
                  mock.delay,
                  mock.requirements,
                  mock.parts
                )
              );
            });
          });

          break;
        }
        default:
      }
    }
  );
}
