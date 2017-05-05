export const RUN = 'mocks/RUN';
export const STOP = 'mocks/STOP';

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
