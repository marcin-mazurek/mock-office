import { fork } from 'redux-saga/effects';
import appSaga from '../app/saga';
import mocksSaga from '../mocks/saga';

export default function* rootSaga() {
  yield [
    yield fork(appSaga),
    yield fork(mocksSaga)
  ];
}
