export const getAll = state => state.get('queues');
export const getQueueTaskIds = (queueId, state) => state.getIn(['queues', queueId, 'tasks']);
