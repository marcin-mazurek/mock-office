import { push } from 'react-router-redux';
import { add, start } from '../servers/actions';
import { add as addTask } from '../tasks/addTask/actions';

export default (remote, store) => {
  const serversApi = remote.require('./main/servers').default;
  const servers = serversApi.getAll();

  for (let i = 0; i < servers.length; i += 1) {
    const server = servers[i];
    store.dispatch(add(server.name, server.port, server.type, server.id, server.queueId));

    if (server.isLive()) {
      store.dispatch(start(server.id));
    }
  }

  store.dispatch(push('/'));

  const queuesApi = remote.require('./main/queues').default;
  const queues = queuesApi.getAll();

  for (let i = 0; i < queues.length; i += 1) {
    const queue = queues[i];
    const tasks = queue.tasks;

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex += 1) {
      const task = tasks[taskIndex];
      store.dispatch(addTask(queue.id, task.id, task.taskPayload));
    }
  }
}
