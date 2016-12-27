export const ADD = 'expectations/ADD';
export const FILE_PICK = 'expectations/FILE_PICK';
export const LOAD = 'expectations/LOAD';
export const UNLOAD = 'expectations/UNLOAD';
export const REQUEST_UNLOAD = 'expectations/REQUEST_UNLOAD';

export const filePick = files => ({
  type: FILE_PICK,
  files
});

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

export const requestUnload = (serverId, expectationId) => ({
  type: REQUEST_UNLOAD,
  serverId,
  expectationId
});
