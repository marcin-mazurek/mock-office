export const RESTORE_STATE = 'appSync/RESTORE_STATE';
export const restoreStateAction = servers => ({
  type: RESTORE_STATE,
  servers
});
