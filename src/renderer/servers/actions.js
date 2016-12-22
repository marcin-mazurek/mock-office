export const REQUEST_ADD = 'REQUEST_ADD';
export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';
export const START = 'servers/START';
export const STOP = 'servers/STOP';
export const REQUEST_START = 'servers/REQUEST_START';
export const REQUEST_STOP = 'servers/REQUEST_STOP';

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

export const requestStart = id => ({
  type: REQUEST_START,
  id
});

export const start = id => ({
  type: START,
  id
});

export const requestStop = id => ({
  type: REQUEST_STOP,
  id
});

export const stop = id => ({
  type: STOP,
  id
});
