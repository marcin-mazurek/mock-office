import { Map, Record, List } from 'immutable';
import { ADD as ADD_SERVER } from '../servers/actions';
import { REMOVE as REMOVE_TASK } from '../tasks/removeTask/actions';
import { ADD as ADD_TASK } from '../tasks/addTask/actions';

const initialState = new Map();

const Queue = new Record({
  tasks: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVER: {
      const queue = new Queue();
      return state.set(action.id, queue);
    }
    case ADD_TASK: {
      return state.updateIn([action.serverId, 'tasks'], tasks => tasks.push(action.taskId));
    }
    case REMOVE_TASK: {
      return state.updateIn([action.serverId, 'tasks'], (tasks) => {
        const taskIndex = tasks.findIndex(taskId => taskId === action.taskId);
        return tasks.delete(taskIndex, 1);
      });
    }
    default: {
      return state;
    }
  }
};
