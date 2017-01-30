import { Map, Record, List } from 'immutable';
import R from 'ramda';
import { ADD_QUEUE, ADD_RESPONSE } from './actions';

const initialState = new Map();

const Queue = new Record({
  id: '',
  request: {},
  responses: new List()
});

const addResponse = R.curry(
  (response, responses) => responses.push(response)
);
const updateResponses = R.curry(
  (queueId, updater, currentState) =>
    currentState.updateIn([queueId, 'responses'], updater)
);
const addQueue = R.curry(
  (queueId, request, currentState) => currentState.set(queueId, new Queue({ id: queueId, request }))
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUEUE: {
      const { request, id: queueId } = action;

      return addQueue(queueId, request)(state);
    }
    case ADD_RESPONSE: {
      const { queueId, responseId } = action;

      return updateResponses(queueId, addResponse(responseId))(state);
    }
    default: {
      return state;
    }
  }
};
