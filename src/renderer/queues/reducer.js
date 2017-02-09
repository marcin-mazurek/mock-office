import { Map, Record, List } from 'immutable';
import R from 'ramda';
import {
  ADD_QUEUE,
  ADD_RESPONSE,
  REMOVE_RESPONSE
} from './actions';

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
    case ADD_QUEUE: {
      const { id: queueId } = action;

      return addToQueues(queueId, constructQueue(queueId))(state);
    }
    case ADD_RESPONSE: {
      const { queueId, taskId } = action;

      return updateTasks(queueId, addTask(taskId))(state);
    }
    case REMOVE_RESPONSE: {
      const { queueId, taskId } = action;

      return updateTasks(queueId, removeTask(taskId))(state);
    }
    default: {
      return state;
    }
  }
};
