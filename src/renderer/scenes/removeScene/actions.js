export const INIT = 'remove/init';
export const REMOVE = 'scenes/REMOVE';

export const init = (serverId, sceneId) => ({
  type: INIT,
  sceneId,
  serverId
});

export const remove = (serverId, sceneId) => ({
  type: REMOVE,
  serverId,
  sceneId
});
