export const INIT = 'loadExpectation/INIT';

export const init = (serverId, expectationId, quantity, infinite) => ({
  type: INIT,
  serverId,
  expectationId,
  quantity,
  infinite
});
