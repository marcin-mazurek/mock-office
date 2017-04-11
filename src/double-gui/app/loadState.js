import { add, start } from '../entities/servers/actions';
import { add as addScene } from '../scenes/addScene/actions';

const loadState = (store) => {
  fetch('http://127.0.0.1:3060/state')
    .then(res => res.json())
    .then((res) => {
      res.servers.forEach((server) => {
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
    });
};

export default loadState;
