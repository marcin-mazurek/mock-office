import { Map } from 'immutable';
import R from 'ramda';
import { ADD, REMOVE } from './actions';

const initialState = new Map();

const addExpectation = R.invoker(2, 'set');
const extendWithId = id => R.assoc('id', id);
const removeExpectation = R.invoker(1, 'remove');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { expectationId, expectation } = action;

      return addExpectation(expectationId, extendWithId(expectationId)(expectation))(state);
    }
    case REMOVE: {
      const { id } = action;

      return removeExpectation(id)(state);
    }
    default: {
      return state;
    }
  }
};
