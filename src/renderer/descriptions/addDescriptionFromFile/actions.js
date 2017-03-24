export const INIT = 'pickDescriptionFile/INIT';

export const init = (serverId, files) => ({
  type: INIT,
  serverId,
  files
});
