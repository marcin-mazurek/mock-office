export const INIT = 'addTask/INIT';
export const ADD = 'tasks/ADD';

export const init = (serverId, tasks) => ({
  type: INIT,
  serverId,
  tasks
});

export const add = (serverId, taskId, taskPayload, path = 'all paths') => ({
  type: ADD,
  serverId,
  taskId,
  taskPayload,
  path
});
