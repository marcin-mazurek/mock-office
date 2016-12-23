import { eventChannel } from 'redux-saga';
import { take, spawn, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import {
  stop,
} from '../servers/actions';
import { STOP as SERVER_STOP } from './server/actions';
import * as messageNames from '../../common/messageNames';

const stopChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(messageNames.SERVER_STOP, () => emitter('action'));

    return () => {};
  })
);

function* requestStopAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(SERVER_STOP);
    ipcRenderer.send(messageNames.SERVER_STOP, id);

    const chan = yield call(stopChannel);
    yield take(chan);
    yield put(stop(id));
  }
}

export default function* main() {
  yield [
    spawn(requestStopAgent)
  ];
}
