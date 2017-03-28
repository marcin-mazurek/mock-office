import { remote } from 'electron';
import { FINISH, INIT, remove } from './actions';

export const removeTaskEpic = action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { serverId, taskId } = action;
      const server = remote.require('./main/servers').default.find(serverId);
      server.removeTask(taskId);
      return [serverId, taskId];
    }).map(task => remove(...task));

export const finishTaskEpic = action$ =>
  action$.ofType(FINISH)
    .delay(5000)
    .map(({ serverId, taskId }) => remove(serverId, taskId));
