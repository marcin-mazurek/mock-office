import { eventChannel } from 'redux-saga';
import { take, spawn, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import {
  REQUEST_ADD,
  REQUEST_START,
  REQUEST_STOP,
  add,
  start,
  stop
} from '../servers/actions';
import { SERVER_ADD, SERVER_START, SERVER_STOP } from '../../common/messageNames';

function* requestAddServerAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port } = yield take(REQUEST_ADD);
    ipcRenderer.send(SERVER_ADD, { name, port });
  }
}

const addServerChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(SERVER_ADD, (event, server) => {
      emitter(server);
    });

    return () => {};
  })
);

function* serverAddedOnMainAgent() {
  const channel = yield call(addServerChannel);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port, id } = yield take(channel);
    yield put(add(name, port, id));
  }
}

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
    spawn(requestAddServerAgent),
    spawn(serverAddedOnMainAgent),
    spawn(requestStartAgent),
    spawn(requestStopAgent)
  ];
}
