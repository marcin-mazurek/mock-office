export const INIT = 'importMock/INIT';
export const FAILED = 'importMock/FAILED';

export const initAction = (serverId, files) => ({
  type: INIT,
  serverId,
  files
});

export const failAction = () => ({
  type: FAILED
});
