import { Map } from 'immutable';
import R from 'ramda';
import { ADD } from './actions';

const initialState = new Map();

const addResponse = R.invoker(2, 'set');
const extendWithId = id => R.assoc('id', id);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { responseId, response } = action;

      return addResponse(responseId, extendWithId(responseId, response))(state);
    }
    default: {
      return state;
    }
  }
};
