import { Observable } from 'rxjs';
import { remote } from 'electron';
import { getSelectedServerDetails } from '../../servers/selectors';
import { INIT, add } from './actions';

const addTaskEpic = (action$, store) =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { queueId, tasks } = action;
      const { queue } = getSelectedServerDetails(store.getState());
      const tasksForAdd = tasks.map((task) => {
        const taskId = remote.require('./main/queues').default.addTask(queueId, task);
        return [queue, taskId, task.taskPayload];
      });

      return Observable.from(tasksForAdd);
    }).map(task => add(...task));

export default addTaskEpic;
