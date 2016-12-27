export const ADD = 'expectations/ADD';
export const LOAD = 'expectations/LOAD';
export const UNLOAD = 'expectations/UNLOAD';

export const add = (serverId, expectations) => ({
  type: ADD,
  serverId,
  expectations
});

export const load = (serverId, expectationId, instanceId) => ({
  type: LOAD,
  serverId,
  expectationId,
  instanceId
});

export const unload = (serverId, expectationId) => ({
  type: UNLOAD,
  serverId,
  expectationId
});
