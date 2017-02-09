export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';
export const START = 'servers/START';
export const STOP = 'servers/STOP';

export const add = (name, port, serverType, id, queueId) => ({
  type: ADD,
  name,
  port,
  id,
  serverType,
  queueId
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
