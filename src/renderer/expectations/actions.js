export const ADD = 'expectations/ADD';

export const add = (serverId, expectations) => ({
  type: ADD,
  serverId,
  expectations
});
