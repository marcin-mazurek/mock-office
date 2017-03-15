import { Map, Record } from 'immutable';
import { REMOVE } from './removeTask/actions';
import { ADD } from './addTask/actions';

const initialState = new Map();
const Task = new Record({
  path: '',
  taskPayload: {},
  id: ''
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { taskId, taskPayload, path } = action;
      const task = new Task({ taskPayload, id: taskId, path });

      return state.set(taskId, task);
    }
    case REMOVE: {
      return state.remove(action.taskId);
    }
    default: {
      return state;
    }
  }
};
