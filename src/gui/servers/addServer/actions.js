export const INIT = 'addServer/INIT';

export default (name, port, serverType, isSecure, keyPath, certPath) => ({
  type: INIT,
  name,
  port,
  serverType,
  isSecure,
  keyPath,
  certPath
});
