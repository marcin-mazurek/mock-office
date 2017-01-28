export const ADD = 'responses/ADD';

export const add = (response, responseId) => ({
  type: ADD,
  response,
  responseId
});
