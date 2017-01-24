import { take, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { unload } from '../actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, expectationId } = yield take(INIT);
    remote.require('./dist/main/expectations').default
      .unload(serverId, expectationId);
    yield put(unload(serverId, expectationId));
  }
}
