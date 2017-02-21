import { remote } from 'electron';
import { take, put } from 'redux-saga/effects';
import { INIT, remove } from './actions';

export default function* removeTaskAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { queueId, taskId } = yield take(INIT);
    const queues = remote.require('./main/queues').default;

    queues.removeTask(queueId, taskId);
    yield put(remove(queueId, taskId));
  }
}
