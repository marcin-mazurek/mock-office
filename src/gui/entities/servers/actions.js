export const ADD = 'servers/ADD';
export const START = 'servers/START';
export const STOP = 'servers/STOP';
export const REMOVE = 'servers/REMOVE';
export const RENAME = 'servers/RENAME';
export const UPDATE = 'server/UPDATE';

export const addAction = (id, params) => ({
  type: ADD,
  params,
  id
});

export const startAction = id => ({
  type: START,
  id
});

export const stopAction = id => ({
  type: STOP,
  id
});

export const removeAction = id => ({
  type: REMOVE,
  id
});

export const renameAction = (id, name) => ({
  type: RENAME,
  id,
  name
});

export const updateAction = (id, params) => ({
  type: UPDATE,
  id,
  params
});
