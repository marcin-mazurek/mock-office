export const getQueue = (state, queueId) => state.get(['queues', queueId]);
export const getRequest = (state, queueId) => getQueue(state, queueId).request;
export const getResponses = (state, queueId) => getQueue(state, queueId).responses;
