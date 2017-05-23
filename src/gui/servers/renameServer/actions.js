export const INIT = 'renameServer/INIT';

export const initAction = (id, name) => ({
  type: INIT,
  id,
  name
});
