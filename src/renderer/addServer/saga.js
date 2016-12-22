import { call, take, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { ADD } from './actions';
import { ADD_SERVER } from '../../common/messageNames';
import { add as dispatchAdd } from '../servers/actions';

const addServerChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(ADD_SERVER, (event, server) => {
      emitter(server);
    });

    return () => {
    };
  })
);

function* add(name, port) {
  ipcRenderer.send(ADD_SERVER, { name, port });
  const channel = yield call(addServerChannel);
  const { id } = yield take(channel);
  yield put(dispatchAdd(name, port, id));
}

export default function* addAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port } = yield take(ADD);
    yield call(add, name, port);
  }
}
