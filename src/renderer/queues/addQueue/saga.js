import { put } from 'redux-saga/effects';
import { remote } from 'electron';
import { addQueue as addQueueToServerAction } from '../../servers/actions';
import { addQueue as addQueueAction } from '../actions';

export default function* addQueue(serverId) {
  const queues = remote.require('./dist/main/queues').default;
  const queueId = queues.addQueue(serverId);
  yield put(addQueueAction(queueId));
  yield put(addQueueToServerAction(serverId, queueId));

  return queueId;
}
