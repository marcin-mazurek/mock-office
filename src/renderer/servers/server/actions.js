export const START = 'server/START';
export const STOP = 'server/STOP';

export const start = id => ({
  type: START,
  id
});

export const stop = id => ({
  type: STOP,
  id
});
