export const INIT = 'addTask/INIT';
export const ADD = 'tasks/ADD';

export const init = (serverId, task) => ({
  type: INIT,
  serverId,
  task
});

export const add = (queueId, taskId, taskPayload) => ({
  type: ADD,
  queueId,
  taskId,
  taskPayload
});
