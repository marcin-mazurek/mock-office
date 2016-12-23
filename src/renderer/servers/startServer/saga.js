import { eventChannel } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { INIT } from './actions';
import { startServer } from '../actions';
import * as messageNames from '../../../common/messageNames';

const ipcRendererChannel = () => (
  eventChannel((emitter) => {
    // we can't emit undefined event, so we need to create empty one
    const EMPTY_EVENT = {};
    ipcRenderer.on(messageNames.SERVER_START, () => emitter(EMPTY_EVENT));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(INIT);
    ipcRenderer.send(messageNames.SERVER_START, id);
    yield take(yield call(ipcRendererChannel));
    yield put(startServer(id));
  }
}
