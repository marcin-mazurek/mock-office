import { spawn } from 'redux-saga/effects';
import mocksSaga from '../mocks/saga';
import serversSaga from '../servers/saga';

export default function* rootSaga() {
  yield [
    yield spawn(mocksSaga),
    yield spawn(serversSaga)
  ];
}
