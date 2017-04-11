export const INIT = 'addScene/INIT';
export const ADD = 'scenes/ADD';

export const init = (serverId, scenes) => ({
  type: INIT,
  serverId,
  scenes
});

export const add = (serverId, sceneId, title = 'untitled', interval, reuse, quantity, delay, requirements, parts) => ({
  type: ADD,
  serverId,
  id: sceneId,
  title,
  interval,
  reuse,
  quantity,
  delay,
  requirements,
  parts
});
