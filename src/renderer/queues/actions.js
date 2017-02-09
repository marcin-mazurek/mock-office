export const ADD_RESPONSE = 'queues/ADD_RESPONSE';
export const REMOVE_RESPONSE = 'queues/REMOVE_RESPONSE';
export const ADD_QUEUE = 'queues/ADD_QUEUE';

export const addTask = (queueId, taskId) => ({
  type: ADD_RESPONSE,
  queueId,
  taskId
});

export const removeTask = (queueId, taskId) => ({
  type: REMOVE_RESPONSE,
  queueId,
  taskId
});

export const addQueue = id => ({
  type: ADD_QUEUE,
  id
});
