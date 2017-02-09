export const INIT = 'remove/init';

export const init = (queueId, taskId) => ({
  type: INIT,
  taskId,
  queueId
});
