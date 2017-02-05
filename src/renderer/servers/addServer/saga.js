import { take, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { add, addQueue as addQueueToServer } from '../actions';
import { addQueue } from '../../queues/actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port, serverType: type } = yield take(INIT);
    const servers = remote.require('./main/servers').default;
    const queues = remote.require('./main/queues').default;
    const serverId = servers.add(name, port, type);
    const queueId = queues.getServerQueueId(serverId);

    yield put(add(name, port, type, serverId));
    yield put(addQueueToServer(serverId, queueId));
    yield put(addQueue(queueId));
  }
}
