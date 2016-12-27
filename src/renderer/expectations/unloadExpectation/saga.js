import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import {
  EXPECTATION_UNLOAD
} from '../../../common/messageNames';
import { INIT } from './actions';
import { unload } from '../actions';

const unloadChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(EXPECTATION_UNLOAD, () => emitter('action'));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, expectationId } = yield take(INIT);
    ipcRenderer.send(EXPECTATION_UNLOAD, { serverId, expectationId });

    const chan = yield call(unloadChannel);
    yield take(chan);
    yield put(unload(serverId, expectationId));
  }
}
