export const getAll = state => state.get('queues');
export const getQueueTasks = (queueId, state) => state.getIn(['queues', queueId, 'tasks']);
