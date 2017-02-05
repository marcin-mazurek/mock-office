import { Map, Record, List } from 'immutable';
import R from 'ramda';
import {
  ADD_QUEUE,
  ADD_RESPONSE,
  REMOVE_RESPONSE
} from './actions';

const initialState = new Map();

const Queue = new Record({
  id: '',
  responses: new List()
});

const addResponse = R.invoker(1, 'push');
const removeResponse = R.curry(
  (response, responses) => responses.delete(
    responses.findIndex(res => res === response),
    1)
);
const updateResponses = R.curry(
  (queueId, updater, currentState) =>
    currentState.updateIn([queueId, 'responses'], updater)
);
const constructQueue = queueId => new Queue({ id: queueId });
const addToQueues = R.invoker(2, 'set');

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUEUE: {
      const { id: queueId } = action;

      return addToQueues(queueId, constructQueue(queueId))(state);
    }
    case ADD_RESPONSE: {
      const { queueId, responseId } = action;

      return updateResponses(queueId, addResponse(responseId))(state);
    }
    case REMOVE_RESPONSE: {
      const { queueId, responseId } = action;

      return updateResponses(queueId, removeResponse(responseId))(state);
    }
    default: {
      return state;
    }
  }
};
