export const INIT = 'importMock/INIT';
export const CANCELLED = 'importMock/CANCELLED';

export const initAction = (server, scenario, files) => ({
  type: INIT,
  server,
  scenario,
  files
});

export const cancelAction = () => ({
  type: CANCELLED
});
