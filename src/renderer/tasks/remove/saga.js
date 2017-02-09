import { remote } from 'electron';
import { take, put } from 'redux-saga/effects';
import { INIT } from './actions';
import { remove } from '../actions';
import { removeTask } from '../../queues/actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { queueId, taskId } = yield take(INIT);
    const queues = remote.require('./main/queues').default;

    queues.removeTask(queueId, taskId);
    yield put(remove(taskId));
    yield put(removeTask(queueId, taskId));
  }
}
