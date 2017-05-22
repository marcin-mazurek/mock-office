export const ADD = 'scenarios/ADD';
export const REMOVE = 'scenarios/REMOVE';

export const add = (server, id) => ({
  type: ADD,
  server,
  id
});

export const remove = id => ({
  type: REMOVE,
  id
});
