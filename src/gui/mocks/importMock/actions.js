export const INIT = 'importMock/INIT';
export const FAILED = 'importMock/FAILED';

export const initAction = (server, scenario, files) => ({
  type: INIT,
  server,
  scenario,
  files
});

export const failAction = () => ({
  type: FAILED
});
