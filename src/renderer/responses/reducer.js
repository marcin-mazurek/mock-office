import { Map } from 'immutable';
import R from 'ramda';
import { ADD } from './actions';

const initialState = new Map();

const addResponse = R.curry(
  (responseId, response, responses) => responses.set(responseId, response)
);

const mapResponses = R.curry(
  (updater, currentState) =>
    currentState.update('responses', updater)
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { responseId, response } = action;

      return mapResponses(addResponse(responseId, response))(state);
    }
    default: {
      return state;
    }
  }
};
