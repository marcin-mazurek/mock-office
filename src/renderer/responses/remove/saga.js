import { remote } from 'electron';
import { take, put } from 'redux-saga/effects';
import { INIT } from './actions';
import { remove } from '../actions';
import { removeResponse } from '../../queues/actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { queueId, responseId } = yield take(INIT);
    const queues = remote.require('./dist/main/queues').default;

    queues.removeResponse(queueId, responseId);
    yield put(remove(responseId));
    yield put(removeResponse(queueId, responseId));
  }
}
