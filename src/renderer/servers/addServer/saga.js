import { take, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { add } from '../actions';
import { addQueue } from '../../queues/actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port, serverType: type } = yield take(INIT);
    const servers = remote.require('./main/servers').default;
    const { serverId, queueId } = servers.add(name, port, type);

    yield put(add(name, port, type, serverId, queueId));
    yield put(addQueue(queueId));
  }
}
