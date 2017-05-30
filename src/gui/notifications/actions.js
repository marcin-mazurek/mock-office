export const ADD = 'notifications/ADD';
export const REMOVE = 'notifications/REMOVE';

export const removeAction = id => ({
  type: REMOVE,
  id
});

export const addAction = notification => ({
  type: ADD,
  notification
});
