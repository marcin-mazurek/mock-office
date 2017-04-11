export const RUN = 'scenes/RUN';
export const STOP = 'scenes/STOP';

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
