export const ADD_RESPONSE = 'queues/ADD_RESPONSE';
export const REMOVE_RESPONSE = 'queues/REMOVE_RESPONSE';
export const ADD_QUEUE = 'queues/ADD_QUEUE';

export const addResponse = (queueId, responseId) => ({
  type: ADD_RESPONSE,
  queueId,
  responseId
});

export const removeResponse = id => ({
  type: REMOVE_RESPONSE,
  id
});

export const addQueue = (id, request) => ({
  type: ADD_QUEUE,
  id,
  request
});
