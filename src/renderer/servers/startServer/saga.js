import { eventChannel } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { START } from './actions';
import { startServer } from '../actions';
import * as messageNames from '../../../common/messageNames';

const ipcRendererChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(messageNames.SERVER_START, () => emitter('action'));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(START);
    ipcRenderer.send(messageNames.SERVER_START, id);

    const chan = yield call(ipcRendererChannel);
    yield take(chan);
    yield put(startServer(id));
  }
}
