import { take, spawn, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { LOAD, UNLOAD } from './actions';

function* filePickedAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { files } = yield take('mocks/FILE_PICKED');
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const mocksFromFile = JSON.parse(e.target.result);
        ipcRenderer.send('mock-loaded-from-file', mocksFromFile);
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }
    };
    reader.readAsText(file);
  }
}

const mocksAddedFromFileChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on('mocks-added-from-file', (event, mocks) => {
      emitter(mocks);
    });

    return () => {};
  })
);

function* mocksAddedFromFileAgent() {
  const channel = yield call(mocksAddedFromFileChannel);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const mocks = yield take(channel);
    yield put({ type: 'mocks/LOAD_MOCKS', mocks });
  }
}

function* fileLoadAgent() {
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

export default function* main() {
  yield [
    spawn(filePickedAgent),
    spawn(fileLoadAgent),
    spawn(mocksAddedFromFileAgent)
  ];
}
