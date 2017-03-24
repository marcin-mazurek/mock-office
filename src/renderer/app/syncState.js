import { remote } from 'electron';
import { add, start } from '../servers/actions';
import { add as addDescription } from '../descriptions/addDescription/actions';

export default (store) => {
  const servers = remote.require('./main/servers').default.servers;

  for (let i = 0; i < servers.length; i += 1) {
    const { instance, id } = servers[i];
    store.dispatch(add(instance.name, instance.port, instance.type, id));

    if (instance.isLive()) {
      store.dispatch(start(id));
    }

    const scenario = instance.scenario;
    const descriptions = scenario.descriptions;

    for (let descriptionIndex = 0; descriptionIndex < descriptions.length; descriptionIndex += 1) {
      const description = descriptions[descriptionIndex];
      store.dispatch(
        addDescription(
          id,
          description.id,
          description.descriptionPayload,
          description.title,
          description.interval,
          description.reuse,
          description.quantity,
          description.delay,
          description.requirements,
          description.blocking
        )
      );
    }
  }
};
