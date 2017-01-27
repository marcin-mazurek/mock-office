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
    // get expectation
    const expectation = yield select(getExpectation, expectationId);
    const { request, response } = expectation;
    console.log(expectation);
    // try to match queue by request object
    const matchedQueue = yield call(prepareForCall(queues.findQueueByRequest), request);
    let currentQueueId;

    // if not exists
    if (!matchedQueue) {
      // add queue on main process
      currentQueueId = queues.addQueue(serverId, request);

      // add queue on renderer
      yield put(addQueue(currentQueueId, request));
    } else {
      currentQueueId = matchedQueue.id;
    }

    // add response on main process
    const responseId = queues.addResponse(currentQueueId, response);

    // add response on renderer
    yield put(addResponse({ queueId: currentQueueId, responseId, response }));
  }
}
