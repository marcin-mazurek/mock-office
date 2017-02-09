import { Map } from 'immutable';
import R from 'ramda';
import { ADD, REMOVE } from './actions';

const initialState = new Map();

const addTask = R.invoker(2, 'set');
const extendWithId = id => R.assoc('id', id);
const removeTask = R.invoker(1, 'remove');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { taskId, taskPayload } = action;

      return addTask(taskId, extendWithId(taskId)(taskPayload))(state);
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
