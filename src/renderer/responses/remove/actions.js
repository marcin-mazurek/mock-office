export const INIT = 'removeResponse/init';

export const init = (queueId, responseId) => ({
  type: INIT,
  responseId,
  queueId
});
