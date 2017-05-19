export const INIT = 'addMock/INIT';

export const init = (scenarioId, mock) => ({
  type: INIT,
  scenarioId,
  mock
});
