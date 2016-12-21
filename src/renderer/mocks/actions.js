export const ADD = 'mocks/ADD';
export const FILE_PICK = 'mocks/FILE_PICK';
export const LOAD = 'mocks/LOAD';
export const UNLOAD = 'mocks/UNLOAD';
export const REQUEST_LOAD = 'mocks/REQUEST_LOAD';
export const REQUEST_UNLOAD = 'mocks/REQUEST_UNLOAD';

export const filePick = files => ({
  type: FILE_PICK,
  files
});

export const add = (serverId, expectations) => ({
  type: ADD,
  expectations
});

export const load = (serverId, expectationId) => ({
  type: LOAD,
  serverId,
  expectationId
});

export const requestLoad = (serverId, expectationId) => ({
  type: REQUEST_LOAD,
  serverId,
  expectationId
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
