import { remote } from 'electron';
import { add, start } from '../entities/servers/actions';
import { add as addScene } from '../scenes/addScene/actions';

const loadState = (store) => {
  const servers = remote.require('./main').double.servers;

  servers.forEach((server) => {
    store.dispatch(add(server.name, server.port, server.type, server.id, server.isSecure));

    if (server.isLive()) {
      store.dispatch(start(server.id));
    }

    server.scenario.scenes.forEach((scene) => {
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
};

export default loadState;
