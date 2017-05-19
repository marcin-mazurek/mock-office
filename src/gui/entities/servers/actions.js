export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';
export const START = 'servers/START';
export const STOP = 'servers/STOP';
export const REMOVE = 'servers/REMOVE';
export const RENAME = 'servers/RENAME';
export const UPDATE = 'server/UPDATE';

export const add = (id, params) => ({
  type: ADD,
  params,
  id
});

export const select = id => ({
  type: SELECT,
  id
});

export const start = id => ({
  type: START,
  id
});

export const stop = id => ({
  type: STOP,
  id
});

export const remove = id => ({
  type: REMOVE,
  id
});

export const rename = (id, name) => ({
  type: RENAME,
  id,
  name
});

export const update = (id, params) => ({
  type: UPDATE,
  id,
  params
});
