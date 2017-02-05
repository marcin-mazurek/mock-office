export const ADD_RESPONSE = 'queues/ADD_RESPONSE';
export const REMOVE_RESPONSE = 'queues/REMOVE_RESPONSE';
export const ADD_QUEUE = 'queues/ADD_QUEUE';

export const addResponse = (queueId, responseId) => ({
  type: ADD_RESPONSE,
  queueId,
  responseId
});

export const removeResponse = (queueId, responseId) => ({
  type: REMOVE_RESPONSE,
  queueId,
  responseId
});

export const addQueue = id => ({
  type: ADD_QUEUE,
  id
});
