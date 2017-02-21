export const INIT = 'remove/init';
export const REMOVE = 'tasks/REMOVE';

export const init = (queueId, taskId) => ({
  type: INIT,
  taskId,
  queueId
});

export const remove = (queueId, taskId) => ({
  type: REMOVE,
  queueId,
  taskId
});
