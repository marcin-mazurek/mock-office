export const LOAD = 'mocks/LOAD';
export const UNLOAD = 'mocks/UNLOAD';
export const ADD = 'mocks/ADD';
export const FILE_PICK = 'mocks/FILE_PICK';

export const load = id => ({
  type: LOAD,
  id
});

export const unload = id => ({
  type: UNLOAD,
  id
});

export const filePick = files => ({
  type: FILE_PICK,
  files
});

export const add = mocks => ({
  type: ADD,
  mocks
});
