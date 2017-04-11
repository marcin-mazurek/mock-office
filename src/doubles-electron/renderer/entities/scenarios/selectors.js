export const getAll = state => state.get('queues');
export const getScenes = (queueId, state) => state.getIn(['queues', queueId, 'scenes']);
