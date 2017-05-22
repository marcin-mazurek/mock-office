export const SUBMIT = 'addHttpMock/SUBMIT';

export const submit = (server, scenario, formValues) => ({
  type: SUBMIT,
  server,
  scenario,
  formValues
});
