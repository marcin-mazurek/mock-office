export const INIT = 'addTask/INIT';
export const ADD = 'tasks/ADD';

export const init = (queueId, tasks) => ({
  type: INIT,
  queueId,
  tasks
});

export const add = (queueId, taskId, taskPayload) => ({
  type: ADD,
  queueId,
  taskId,
  taskPayload
});
