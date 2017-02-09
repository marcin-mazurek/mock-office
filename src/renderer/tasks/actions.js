export const ADD = 'tasks/ADD';
export const REMOVE = 'tasks/REMOVE';

export const add = (queueId, taskId, taskPayload) => ({
  type: ADD,
  queueId,
  taskId,
  taskPayload
});

export const remove = (queueId, taskId) => ({
  type: REMOVE,
  queueId,
  taskId
});
