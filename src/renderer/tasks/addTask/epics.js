import { Observable } from 'rxjs';
import { remote } from 'electron';
import { INIT, add } from './actions';

const addTaskEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, tasks } = action;
      const tasksForAdd = tasks.map((task) => {
        const server = remote.require('./main/serversHub').default.find(serverId);
        const taskId = server.addTask(task);
        return [serverId, taskId, task.taskPayload, task.title];
      });

      return Observable.from(tasksForAdd);
    }).map(task => add(...task));

export default addTaskEpic;
