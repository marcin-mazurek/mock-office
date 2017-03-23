export const RUN = 'tasks/RUN';

export const run = (serverId, taskId) => ({
  type: RUN,
  serverId,
  taskId
});
