export const INIT = 'addServer/INIT';
export const OPEN_MODAL = 'addServer/OPEN_MODAL';
export const CLOSE_MODAL = 'addServer/CLOSE_MODAL';

export default (name, port, serverType, isSecure, keyPath, certPath) => ({
  type: INIT,
  name,
  port,
  serverType,
  isSecure,
  keyPath,
  certPath
});

export const openModal = () => ({
  type: OPEN_MODAL
});

export const closeModal = () => ({
  type: CLOSE_MODAL
});
