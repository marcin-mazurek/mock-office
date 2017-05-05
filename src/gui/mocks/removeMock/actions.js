export const INIT = 'removeMock/initAction';
export const REMOVE = 'mocks/REMOVE';
export const FINISH = 'mocks/FINISH';
export const REMOVE_AFTER_USE = 'mocks/REMOVE_AFTER_USE';

export const init = (serverId, mockId) => ({
  type: INIT,
  mockId,
  serverId
});

export const finish = (serverId, mockId) => ({
  type: FINISH,
  serverId,
  mockId
});

export const remove = (serverId, mockId, tasks) => ({
  type: REMOVE,
  serverId,
  mockId,
  tasks
});

export const removeAfterUse = (serverId, mockId) => ({
  type: REMOVE_AFTER_USE,
  serverId,
  mockId
});
