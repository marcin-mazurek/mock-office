export const SUCCEEDED = 'editServer/SUCCEEDED';
export const FAILED = 'editServer/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});
export const succeededAction = result => ({
  type: SUCCEEDED,
  result
});
