export const INIT = 'removeTask/init';

export const init = (queueId, taskId) => ({
  type: INIT,
  taskId,
  queueId
});
