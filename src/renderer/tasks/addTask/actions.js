export const INIT = 'addTask/INIT';
export const ADD = 'tasks/ADD';

export const init = (serverId, tasks) => ({
  type: INIT,
  serverId,
  tasks
});

export const add = (serverId, taskId, taskPayload, title = 'untitled', interval, reuse, quantity, delay, instant, requirements, blocking) => ({
  type: ADD,
  serverId,
  id: taskId,
  taskPayload,
  title,
  interval,
  reuse,
  quantity,
  delay,
  instant,
  requirements,
  blocking
});
