export const SUCCEEDED = 'toggleServer/SUCCEEDED';
export const FAILED = 'toggleServer/FAILED';

export const succeededAction = id => ({
  type: SUCCEEDED,
  id
});

export const failedAction = reason => ({
  type: FAILED,
  reason
});
