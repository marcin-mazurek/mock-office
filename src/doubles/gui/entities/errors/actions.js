export const ADD = 'errors/ADD';
export const REMOVE = 'errors/REMOVE';

export const add = reason => ({
  type: ADD,
  reason
});

export const remove = id => ({
  type: REMOVE,
  id
});
