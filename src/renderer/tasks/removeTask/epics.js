import { remote } from 'electron';
import { INIT, remove } from './actions';

const removeTaskEpic = action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { serverId, taskId } = action;
      const server = remote.require('./main/servers').default.find(serverId);
      server.removeTask(taskId);
      return [serverId, taskId];
    }).map(task => remove(...task));

export default removeTaskEpic;
