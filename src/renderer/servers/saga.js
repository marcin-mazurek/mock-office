import { eventChannel } from 'redux-saga';
import { take, spawn, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { REQUEST_ADD, add } from '../servers/actions';
import { SERVER_ADD } from '../../common/messageNames';

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

export default function* main() {
  yield [
    spawn(requestAddServerAgent),
    spawn(serverAddedOnMainAgent)
  ];
}
