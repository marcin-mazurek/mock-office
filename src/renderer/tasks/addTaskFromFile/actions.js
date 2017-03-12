export const INIT = 'pickTaskFile/INIT';

export const init = (serverId, files) => ({
  type: INIT,
  serverId,
  files
});
