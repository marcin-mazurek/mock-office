import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { REMOVE_RESPONSE_AFTER_USE } from '../../../main/common/messageNames';
import { remove } from '../actions';
import { removeExpectation } from '../../queues/actions';

export default function* agent() {
  const channel = () => (
    eventChannel((emitter) => {
      ipcRenderer.on(REMOVE_RESPONSE_AFTER_USE, (event, args) => emitter(args));

      return () => {};
    })
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const removeExpectationChannel = yield call(channel);
    const { queueId, expectationId } = yield take(removeExpectationChannel);
    yield put(remove(expectationId));
    yield put(removeExpectation(queueId, expectationId));
  }
}
