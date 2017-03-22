import { Map, Record } from 'immutable';
import { REMOVE } from './removeTask/actions';
import { ADD } from './addTask/actions';

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
  blocking: false
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
    case REMOVE: {
      return state.remove(action.taskId);
    }
    default: {
      return state;
    }
  }
};
