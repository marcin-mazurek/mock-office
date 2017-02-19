export const INIT = 'addTask/INIT';

export const init = (serverId, task) => ({
  type: INIT,
  serverId,
  task
});
