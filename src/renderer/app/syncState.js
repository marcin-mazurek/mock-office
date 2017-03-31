import { remote } from 'electron';
import { add, start } from '../servers/actions';
import { add as addScene } from '../scenes/addScene/actions';

export default (store) => {
  const servers = remote.require('./main/servers').default.servers;

  servers.forEach((server) => {
    store.dispatch(add(server.name, server.port, server.type, server.id));

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
