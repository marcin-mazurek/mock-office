import { remote } from 'electron';
import { getSelectedServerDetails } from '../../servers/selectors';
import { INIT, add } from './actions';

const addTaskEpic = (action$, store) =>
  action$.ofType(INIT)
    .map((action) => {
      const { serverId, task } = action;
      const { queue } = getSelectedServerDetails(store.getState());
      const taskId = remote.require('./main/servers').default.addTask(serverId, task);
      return [queue, taskId, task.taskPayload];
    }).map(task => add(...task));

export default addTaskEpic;
