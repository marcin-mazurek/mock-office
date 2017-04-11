export const INIT = 'pickSceneFile/INIT';

export const init = (serverId, files) => ({
  type: INIT,
  serverId,
  files
});
