export const REQUEST_ADD = 'servers/REQUEST_ADD';
export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';

export const add = (name, port, id) => ({
  type: ADD,
  name,
  port,
  id
});

export const requestAdd = (name, port) => ({
  type: REQUEST_ADD,
  name,
  port
});

export const select = id => ({
  type: SELECT,
  id
});
