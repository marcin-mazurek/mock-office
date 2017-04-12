export const INIT = 'renameServer/INIT';

export const init = (id, name) => ({
  type: INIT,
  id,
  name
});
