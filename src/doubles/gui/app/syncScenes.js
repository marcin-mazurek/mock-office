import { Observable } from 'rxjs';
import { removeAfterUse, finish } from '../scenes/removeScene/actions';
import { run, stop } from '../scenes/runScene/actions';
import { add, start } from '../entities/servers/actions';
import { add as addScene } from '../scenes/addScene/actions';
import wsConnect from '../wsConnect';

const eventArgs2ActionPayload = data => [data.serverId, data.sceneId];
const ws = new WebSocket('ws://127.0.0.1:3061');

wsConnect.socket = ws;

export default (store) => {
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
        case 'SCENE_STOP': {
          store.dispatch(stop(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'SCENE_END': {
          store.dispatch(finish(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'SCENE_REMOVED_AFTER_USE': {
          setTimeout(() => {
            store.dispatch(removeAfterUse(...eventArgs2ActionPayload(data)));
          }, 5000);
          break;
        }
        case 'SCENE_START': {
          store.dispatch(run(...eventArgs2ActionPayload(data)));
          break;
        }
        case 'RESTORE_STATE': {
          data.state.servers.forEach((server) => {
            store.dispatch(add(server.name, server.port, server.type, server.id, server.isSecure));

            if (server.running) {
              store.dispatch(start(server.id));
            }

            server.scenes.forEach((scene) => {
              store.dispatch(
                addScene(
                  server.id,
                  scene.id,
                  scene.title,
                  scene.interval,
                  scene.reuse,
                  scene.quantity,
                  scene.delay,
                  scene.requirements,
                  scene.parts
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
};
