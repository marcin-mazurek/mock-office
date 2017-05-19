export const ADD = 'scenarios/ADD';
export const REMOVE = 'scenarios/REMOVE';

export const add = (serverId, scenarioId) => ({
  type: ADD,
  serverId,
  scenarioId
});

export const remove = id => ({
  type: REMOVE,
  id
});
