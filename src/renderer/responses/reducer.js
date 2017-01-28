import { Map } from 'immutable';
import R from 'ramda';
import { ADD } from './actions';

const initialState = new Map();

const addResponse = R.curry(
  (responseId, response, responses) => responses.set(responseId, response)
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { responseId, response } = action;

      return addResponse(responseId, response)(state);
    }
    default: {
      return state;
    }
  }
};
