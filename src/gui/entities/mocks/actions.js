export const ADD = 'mocks/ADD';
export const REMOVE = 'mocks/REMOVE';
export const FINISH = 'mocks/FINISH';
export const REMOVE_AFTER_USE = 'mocks/REMOVE_AFTER_USE';
export const RUN = 'mocks/RUN';
export const STOP = 'mocks/STOP';

export const addAction = (scenario, id, params) => ({
  type: ADD,
  id,
  scenario,
  params
});

export const finishAction = (scenarioId, mockId) => ({
  type: FINISH,
  scenarioId,
  mockId
});

export const removeAction = (scenarioId, mockId) => ({
  type: REMOVE,
  scenarioId,
  mockId
});

export const removeAfterUseAction = (scenarioId, mockId) => ({
  type: REMOVE_AFTER_USE,
  scenarioId,
  mockId
});

export const runAction = id => ({
  type: RUN,
  id
});

export const stopAction = id => ({
  type: STOP,
  id
});
