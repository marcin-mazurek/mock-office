import { Map, Record, List } from 'immutable';
import R from 'ramda';
import { ADD as ADD_SERVER } from '../servers/actions';
import { ADD as ADD_TASK, REMOVE as REMOVE_TASK } from '../tasks/actions';

const initialState = new Map();

const Queue = new Record({
  id: '',
  tasks: new List()
});

const addTask = R.invoker(1, 'push');
const removeTask = R.curry(
  (task, tasks) => tasks.delete(
    tasks.findIndex(res => res === task),
    1)
);
const updateTasks = R.curry(
  (queueId, updater, currentState) =>
    currentState.updateIn([queueId, 'tasks'], updater)
);
const constructQueue = queueId => new Queue({ id: queueId });
const addToQueues = R.invoker(2, 'set');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVER: {
      const { queueId } = action;

      return addToQueues(queueId, constructQueue(queueId))(state);
    }
    case ADD_TASK: {
      const { queueId, taskId } = action;

      return updateTasks(queueId, addTask(taskId))(state);
    }
    case REMOVE_TASK: {
      const { queueId, taskId } = action;

      return updateTasks(queueId, removeTask(taskId))(state);
    }
    default: {
      return state;
    }
  }
};
