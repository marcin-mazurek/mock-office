export const getAll = state => state.get('queues');
export const getQueueSceneIds = (queueId, state) => state.getIn(['queues', queueId, 'scenes']);
