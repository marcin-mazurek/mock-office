export const SUCCEEDED = 'addServer/SUCCEED';
export const FAILED = 'addServer/FAILED';

export const succeededAction = params => ({
  type: SUCCEEDED,
  params
});

export const failedAction = reason => ({
  type: FAILED,
  reason
});
