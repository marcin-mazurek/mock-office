export const INIT = 'addToQueue/INIT';

export const init = (serverId, expectationId) => ({
  type: INIT,
  serverId,
  expectationId
});
