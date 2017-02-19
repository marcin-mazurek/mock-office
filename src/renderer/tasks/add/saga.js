import { put, select, take } from 'redux-saga/effects';
import { remote } from 'electron';
import { add as addTaskAction } from '../actions';
import { getSelectedServerDetails } from '../../servers/selectors';
import { INIT } from './actions';

export default function* addTaskAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, task } = yield take(INIT);
    const servers = remote.require('./main/servers').default;
    const taskId = servers.addTask(serverId, task);
    const { queue } = yield select(getSelectedServerDetails, serverId);
    yield put(addTaskAction(queue, taskId, task.taskPayload));
  }
}
