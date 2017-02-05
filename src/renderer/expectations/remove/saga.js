import { remote } from 'electron';
import { take, put } from 'redux-saga/effects';
import { INIT } from './actions';
import { remove } from '../actions';
import { removeExpectation } from '../../queues/actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { queueId, expectationId } = yield take(INIT);
    const queues = remote.require('./main/queues').default;

    queues.removeExpectation(queueId, expectationId);
    yield put(remove(expectationId));
    yield put(removeExpectation(queueId, expectationId));
  }
}
