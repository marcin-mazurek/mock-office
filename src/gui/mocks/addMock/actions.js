export const INIT = 'addMock/INIT';
export const ADD = 'mocks/ADD';

export const init = (serverId, mocks) => ({
  type: INIT,
  serverId,
  mocks
});

export const add = (serverId, mockId, title = 'untitled', interval, reuse, quantity, delay, requirements, tasks) => ({
  type: ADD,
  serverId,
  id: mockId,
  title,
  interval,
  reuse,
  quantity,
  delay,
  requirements,
  tasks
});
