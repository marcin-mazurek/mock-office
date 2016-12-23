export const ADD = 'addServer/ADD';

export const add = (name, port) => ({
  type: ADD,
  name,
  port
});
