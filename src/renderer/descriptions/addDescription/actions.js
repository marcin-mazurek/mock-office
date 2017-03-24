export const INIT = 'addDescription/INIT';
export const ADD = 'descriptions/ADD';

export const init = (serverId, descriptions) => ({
  type: INIT,
  serverId,
  descriptions
});

export const add = (serverId, descriptionId, descriptionPayload, title = 'untitled', interval, reuse, quantity, delay, requirements, blocking) => ({
  type: ADD,
  serverId,
  id: descriptionId,
  descriptionPayload,
  title,
  interval,
  reuse,
  quantity,
  delay,
  requirements,
  blocking
});
