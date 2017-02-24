export const INIT = 'addTask/INIT';
export const ADD = 'tasks/ADD';

export const init = (queueId, task) => ({
  type: INIT,
  queueId,
  task
});

export const add = (queueId, taskId, taskPayload) => ({
  type: ADD,
  queueId,
  taskId,
  taskPayload
});
