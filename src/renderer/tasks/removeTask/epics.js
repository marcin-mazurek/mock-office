import { remote } from 'electron';
import { INIT, remove } from './actions';

const removeTaskEpic = action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { queueId, taskId } = action;
      remote.require('./main/queues').default.removeTask(queueId, taskId);
      return [queueId, taskId];
    }).map(task => remove(...task));

export default removeTaskEpic;
