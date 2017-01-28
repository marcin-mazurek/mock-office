import { take, put, select, call } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { addResponse, addQueue } from '../actions';
import { getExpectation } from '../../expectations/selectors';
import prepareForCall from '../../utils/redux-saga';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { serverId, expectationId } = yield take(INIT);
    const queues = remote.require('./dist/main/queues').default;
    const expectation = yield select(getExpectation, expectationId);
    const { request, response } = expectation;
    const matchedQueue = yield call(prepareForCall(queues.findQueueByRequest), request);
    let currentQueueId;

    if (!matchedQueue) {
      currentQueueId = queues.addQueue(serverId, request);
      yield put(addQueue(currentQueueId, request));
    } else {
      currentQueueId = matchedQueue.id;
    }

    const responseId = queues.addResponse(currentQueueId, response);
    yield put(addResponse(currentQueueId, responseId, response));
  }
}
