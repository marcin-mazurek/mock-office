import { eventChannel } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { stop, } from '../actions';
import { STOP as SERVER_STOP } from './actions';
import * as messageNames from '../../../common/messageNames';

const ipcRendererChannel = () => (
  eventChannel((emitter) => {
    // we can't emit undefined event, so we need to create empty one
    const EMPTY_EVENT = {};
    ipcRenderer.on(messageNames.SERVER_STOP, () => emitter(EMPTY_EVENT));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(SERVER_STOP);
    ipcRenderer.send(messageNames.SERVER_STOP, id);

    yield take(yield call(ipcRendererChannel));
    yield put(stop(id));
  }
}
