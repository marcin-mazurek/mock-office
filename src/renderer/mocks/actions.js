export const LOAD = 'mocks/LOAD';
export const UNLOAD = 'mocks/UNLOAD';

export const load = id => ({
  type: LOAD,
  id
});

export const unload = id => ({
  type: UNLOAD,
  id
});
