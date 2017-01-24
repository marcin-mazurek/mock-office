export const INIT = 'runScript/INIT';

export const init = (server, script) => ({
  type: INIT,
  script,
  server
});
