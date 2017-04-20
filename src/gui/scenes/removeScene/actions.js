export const INIT = 'removeScene/init';
export const REMOVE = 'scenes/REMOVE';
export const FINISH = 'scenes/FINISH';
export const REMOVE_AFTER_USE = 'scenes/REMOVE_AFTER_USE';

export const init = (serverId, sceneId) => ({
  type: INIT,
  sceneId,
  serverId
});

export const finish = (serverId, sceneId) => ({
  type: FINISH,
  serverId,
  sceneId
});

export const remove = (serverId, sceneId, parts) => ({
  type: REMOVE,
  serverId,
  sceneId,
  parts
});

export const removeAfterUse = (serverId, sceneId) => ({
  type: REMOVE_AFTER_USE,
  serverId,
  sceneId
});
