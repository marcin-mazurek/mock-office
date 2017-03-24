export const INIT = 'remove/init';
export const REMOVE = 'descriptions/REMOVE';

export const init = (serverId, descriptionId) => ({
  type: INIT,
  descriptionId,
  serverId
});

export const remove = (serverId, descriptionId) => ({
  type: REMOVE,
  serverId,
  descriptionId
});
