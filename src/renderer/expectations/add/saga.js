import { put } from 'redux-saga/effects';
import { remote } from 'electron';
import { add as addExpectationAction } from '../actions';
import { addExpectation as addExpectationToQueueAction } from '../../queues/actions';

export default function* addExpectation(queueId, expectation) {
  const queues = remote.require('./main/queues').default;
  const expectationId = queues.addExpectation(queueId, expectation);
  yield put(addExpectationAction(expectation, expectationId));
  yield put(addExpectationToQueueAction(queueId, expectationId));
}
