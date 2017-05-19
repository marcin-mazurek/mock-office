export const INIT = 'importMock/INIT';
export const FAILED = 'importMock/FAILED';

export const initAction = (serverId, scenarioId, files) => ({
  type: INIT,
  serverId,
  scenarioId,
  files
});

export const failAction = () => ({
  type: FAILED
});
