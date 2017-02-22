import { Map } from 'immutable';
import R from 'ramda';
import { REMOVE } from './removeTask/actions';
import { ADD } from './addTask/actions';

const initialState = new Map();

const addTask = R.invoker(2, 'set');
const removeTask = R.invoker(1, 'remove');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { taskId, taskPayload } = action;

      return addTask(taskId, ({ taskPayload, id: taskId }))(state);
    }
    case REMOVE: {
      const { taskId } = action;

      return removeTask(taskId)(state);
    }
    default: {
      return state;
    }
  }
};
