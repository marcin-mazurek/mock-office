export const INIT = 'remove/init';
export const REMOVE = 'tasks/REMOVE';

export const init = (serverId, taskId) => ({
  type: INIT,
  taskId,
  serverId
});

export const remove = (serverId, taskId) => ({
  type: REMOVE,
  serverId,
  taskId
});
