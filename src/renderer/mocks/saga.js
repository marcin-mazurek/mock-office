import { take, spawn, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import {
  LOAD,
  UNLOAD,
  FILE_PICK,
  add
} from './actions';
import {
  EXPECTATION_ADD,
  EXPECTATION_LOAD,
  EXPECTATION_UNLOAD
} from '../../common/messageNames';

function* filePickedAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { files } = yield take(FILE_PICK);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const mocksFromFile = JSON.parse(e.target.result);
        ipcRenderer.send(EXPECTATION_ADD, mocksFromFile);
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
    ipcRenderer.on(EXPECTATION_ADD, (event, mocks) => {
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
    yield put(add(mocks));
  }
}

function* fileLoadAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { type, id } = yield take([LOAD, UNLOAD]);

    if (type === LOAD) {
      ipcRenderer.send(EXPECTATION_LOAD, id);
    } else {
      ipcRenderer.send(EXPECTATION_UNLOAD, id);
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
