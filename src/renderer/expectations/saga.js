import { take, spawn, call, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import {
  FILE_PICK,
  REQUEST_UNLOAD,
  add,
  unload
} from './actions';
import {
  EXPECTATION_ADD,
  EXPECTATION_UNLOAD,
  EXPECTATION_UNLOAD_AFTER_USE
} from '../../common/messageNames';
import { getSelected } from '../servers/selectors';

const expectationAddChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(EXPECTATION_ADD, (event, expectations) => {
      emitter(expectations);
    });

    return () => {};
  })
);

function* expectationAddAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { files } = yield take(FILE_PICK);
    const file = files[0];
    const reader = new FileReader();
    const serverId = yield select(getSelected);

    reader.onload = (e) => {
      try {
        const expectations = JSON.parse(e.target.result);
        ipcRenderer.send(EXPECTATION_ADD, {
          serverId,
          expectations
        });
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }
    };
    reader.readAsText(file);

    const channel = yield call(expectationAddChannel);
    const expectations = yield take(channel);
    yield put(add(serverId, expectations));
  }
}

const unloadChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(EXPECTATION_UNLOAD, () => emitter('action'));

    return () => {};
  })
);

function* requestUnloadAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, expectationId } = yield take(REQUEST_UNLOAD);
    ipcRenderer.send(EXPECTATION_UNLOAD, { serverId, expectationId });

    const chan = yield call(unloadChannel);
    yield take(chan);
    yield put(unload(serverId, expectationId));
  }
}

function* unloadAfterUseAgent() {
  const unloadChan = () => (
    eventChannel((emitter) => {
      ipcRenderer.on(EXPECTATION_UNLOAD_AFTER_USE, (event, args) => emitter(args));

      return () => {};
    })
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const chan = yield call(unloadChan);
    const { serverId, expectationId } = yield take(chan);
    yield put(unload(serverId, expectationId));
  }
}

export default function* main() {
  yield [
    spawn(expectationAddAgent),
    spawn(requestUnloadAgent),
    spawn(unloadAfterUseAgent)
  ];
}
