export const SUBMIT_BUTTON_CLICKED = 'addServer/SUBMIT_BUTTON_CLICKED';
export const SUCCEED = 'addServer/SUCCEED';
export const FAILED = 'addServer/FAILED';

export const submitButtonClickAction = values => ({
  type: SUBMIT_BUTTON_CLICKED,
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
