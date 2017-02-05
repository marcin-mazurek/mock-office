import { put, select } from 'redux-saga/effects';
import { remote } from 'electron';
import { add as addExpectationAction } from '../actions';
import { addExpectation as addExpectationToQueueAction } from '../../queues/actions';
import { getSelectedServerDetails } from '../../servers/selectors';

export default function* addExpectation(serverId, expectation) {
  const servers = remote.require('./main/servers').default;
  const expectationId = servers.addExpectation(serverId, expectation);
  const { queue } = yield select(getSelectedServerDetails, serverId);
  yield put(addExpectationAction(expectation, expectationId));
  yield put(addExpectationToQueueAction(queue, expectationId));
}
