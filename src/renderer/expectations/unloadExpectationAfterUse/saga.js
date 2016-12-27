import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { EXPECTATION_UNLOAD_AFTER_USE } from '../../../common/messageNames';
import { unload } from '../actions';

export default function* agent() {
  const unloadChan = () => (
    eventChannel((emitter) => {
      ipcRenderer.on(EXPECTATION_UNLOAD_AFTER_USE, (event, args) => emitter(args));

      return () => {};
    })
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const chan = yield call(unloadChan);
    const { serverId, expectationId } = yield take(chan);
    yield put(unload(serverId, expectationId));
  }
}
