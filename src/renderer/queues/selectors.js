export const getAll = state => state.get('queues');
export const getQueueExpectations = (queueId, state) => state.getIn(['queues', queueId, 'expectations']);
