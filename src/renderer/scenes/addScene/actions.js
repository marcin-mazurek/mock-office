export const INIT = 'addScene/INIT';
export const ADD = 'scenes/ADD';

export const init = (serverId, scenes) => ({
  type: INIT,
  serverId,
  scenes
});

export const add = (serverId, sceneId, scenePayload, title = 'untitled', interval, reuse, quantity, delay, requirements, blocking) => ({
  type: ADD,
  serverId,
  id: sceneId,
  scenePayload,
  title,
  interval,
  reuse,
  quantity,
  delay,
  requirements,
  blocking
});
