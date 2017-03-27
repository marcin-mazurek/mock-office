import { remote } from 'electron';
import { add, start } from '../servers/actions';
import { add as addScene } from '../scenes/addScene/actions';

export default (store) => {
  const servers = remote.require('./main/servers').default.servers;

  for (let i = 0; i < servers.length; i += 1) {
    const { instance, id } = servers[i];
    store.dispatch(add(instance.name, instance.port, instance.type, id));

    if (instance.isLive()) {
      store.dispatch(start(id));
    }

    const scenario = instance.scenario;
    const scenes = scenario.scenes;

    for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex += 1) {
      const scene = scenes[sceneIndex];
      store.dispatch(
        addScene(
          id,
          scene.id,
          scene.scenePayload,
          scene.title,
          scene.interval,
          scene.reuse,
          scene.quantity,
          scene.delay,
          scene.requirements,
          scene.blocking
        )
      );
    }
  }
};
