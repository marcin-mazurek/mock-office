import { take, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { load } from '../actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, expectationId, quantity, infinite } = yield take(INIT);
    const instanceId = remote.require('./dist/main/expectations').default
      .load(serverId, expectationId, quantity, infinite);

    yield put(load(serverId, expectationId, instanceId, quantity));
  }
}
