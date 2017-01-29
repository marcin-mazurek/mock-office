import { Map, Record, List } from 'immutable';
import R from 'ramda';
import { ADD_QUEUE, ADD_RESPONSE } from './actions';

const initialState = new Map({
  queues: new Map()
});

const Queue = new Record({
  request: {},
  responses: new List()
});

const addToQueueResponses = R.curry(
  (response, responses) => responses.push(response)
);
const mapQueueResponses = R.curry(
  (queueId, updater, currentState) =>
    currentState.updateIn(['queues', queueId, 'responses'], updater)
);
const mapQueues = R.curry(
  (updater, currentState) => currentState.update('queues', updater)
);
const addToQueues = R.curry(
  (queueId, request, queues) => queues.set(queueId, new Queue({ request }))
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUEUE: {
      const { request, id: queueId } = action;

      return mapQueues(addToQueues(queueId, request))(state);
    }
    case ADD_RESPONSE: {
      const { queueId, responseId } = action;

      return mapQueueResponses(queueId, addToQueueResponses(responseId))(state);
    }
    default: {
      return state;
    }
  }
};
