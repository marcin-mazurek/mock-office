export const FORM_SUBMITTED = 'addServer/FORM_SUBMITTED';
export const SUCCEED = 'addServer/SUCCEED';
export const FAILED = 'addServer/FAILED';

export const formSubmittedAction = values => ({
  type: FORM_SUBMITTED,
  values
});

export const succeedAction = params => ({
  type: SUCCEED,
  params
});

export const failedAction = params => ({
  type: FAILED,
  params
});
