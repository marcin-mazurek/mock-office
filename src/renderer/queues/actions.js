export const ADD_RESPONSE = 'queues/ADD_RESPONSE';
export const REMOVE_RESPONSE = 'queues/REMOVE_RESPONSE';
export const ADD_QUEUE = 'queues/ADD_QUEUE';

export const addExpectation = (queueId, expectationId) => ({
  type: ADD_RESPONSE,
  queueId,
  expectationId
});

export const removeExpectation = (queueId, expectationId) => ({
  type: REMOVE_RESPONSE,
  queueId,
  expectationId
});

export const addQueue = id => ({
  type: ADD_QUEUE,
  id
});
