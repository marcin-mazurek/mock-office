export const INIT = 'removeExpectation/init';

export const init = (queueId, expectationId) => ({
  type: INIT,
  expectationId,
  queueId
});
