import { eventChannel } from 'redux-saga';
import { take, spawn, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import {
  REQUEST_START,
  REQUEST_STOP,
  start,
  stop,
} from '../servers/actions';
import {
  SERVER_START,
  SERVER_STOP
} from '../../common/messageNames';

const startChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(SERVER_START, () => emitter('action'));

    return () => {};
  })
);

function* requestStartAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(REQUEST_START);
    ipcRenderer.send(SERVER_START, id);

    const chan = yield call(startChannel);
    yield take(chan);
    yield put(start(id));
  }
}

const stopChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(SERVER_STOP, () => emitter('action'));

    return () => {};
  })
);

function* requestStopAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(REQUEST_STOP);
    ipcRenderer.send(SERVER_STOP, id);

    const chan = yield call(stopChannel);
    yield take(chan);
    yield put(stop(id));
  }
}

export default function* main() {
  yield [
    spawn(requestStartAgent),
    spawn(requestStopAgent)
  ];
}
