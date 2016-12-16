export const ADD = 'servers/ADD';
export const SELECT = 'servers/SELECT';

export const add = (name, port) => ({
  type: ADD,
  name,
  port
});

export const select = id => ({
  type: SELECT,
  id
});
