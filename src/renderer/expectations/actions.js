export const ADD = 'expectations/ADD';
export const REMOVE = 'expectations/REMOVE';

export const add = (expectation, expectationId) => ({
  type: ADD,
  expectation,
  expectationId
});

export const remove = id => ({
  type: REMOVE,
  id
});
