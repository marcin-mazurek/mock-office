export const INIT = 'addServer/INIT';

export default (name, port) => ({
  type: INIT,
  name,
  port
});
