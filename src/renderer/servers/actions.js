export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';
export const START = 'servers/START';
export const STOP = 'servers/STOP';
export const ADD_QUEUE = 'servers/ADD_QUEUE';

export const add = (name, port, serverType, id) => ({
  type: ADD,
  name,
  port,
  id,
  serverType
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

export const addQueue = (serverId, queueId) => ({
  type: ADD_QUEUE,
  serverId,
  queueId
});
