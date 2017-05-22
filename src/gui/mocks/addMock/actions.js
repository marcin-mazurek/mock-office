export const INIT = 'addMock/INIT';

export const init = (serverId, scenarioId, mock) => ({
  type: INIT,
  serverId,
  scenarioId,
  mock
});
