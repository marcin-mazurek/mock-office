import { take } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { LOAD, UNLOAD } from './actions';

export default function* () {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { type, id } = yield take([LOAD, UNLOAD]);

    if (type === LOAD) {
      ipcRenderer.send('mock-load', id);
    } else {
      ipcRenderer.send('mock-unload', id);
    }
  }
}
