export const ADD = 'errors/ADD';
export const REMOVE = 'errors/REMOVE';

export const add = reasons => ({
  type: ADD,
  reasons
});

export const remove = id => ({
  type: REMOVE,
  id
});
