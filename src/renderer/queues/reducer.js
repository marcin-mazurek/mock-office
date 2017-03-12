import { Map, Record, List } from 'immutable';
import R from 'ramda';
import { ADD as ADD_SERVER } from '../servers/actions';
import { REMOVE as REMOVE_TASK } from '../tasks/removeTask/actions';
import { ADD as ADD_TASK } from '../tasks/addTask/actions';

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
  (serverId, updater, currentState) =>
    currentState.updateIn([serverId, 'tasks'], updater)
);
const constructQueue = serverId => new Queue({ id: serverId });
const addToQueues = R.invoker(2, 'set');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVER: {
      const { id: serverId } = action;

      return addToQueues(serverId, constructQueue(serverId))(state);
    }
    case ADD_TASK: {
      const { serverId, taskId } = action;

      return updateTasks(serverId, addTask(taskId))(state);
    }
    case REMOVE_TASK: {
      const { serverId, taskId } = action;

      return updateTasks(serverId, removeTask(taskId))(state);
    }
    default: {
      return state;
    }
  }
};
