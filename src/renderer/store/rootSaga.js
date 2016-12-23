import { spawn } from 'redux-saga/effects';
import mocksSaga from '../mocks/saga';
import serversSaga from '../servers/saga';
import addServerAgent from '../servers/addServer/saga';

export default function* rootSaga() {
  yield [
    yield spawn(mocksSaga),
    yield spawn(serversSaga),
    yield spawn(addServerAgent)
  ];
}
