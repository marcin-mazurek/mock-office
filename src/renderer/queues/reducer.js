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
  expectations: new List()
});

const addExpectation = R.invoker(1, 'push');
const removeExpectation = R.curry(
  (expectation, expectations) => expectations.delete(
    expectations.findIndex(res => res === expectation),
    1)
);
const updateExpectations = R.curry(
  (queueId, updater, currentState) =>
    currentState.updateIn([queueId, 'expectations'], updater)
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
      const { queueId, expectationId } = action;

      return updateExpectations(queueId, addExpectation(expectationId))(state);
    }
    case REMOVE_RESPONSE: {
      const { queueId, expectationId } = action;

      return updateExpectations(queueId, removeExpectation(expectationId))(state);
    }
    default: {
      return state;
    }
  }
};
