export const REMOVE_FROM_QUEUE = 'queues/REMOVE_FROM_QUEUE';

export const removeFromQueue = id => ({
  type: REMOVE_FROM_QUEUE,
  id
});
