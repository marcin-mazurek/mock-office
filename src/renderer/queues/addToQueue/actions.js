export const INIT = 'addToQueue/INIT';

export const init = (serverId, expectationId, quantity, infinite) => ({
  type: INIT,
  serverId,
  expectationId,
  quantity,
  infinite
});
