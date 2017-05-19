export const INIT = 'removeMock/initAction';

export const init = (serverId, scenarioId, mockId, tasks) => ({
  type: INIT,
  mockId,
  scenarioId,
  serverId,
  tasks
});
