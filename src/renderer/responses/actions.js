export const ADD = 'responses/ADD';
export const REMOVE = 'responses/REMOVE';

export const add = (response, responseId) => ({
  type: ADD,
  response,
  responseId
});

export const remove = id => ({
  type: REMOVE,
  id
});
