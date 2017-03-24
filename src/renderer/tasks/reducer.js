import { Map, Record } from 'immutable';
import { ADD } from './addTask/actions';
import { RUN, STOP } from './runTask/actions';
import { REMOVE } from './removeTask/actions';

const initialState = new Map();
const Task = new Record({
  title: '',
  taskPayload: {},
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null,
  blocking: false,
  running: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { id } = action;
      const taskConfig = Object.keys(action).reduce((acc, next) => {
        const cfg = acc;
        if (action[next]) {
          cfg[next] = action[next];
        }

        return cfg;
      }, {});
      const task = new Task(taskConfig);

      return state.set(id, task);
    }
    case RUN: {
      return state.setIn([action.taskId, 'running'], true);
    }
    case STOP: {
      return state.setIn([action.taskId, 'running'], false);
    }
    case REMOVE: {
      return state.remove(action.taskId);
    }
    default: {
      return state;
    }
  }
};
