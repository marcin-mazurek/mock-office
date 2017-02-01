import { Map } from 'immutable';
import R from 'ramda';
import { ADD, REMOVE } from './actions';

const initialState = new Map();

const addResponse = R.invoker(2, 'set');
const extendWithId = id => R.assoc('id', id);
const removeResponse = R.invoker(1, 'remove');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { responseId, response } = action;

      return addResponse(responseId, extendWithId(responseId)(response))(state);
    }
    case REMOVE: {
      const { id } = action;

      return removeResponse(id)(state);
    }
    default: {
      return state;
    }
  }
};
