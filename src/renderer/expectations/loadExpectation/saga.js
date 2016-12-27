import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import {
  EXPECTATION_LOAD
} from '../../../common/messageNames';
import { INIT } from './actions';
import { load } from '../actions';

const loadChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(EXPECTATION_LOAD, (event, args) => emitter(args.id));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, expectationId } = yield take(INIT);
    ipcRenderer.send(EXPECTATION_LOAD, { serverId, expectationId });

    const chan = yield call(loadChannel);
    const instanceId = yield take(chan);
    yield put(load(serverId, expectationId, instanceId));
  }
}
