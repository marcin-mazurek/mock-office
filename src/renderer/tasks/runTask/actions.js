export const RUN = 'tasks/RUN';
export const STOP = 'tasks/STOP';

export const run = (serverId, taskId) => ({
  type: RUN,
  serverId,
  taskId
});

export const stop = (serverId, taskId) => ({
  type: STOP,
  serverId,
  taskId
});
