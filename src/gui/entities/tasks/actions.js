export const ADD = 'tasks/ADD';
export const REMOVE = 'tasks/REMOVE';

export const addAction = (mockId, taskId, params) => ({
  type: ADD,
  mockId,
  taskId,
  params
});

export const removeAction = (mockId, taskId) => ({
  type: REMOVE,
  mockId,
  taskId
});
