export const INIT = 'remove/init';
export const WILL_REMOVE = 'tasks/WILL_REMOVE';
export const REMOVE = 'tasks/REMOVE';

export const init = (serverId, taskId) => ({
  type: INIT,
  taskId,
  serverId
});

export const willRemove = (serverId, taskId) => ({
  type: WILL_REMOVE,
  serverId,
  taskId
});

export const remove = (serverId, taskId) => ({
  type: REMOVE,
  serverId,
  taskId
});
