export const ADD = 'mocks/ADD';
export const REMOVE = 'mocks/REMOVE';
export const FINISH = 'mocks/FINISH';
export const REMOVE_AFTER_USE = 'mocks/REMOVE_AFTER_USE';

export const add = (scenario, id, params) => ({
  type: ADD,
  id,
  scenario,
  params
});

export const finish = (scenarioId, mockId) => ({
  type: FINISH,
  scenarioId,
  mockId
});

export const remove = (scenarioId, mockId) => ({
  type: REMOVE,
  scenarioId,
  mockId
});

export const removeAfterUse = (scenarioId, mockId) => ({
  type: REMOVE_AFTER_USE,
  scenarioId,
  mockId
});
