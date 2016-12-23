import { spawn } from 'redux-saga/effects';
import mocksSaga from '../mocks/saga';
import addServerAgent from '../servers/addServer/saga';
import serverStartAgent from '../servers/startServer/saga';
import serverStopAgent from '../servers/stopServer/saga';

export default function* rootSaga() {
  yield [
    yield spawn(mocksSaga),
    yield spawn(addServerAgent),
    yield spawn(serverStartAgent),
    yield spawn(serverStopAgent)
  ];
}
