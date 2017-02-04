import { put } from 'redux-saga/effects';
import { remote } from 'electron';
import { addQueue, addResponse as addResponseToQueue } from '../../queues/actions';
import { add as addResponse } from '../../responses/actions';
import { addQueue as addQueueToServer } from '../../servers/actions';

export default function* addTaskAgent(serverId, queue) {
  const queues = remote.require('./dist/main/queues').default;
  const existedQueue = queues.findQueue(serverId, queue.request);

  if (existedQueue) {
    const responseId = queues.addResponse(existedQueue.id, queue.response);
    yield put(addResponse(queue.response, responseId));
    yield put(addResponseToQueue(existedQueue.id, responseId));
  } else {
    const newQueueId = queues.addQueue(serverId, queue.request);
    yield put(addQueue(newQueueId, queue.request));
    yield put(addQueueToServer(serverId, newQueueId));
    const responseId = queues.addResponse(newQueueId, queue.response);
    yield put(addResponse(queue.response, responseId));
    yield put(addResponseToQueue(newQueueId, responseId));
  }
}
