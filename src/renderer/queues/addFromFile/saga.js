import { take, call, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { remote } from 'electron';
import { addQueue, addResponse as addResponseToQueue } from '../actions';
import { INIT } from './actions';
import { getSelected } from '../../servers/selectors';
import { add as addResponse } from '../../responses/actions';
import { addQueue as addQueueToServer } from '../../servers/actions';

const readerChannel = reader => (
  eventChannel((emitter) => {
    // eslint-disable-next-line no-param-reassign
    reader.onload = e => emitter(JSON.parse(e.target.result));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const { files } = yield take(INIT);
      const file = files[0];
      const reader = new FileReader();
      const serverId = yield select(getSelected);

      const rChannel = yield call(readerChannel, reader);
      reader.readAsText(file);
      const queueToAdd = yield take(rChannel);

      const queues = remote.require('./dist/main/queues').default;
      const existedQueueId = queues.findQueueByRequest(serverId, queueToAdd.request);

      if (existedQueueId) {
        const responseId = queues.addResponse(existedQueueId, queueToAdd.response);
        yield put(addResponse(queueToAdd.response, responseId));
        yield put(addResponseToQueue(existedQueueId, responseId));
      } else {
        const newQueueId = queues.addQueue(serverId, queueToAdd.request);
        yield put(addQueue(newQueueId, queueToAdd.request));
        yield put(addQueueToServer(serverId, newQueueId));
        const responseId = queues.addResponse(newQueueId, queueToAdd.response);
        yield put(addResponse(queueToAdd.response, responseId));
        yield put(addResponseToQueue(newQueueId, responseId));
      }
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error(parseError.message);
    }
  }
}
