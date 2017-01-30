import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { REMOVE_RESPONSE_AFTER_USE } from '../../../common/messageNames';
import { removeResponse } from '../actions';

export default function* agent() {
  const channel = () => (
    eventChannel((emitter) => {
      ipcRenderer.on(REMOVE_RESPONSE_AFTER_USE, (event, args) => emitter(args));

      return () => {};
    })
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const removeResponseChannel = yield call(channel);
    const { queueId, responseId } = yield take(removeResponseChannel);
    yield put(removeResponse(queueId, responseId));
  }
}
