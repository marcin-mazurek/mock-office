export const INITIALIZED = 'editServer/INITIALIZED';

export const initializedAction = (id, values) => ({
  type: INITIALIZED,
  id,
  values
});
