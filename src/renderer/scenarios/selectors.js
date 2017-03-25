export const getAll = state => state.get('queues');
export const getQueueDescriptionIds = (queueId, state) => state.getIn(['queues', queueId, 'descriptions']);
