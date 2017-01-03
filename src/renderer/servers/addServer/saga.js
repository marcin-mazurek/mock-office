import { call, fork, take, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { INIT } from './actions';
import { ADD_SERVER } from '../../../common/messageNames';
import { add } from '../actions';

const addServerChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(ADD_SERVER, (event, server) => {
      emitter(server);
    });

    return () => {
    };
  })
);

function* addServer(name, port, type) {
  ipcRenderer.send(ADD_SERVER, { name, port, type });
  const { id } = yield take(yield call(addServerChannel));
  yield put(add(name, port, type, id));
}

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port, serverType } = yield take(INIT);
    yield fork(addServer, name, port, serverType);
  }
}
