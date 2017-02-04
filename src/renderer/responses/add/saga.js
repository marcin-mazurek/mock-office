import { put } from 'redux-saga/effects';
import { remote } from 'electron';
import { add as addResponseAction } from '../actions';
import { addResponse as addResponseToQueueAction } from '../../queues/actions';

export default function* addResponse(queueId, response) {
  const queues = remote.require('./dist/main/queues').default;
  const responseId = queues.addResponse(queueId, response);
  yield put(addResponseAction(response, responseId));
  yield put(addResponseToQueueAction(queueId, responseId));
}
