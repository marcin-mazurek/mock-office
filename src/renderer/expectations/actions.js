export const ADD = 'expectations/ADD';
export const LOAD = 'expectations/LOAD';
export const UNLOAD = 'expectations/UNLOAD';

export const add = (serverId, expectations) => ({
  type: ADD,
  serverId,
  expectations
});

export const load = (serverId, expectationId, instanceId, quantity) => ({
  type: LOAD,
  serverId,
  expectationId,
  instanceId,
  quantity
});

export const unload = (serverId, expectationId) => ({
  type: UNLOAD,
  serverId,
  expectationId
});
