export const INIT = 'addServer/INIT';

export default (name, port, serverType) => ({
  type: INIT,
  name,
  port,
  serverType
});
