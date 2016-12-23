export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';
export const START_SERVER = 'servers/START_SERVER';
export const STOP = 'servers/STOP';

export const add = (name, port, id) => ({
  type: ADD,
  name,
  port,
  id
});

export const select = id => ({
  type: SELECT,
  id
});

export const startServer = id => ({
  type: START_SERVER,
  id
});

export const stop = id => ({
  type: STOP,
  id
});
