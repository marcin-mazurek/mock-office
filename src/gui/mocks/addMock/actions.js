export const INIT = 'addMock/INIT';

export const init = (server, scenario, mock) => ({
  type: INIT,
  server,
  scenario,
  mock
});
