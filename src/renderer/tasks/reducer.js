import { Map, Record } from 'immutable';
import { ADD } from './addTask/actions';
import { RUN, STOP } from './runTask/actions';
import { WILL_REMOVE, REMOVE } from './removeTask/actions';

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
  running: false,
  runCount: 0,
  lastRunTimestamp: null,
  lastDuration: null,
  willRemove: false
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
      const prevState = state.get(action.taskId);
      return state.mergeIn([action.taskId], {
        running: true,
        runCount: prevState.get('runCount') + 1,
        lastRunTimestamp: Date.now(),
        lastDuration: null
      });
    }
    case STOP: {
      const prevState = state.get(action.taskId);
      return state.mergeIn([action.taskId], {
        running: false,
        lastDuration: Date.now() - prevState.get('lastRunTimestamp')
      });
    }
    case WILL_REMOVE: {
      return state.setIn([action.taskId, 'willRemove'], true);
    }
    case REMOVE: {
      return state.remove(action.taskId);
    }
    default: {
      return state;
    }
  }
};
