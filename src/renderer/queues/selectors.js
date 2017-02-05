export const getAll = state => state.get('queues');
export const getQueueResponses = (queueId, state) => state.getIn(['queues', queueId, 'responses']);
