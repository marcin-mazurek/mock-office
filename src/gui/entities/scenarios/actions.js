export const ADD = 'scenarios/ADD';
export const REMOVE = 'scenarios/REMOVE';

export const addAction = (server, id) => ({
  type: ADD,
  server,
  id
});

export const removeAction = id => ({
  type: REMOVE,
  id
});
