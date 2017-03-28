export const INIT = 'remove/init';
export const FINISH = 'tasks/FINISH';
export const REMOVE = 'tasks/REMOVE';

export const init = (serverId, taskId) => ({
  type: INIT,
  taskId,
  serverId
});

export const finish = (serverId, taskId) => ({
  type: FINISH,
  serverId,
  taskId
});

export const remove = (serverId, taskId) => ({
  type: REMOVE,
  serverId,
  taskId
});
