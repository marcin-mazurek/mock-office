export const ADD = 'tasks/ADD';
export const REMOVE = 'tasks/REMOVE';

export const add = (task, taskId) => ({
  type: ADD,
  task,
  taskId
});

export const remove = id => ({
  type: REMOVE,
  id
});
