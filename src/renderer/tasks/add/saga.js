import { put, select } from 'redux-saga/effects';
import { remote } from 'electron';
import { add as addTaskAction } from '../actions';
import { getSelectedServerDetails } from '../../servers/selectors';

export default function* addTask(serverId, task) {
  const servers = remote.require('./main/servers').default;
  const taskId = servers.addTask(serverId, task, task.instant);
  const { queue } = yield select(getSelectedServerDetails, serverId);
  yield put(addTaskAction(queue, taskId, task.taskPayload));
}
