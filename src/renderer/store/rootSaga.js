import { spawn } from 'redux-saga/effects';
import expectationsSaga from '../expectations/saga';
import addServerAgent from '../servers/addServer/saga';
import serverStartAgent from '../servers/startServer/saga';
import serverStopAgent from '../servers/stopServer/saga';

export default function* rootSaga() {
  yield [
    yield spawn(expectationsSaga),
    yield spawn(addServerAgent),
    yield spawn(serverStartAgent),
    yield spawn(serverStopAgent)
  ];
}
