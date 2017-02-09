import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { TASK_REMOVED } from '../../../main/common/messageNames';
import { remove } from '../actions';

export default function* removeTaskAfterUseAgent() {
  const channel = () => (
    eventChannel((emitter) => {
      ipcRenderer.on(TASK_REMOVED, (event, args) => emitter(args));

      return () => {};
    })
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const removeTaskChannel = yield call(channel);
    const { queueId, taskId } = yield take(removeTaskChannel);
    yield put(remove(queueId, taskId));
  }
}
