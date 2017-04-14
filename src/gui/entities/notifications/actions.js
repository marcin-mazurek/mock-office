export const ADD = 'notifications/ADD';
export const REMOVE = 'notifications/REMOVE';

export const remove = id => ({
  type: REMOVE,
  id
});

export const add = notification => ({
  type: ADD,
  notification
});
