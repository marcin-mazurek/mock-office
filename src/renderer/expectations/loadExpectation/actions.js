export const INIT = 'loadExpectation/INIT';

export const init = (serverId, expectationId) => ({
  type: INIT,
  serverId,
  expectationId
});
