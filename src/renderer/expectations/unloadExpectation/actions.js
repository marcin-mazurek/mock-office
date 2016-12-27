export const INIT = 'unloadExpectation/INIT';

export const init = (serverId, expectationId) => ({
  type: INIT,
  serverId,
  expectationId
});
