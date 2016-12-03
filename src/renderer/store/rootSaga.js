import { fork } from 'redux-saga/effects';
import appSaga from '../app/saga';

export default function* rootSaga() {
  yield [
    yield fork(appSaga)
  ];
}
