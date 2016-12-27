export const INIT = 'loadExpectation/INIT';

export const init = (serverId, expectationId, quantity) => ({
  type: INIT,
  serverId,
  expectationId,
  quantity
});
