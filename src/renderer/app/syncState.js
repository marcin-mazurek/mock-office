import { remote } from 'electron';
import { add, start } from '../servers/actions';
import { add as addTask } from '../tasks/addTask/actions';

export default (store) => {
  const servers = remote.require('./main/servers').default.servers;

  for (let i = 0; i < servers.length; i += 1) {
    const { instance, id } = servers[i];
    store.dispatch(add(instance.name, instance.port, instance.type, id, instance.isSecure));

    if (instance.isLive()) {
      store.dispatch(start(id));
    }

    const queue = instance.queue;
    const tasks = queue.tasks;

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex += 1) {
      const task = tasks[taskIndex];
      store.dispatch(
        addTask(
          id,
          task.id,
          task.taskPayload,
          task.title,
          task.interval,
          task.reuse,
          task.quantity,
          task.delay,
          task.requirements,
          task.blocking
        )
      );
    }
  }
};
